import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; error?: string }> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    return {
      isConnected: false,
      error: 'لم يتم تعيين متغير البيئة MONGODB_URI في ملف .env.local',
    };
  }

  if (cached.conn) {
    return { isConnected: true };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true };
  } catch (e: unknown) {
    cached.promise = null;
    const errorMsg = e instanceof Error ? e.message : 'خطأ غير معروف في الاتصال بـ MongoDB';
    return { isConnected: false, error: errorMsg };
  }
}

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  databaseName?: string;
  host?: string;
  error?: string;
}> {
  try {
    const res = await connectToDatabase();
    if (!res.isConnected || !mongoose.connection) {
      return { connected: false, error: res.error || 'غير متصل' };
    }

    // Ping the database
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      return {
        connected: true,
        databaseName: mongoose.connection.name,
        host: mongoose.connection.host,
      };
    }

    return { connected: false, error: 'لم يتم العثور على مثيل قاعدة البيانات' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'فشل اختبار اتصال MongoDB';
    return { connected: false, error: errorMsg };
  }
}

