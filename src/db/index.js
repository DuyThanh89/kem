import Dexie from 'dexie';

export const db = new Dexie('Toan3HocTap');

db.version(1).stores({
  sessions: '++id, date, type, score, total, timestamp'
});

export const saveQuizToDB = async (sessionData) => {
  try {
    const id = await db.sessions.add({
      ...sessionData,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    });
    return id;
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const getHistory = async () => {
  return await db.sessions.orderBy('timestamp').reverse().toArray();
};
