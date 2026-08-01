import sqlite3
from datetime import datetime

DB_PATH = "experiments.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS experiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            n_a INTEGER,
            c_a INTEGER,
            n_b INTEGER,
            c_b INTEGER,
            alpha REAL,
            tails INTEGER,
            mde REAL,
            rate_a REAL,
            rate_b REAL,
            uplift REAL,
            p_value REAL,
            verdict TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_experiment(data: dict) -> int:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO experiments
        (name, n_a, c_a, n_b, c_b, alpha, tails, mde, rate_a, rate_b, uplift, p_value, verdict, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"], data["n_a"], data["c_a"], data["n_b"], data["c_b"],
        data["alpha"], data["tails"], data["mde"], data["rate_a"], data["rate_b"],
        data["uplift"], data["p_value"], data["verdict"], datetime.utcnow().isoformat()
    ))
    conn.commit()
    experiment_id = cursor.lastrowid
    conn.close()
    return experiment_id


def get_all_experiments() -> list:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM experiments ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def delete_experiment(experiment_id: int) -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM experiments WHERE id = ?", (experiment_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted