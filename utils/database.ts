import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('emogo.db');

export interface EmotionRecord {
  id?: number;
  timestamp: string;
  emotionScore: number;
  videoPath: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  temperature: number | null;
  weatherCondition: string | null;
  weatherIcon: string | null;
}

export const initDatabase = async () => {
  try {
    // 檢查表是否存在並獲取欄位資訊
    let tableExists = false;
    let needsMigration = false;
    
    try {
      const tableInfo = await db.getAllAsync(`PRAGMA table_info(emotion_records)`);
      tableExists = tableInfo.length > 0;
      const columns = tableInfo.map((col: any) => col.name);
      needsMigration = !columns.includes('temperature');
    } catch (e) {
      tableExists = false;
    }
    
    if (!tableExists) {
      // 創建新表（包含所有欄位）
      await db.execAsync(`
        CREATE TABLE emotion_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          emotionScore INTEGER NOT NULL,
          videoPath TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          address TEXT,
          temperature INTEGER,
          weatherCondition TEXT,
          weatherIcon TEXT
        );
      `);
      console.log('Created new emotion_records table with weather fields');
    } else if (needsMigration) {
      // 遷移現有表
      console.log('Migrating existing table...');
      
      // 重命名舊表
      await db.execAsync(`ALTER TABLE emotion_records RENAME TO emotion_records_old;`);
      
      // 創建新表
      await db.execAsync(`
        CREATE TABLE emotion_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          emotionScore INTEGER NOT NULL,
          videoPath TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          address TEXT,
          temperature INTEGER,
          weatherCondition TEXT,
          weatherIcon TEXT
        );
      `);
      
      // 複製數據
      await db.execAsync(`
        INSERT INTO emotion_records (id, timestamp, emotionScore, videoPath, latitude, longitude, address)
        SELECT id, timestamp, emotionScore, videoPath, latitude, longitude, address
        FROM emotion_records_old;
      `);
      
      // 刪除舊表
      await db.execAsync(`DROP TABLE emotion_records_old;`);
      
      console.log('Migration completed successfully');
    } else {
      console.log('Database already up to date');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const insertEmotionRecord = async (record: Omit<EmotionRecord, 'id'>) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO emotion_records 
       (timestamp, emotionScore, videoPath, latitude, longitude, address, temperature, weatherCondition, weatherIcon) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      record.timestamp,
      record.emotionScore,
      record.videoPath,
      record.latitude,
      record.longitude,
      record.address,
      record.temperature,
      record.weatherCondition,
      record.weatherIcon
    );
    console.log('Record inserted with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting record:', error);
    throw error;
  }
};

export const getAllEmotionRecords = async (): Promise<EmotionRecord[]> => {
  try {
    const records = await db.getAllAsync<EmotionRecord>(
      'SELECT * FROM emotion_records ORDER BY timestamp DESC'
    );
    return records;
  } catch (error) {
    console.error('Error getting all records:', error);
    throw error;
  }
};

export const getRecordCount = async (): Promise<number> => {
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM emotion_records'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('Error getting record count:', error);
    return 0;
  }
};

export const clearAllRecords = async (): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM emotion_records');
    console.log('All records cleared successfully');
  } catch (error) {
    console.error('Error clearing all records:', error);
    throw error;
  }
};
