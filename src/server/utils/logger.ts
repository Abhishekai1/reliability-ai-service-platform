import Database from 'better-sqlite3';
import { config } from '../core/config';

const db = new Database(config.DB_PATH);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    confidence REAL NOT NULL,
    status TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const logger = {
  log: (question: string, answer: string, confidence: number, status: string) => {
    const stmt = db.prepare('INSERT INTO logs (question, answer, confidence, status) VALUES (?, ?, ?, ?)');
    stmt.run(question, answer, confidence, status);
    console.log(`[LOG] ${new Date().toISOString()} - Q: ${question.substring(0, 50)}... | Status: ${status}`);
  },
  getLogs: () => {
    const stmt = db.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100');
    return stmt.all();
  }
};
