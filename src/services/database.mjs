import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src', 'db', 'database.sqlite');

const db = new sqlite3.Database(dbPath);

// documentation: https://github.com/TryGhost/node-sqlite3/wiki/API

const run = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(true);
    });
  });

const get = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });

const initDB = async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        is_done INTEGER DEFAULT 0
      )
    `);
  } catch (error) {
    throw new Error(error);
  }
};

export { initDB, run, get };
