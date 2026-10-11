
import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabase("dictionary.db");

export function init() {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS words (
            word TEXT PRIMARY KEY NOT NULL,
            data TEXT NOT NULL
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS theme (
            id INTEGER PRIMARY KEY NOT NULL,
            isDark INTEGER NOT NULL
          );`
        );

        tx.executeSql(
          `INSERT OR IGNORE INTO theme (id, isDark)
           VALUES (1, 1);`
        );
      },
      reject,
      resolve
    );
  });
}

export function addWord(word) {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO words (word, data) VALUES (?, ?);`,
          [word.word, JSON.stringify(word)]
        );
      },
      reject,
      resolve
    );
  });
}

export function updateWord(word) {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE words SET data = ? WHERE word = ?;`,
          [JSON.stringify(word), word.word]
        );
      },
      reject,
      resolve
    );
  });
}

export function deleteWord(wordText) {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `DELETE FROM words WHERE word = ?;`,
          [wordText]
        );
      },
      reject,
      resolve
    );
  });
}

export function getWords() {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT data FROM words ORDER BY rowid;`,
          [],
          (_, result) => {
            const words = [];

            for (let i = 0; i < result.rows.length; i++) {
              words.push(JSON.parse(result.rows.item(i).data));
            }

            resolve(words);
          }
        );
      },
      reject
    );
  });
}

export function getTheme() {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT isDark FROM theme WHERE id = 1;`,
          [],
          (_, result) => {
            resolve(
              result.rows.length > 0
                ? Boolean(result.rows.item(0).isDark)
                : true
            );
          }
        );
      },
      reject
    );
  });
}

export function setTheme(isDark) {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO theme (id, isDark)
           VALUES (1, ?);`,
          [isDark ? 1 : 0]
        );
      },
      reject,
      resolve
    );
  });
}
