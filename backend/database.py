import sqlite3

DB_PATH = "dashboard.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # machines table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS machines (
            id      INTEGER PRIMARY KEY,
            name    TEXT NOT NULL,
            location TEXT NOT NULL,
            status  TEXT NOT NULL DEFAULT 'running'
        )
    ''')

    # machine_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS machine_logs (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_id INTEGER NOT NULL,
            status     TEXT NOT NULL,
            uptime     REAL NOT NULL,
            recorded_at TEXT NOT NULL,
            FOREIGN KEY (machine_id) REFERENCES machines(id)
        )
    ''')

    # faults table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS faults (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_id  INTEGER NOT NULL,
            description TEXT NOT NULL,
            severity    TEXT NOT NULL,
            resolved    INTEGER NOT NULL DEFAULT 0,
            created_at  TEXT NOT NULL,
            FOREIGN KEY (machine_id) REFERENCES machines(id)
        )
    ''')

    # seed machines
    cursor.execute("SELECT COUNT(*) FROM machines")
    if cursor.fetchone()[0] == 0:
        machines = [
            (1, "Machine 1",  "Floor 1", "running"),
            (2, "Machine 2",  "Floor 1", "offline"),
            (3, "Machine 3",  "Floor 2", "running"),
            (4, "Machine 4",  "Floor 2", "offline"),
            (5, "Machine 5",  "Floor 1", "running"),
        ]
        cursor.executemany(
            "INSERT INTO machines (id, name, location, status) VALUES (?, ?, ?, ?)",
            machines
        )

    conn.commit()
    conn.close()
    print("Database initialised.")

if __name__ == "__main__":
    init_db()
