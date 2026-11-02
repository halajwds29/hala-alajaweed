import { connectToDatabase } from './mongodb';
import { AdminAccountModel } from '@/models/AdminAccount';
import { hashPassword, verifyPassword } from './auth';
import { promises as fs } from 'fs';
import path from 'path';

export interface StoredAdminAccount {
  username: string;
  passwordHash: string;
  tokenVersion: number;
  updatedAt: string;
}

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@hala2026!';

const LOCAL_ACCOUNT_FILE = path.join(process.cwd(), 'data', 'admin-account.json');

async function ensureDataFolder() {
  const dir = path.dirname(LOCAL_ACCOUNT_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // ignore on read-only serverless
  }
}

async function readLocalAccount(): Promise<StoredAdminAccount | null> {
  try {
    await ensureDataFolder();
    const data = await fs.readFile(LOCAL_ACCOUNT_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function writeLocalAccount(account: StoredAdminAccount): Promise<void> {
  try {
    await ensureDataFolder();
    await fs.writeFile(LOCAL_ACCOUNT_FILE, JSON.stringify(account, null, 2), 'utf8');
  } catch (err) {
    console.info('Local admin account write skipped or read-only:', err);
  }
}

/**
 * Get active admin account credentials with session token version
 */
export async function getActiveAdminAccount(): Promise<{
  username: string;
  passwordHash: string;
  tokenVersion: number;
  isDefault: boolean;
}> {
  // 1. Try MongoDB
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      const doc = await AdminAccountModel.findOne().lean();
      if (doc) {
        return {
          username: doc.username,
          passwordHash: doc.passwordHash,
          tokenVersion: doc.tokenVersion || 1,
          isDefault: false,
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
      tokenVersion: local.tokenVersion || 1,
      isDefault: false,
    };
  }

  // 3. Fallback to environment/initial defaults ONLY if no custom account exists
  const defaultHash = await hashPassword(DEFAULT_PASSWORD);
  return {
    username: DEFAULT_USERNAME,
    passwordHash: defaultHash,
    tokenVersion: 1,
    isDefault: true,
  };
}

/**
 * Verify credentials for login without any backdoors or default bypasses
 */
export async function verifyAdminCredentials(
  enteredUsername: string,
  enteredPass: string
): Promise<{ valid: boolean; username: string; tokenVersion: number }> {
  const active = await getActiveAdminAccount();

  const isUsernameMatch =
    enteredUsername.trim().toLowerCase() === active.username.trim().toLowerCase();

  if (!isUsernameMatch) {
    return { valid: false, username: '', tokenVersion: 1 };
  }

  // Strictly verify bcrypt hash
  let isPasswordMatch = false;
  if (active.passwordHash.startsWith('$2a$') || active.passwordHash.startsWith('$2b$')) {
    isPasswordMatch = await verifyPassword(enteredPass, active.passwordHash);
  } else if (active.isDefault) {
    // Only accept default password if database has not set any custom account yet
    isPasswordMatch = enteredPass === DEFAULT_PASSWORD;
  }

  return {
    valid: isPasswordMatch,
    username: active.username,
    tokenVersion: active.tokenVersion || 1,
  };
}

/**
 * Update username and/or password from Admin Dashboard
 * Invalids all previously issued sessions by incrementing tokenVersion
 */
export async function updateAdminCredentials(
  currentPass: string,
  newUsername?: string,
  newPassword?: string
): Promise<{ success: boolean; error?: string; username?: string; tokenVersion?: number }> {
  const active = await getActiveAdminAccount();

  // Verify current password first
  let isCurrentValid = false;
  if (active.passwordHash.startsWith('$2a$') || active.passwordHash.startsWith('$2b$')) {
    isCurrentValid = await verifyPassword(currentPass, active.passwordHash);
  } else if (active.isDefault) {
    isCurrentValid = currentPass === DEFAULT_PASSWORD;
  }

  if (!isCurrentValid) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }

  // Determine updated values
  const updatedUsername = newUsername && newUsername.trim() ? newUsername.trim() : active.username;
  let updatedHash = active.passwordHash;

  if (newPassword && newPassword.trim()) {
    if (newPassword.trim().length < 8) {
      return { success: false, error: 'يجب أن لا تقل كلمة المرور الجديدة عن 8 أحرف لضمان الأمان' };
    }
    updatedHash = await hashPassword(newPassword.trim());
  }

  // Increment tokenVersion to invalidate all existing sessions
  const nextTokenVersion = (active.tokenVersion || 1) + 1;

  const accountObj: StoredAdminAccount = {
    username: updatedUsername,
    passwordHash: updatedHash,
    tokenVersion: nextTokenVersion,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to MongoDB if connected
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await AdminAccountModel.findOneAndUpdate(
        {},
        {
          username: updatedUsername,
          passwordHash: updatedHash,
          tokenVersion: nextTokenVersion,
        },
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
    tokenVersion: nextTokenVersion,
  };
}
