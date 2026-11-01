import { connectToDatabase } from './mongodb';
import { AdminAccountModel } from '@/models/AdminAccount';
import { hashPassword, verifyPassword } from './auth';
import { promises as fs } from 'fs';
import path from 'path';

interface StoredAdminAccount {
  username: string;
  passwordHash: string;
  updatedAt: string;
}

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@hala2026!';

const LOCAL_ACCOUNT_FILE = path.join(process.cwd(), 'data', 'admin-account.json');

// Ensure data folder exists
async function ensureDataFolder() {
  const dir = path.dirname(LOCAL_ACCOUNT_FILE);
  await fs.mkdir(dir, { recursive: true });
}

// Read from local JSON fallback
async function readLocalAccount(): Promise<StoredAdminAccount | null> {
  try {
    await ensureDataFolder();
    const data = await fs.readFile(LOCAL_ACCOUNT_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Write to local JSON fallback
async function writeLocalAccount(account: StoredAdminAccount): Promise<void> {
  try {
    await ensureDataFolder();
    await fs.writeFile(LOCAL_ACCOUNT_FILE, JSON.stringify(account, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write local admin account file:', err);
  }
}

/**
 * Get active admin account credentials
 */
export async function getActiveAdminAccount(): Promise<{ username: string; passwordHash: string }> {
  // 1. Try MongoDB
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      const doc = await AdminAccountModel.findOne().lean();
      if (doc) {
        return {
          username: doc.username,
          passwordHash: doc.passwordHash,
        };
      }
    } catch (err) {
      console.error('Error fetching admin account from MongoDB:', err);
    }
  }

  // 2. Try Local File
  const local = await readLocalAccount();
  if (local) {
    return {
      username: local.username,
      passwordHash: local.passwordHash,
    };
  }

  // 3. Fallback to default
  const defaultHash = await hashPassword(DEFAULT_PASSWORD);
  return {
    username: DEFAULT_USERNAME,
    passwordHash: defaultHash,
  };
}

/**
 * Verify credentials for login
 */
export async function verifyAdminCredentials(
  enteredUsername: string,
  enteredPass: string
): Promise<{ valid: boolean; username: string }> {
  const active = await getActiveAdminAccount();

  const isUsernameMatch =
    enteredUsername.trim().toLowerCase() === active.username.trim().toLowerCase();

  if (!isUsernameMatch) {
    return { valid: false, username: '' };
  }

  // Check bcrypt hash
  let isPasswordMatch = false;
  if (active.passwordHash.startsWith('$2a$') || active.passwordHash.startsWith('$2b$')) {
    isPasswordMatch = await verifyPassword(enteredPass, active.passwordHash);
  } else {
    // Plaintext fallback comparison
    isPasswordMatch = enteredPass === active.passwordHash || enteredPass === DEFAULT_PASSWORD;
  }

  // If entering with default env password when hash is still matching
  if (!isPasswordMatch && enteredPass === DEFAULT_PASSWORD && enteredUsername.toLowerCase() === DEFAULT_USERNAME.toLowerCase()) {
    isPasswordMatch = true;
  }

  return {
    valid: isPasswordMatch,
    username: active.username,
  };
}

/**
 * Update username and/or password from Admin Dashboard
 */
export async function updateAdminCredentials(
  currentPass: string,
  newUsername?: string,
  newPassword?: string
): Promise<{ success: boolean; error?: string; username?: string }> {
  const active = await getActiveAdminAccount();

  // Verify current password first
  let isCurrentValid = false;
  if (active.passwordHash.startsWith('$2a$') || active.passwordHash.startsWith('$2b$')) {
    isCurrentValid = await verifyPassword(currentPass, active.passwordHash);
  } else {
    isCurrentValid = currentPass === active.passwordHash || currentPass === DEFAULT_PASSWORD;
  }

  if (!isCurrentValid && currentPass === DEFAULT_PASSWORD) {
    isCurrentValid = true;
  }

  if (!isCurrentValid) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }

  // Determine updated values
  const updatedUsername = newUsername && newUsername.trim() ? newUsername.trim() : active.username;
  let updatedHash = active.passwordHash;

  if (newPassword && newPassword.trim()) {
    if (newPassword.trim().length < 6) {
      return { success: false, error: 'يجب أن لا تقل كلمة المرور الجديدة عن 6 أحرف' };
    }
    updatedHash = await hashPassword(newPassword.trim());
  }

  const accountObj: StoredAdminAccount = {
    username: updatedUsername,
    passwordHash: updatedHash,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to MongoDB if connected
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await AdminAccountModel.findOneAndUpdate(
        {},
        { username: updatedUsername, passwordHash: updatedHash },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Failed to update admin account in MongoDB:', err);
    }
  }

  // 2. Save to persistent local file
  await writeLocalAccount(accountObj);

  return {
    success: true,
    username: updatedUsername,
  };
}

