import sqlite3
import random
import time
from datetime import datetime
from database import get_db

def simulate_reading():
    conn = get_db()
    cursor = conn.cursor()

    # get all machines
    cursor.execute("SELECT id, status FROM machines")
    machines = cursor.fetchall()

    for machine in machines:
        machine_id = machine["id"]
        status = machine["status"]

        # simulate realistic uptime — offline machines stay low
        if status == "offline":
            uptime = round(random.uniform(0, 15), 1)
        else:
            uptime = round(random.uniform(70, 99), 1)

        recorded_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute('''
            INSERT INTO machine_logs (machine_id, status, uptime, recorded_at)
            VALUES (?, ?, ?, ?)
        ''', (machine_id, status, uptime, recorded_at))

    conn.commit()
    conn.close()
    print(f"Sensor reading inserted at {datetime.now().strftime('%H:%M:%S')}")

if __name__ == "__main__":
    print("Mock sensor started — inserting readings every 5 seconds.")
    print("Press Ctrl+C to stop.\n")
    while True:
        simulate_reading()
        time.sleep(5)
