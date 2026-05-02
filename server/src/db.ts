import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(":memory:");

db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    )
    `);

db.exec(`
    CREATE TABLE perfumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        brand TEXT,
        name TEXT,
        description TEXT,
        image_url TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `);

// db.exec(`
//     CREATE TABLE details (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     perfume_id INTEGER NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
//     description TEXT,
//     FOREIGN KEY(perfume_id) REFERENCES perfumes(id)
//     )
//     `);

db.exec(`
    CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    perfume_id INTEGER NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scent INTEGER CHECK(scent BETWEEN 1 AND 5),
    projection INTEGER CHECK(projection BETWEEN 1 AND 5),
    longevity INTEGER CHECK(longevity BETWEEN 1 AND 5),
    total_rating INTEGER GENERATED ALWAYS AS ((scent + projection + longevity) / 3) STORED,
    comment TEXT CHECK(length(comment) <= 200),
    
    UNIQUE(user_id, perfume_id)
    )
    `);
export default db;
