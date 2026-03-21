from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allows React on localhost:5173 to call Flask on localhost:5000

# Machines

@app.route('/api/machines')
def get_machines():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM machines")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/api/machines/<int:id>')
def get_machine(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM machines WHERE id = ?", (id, ))
    res = cursor.fetchone()
    conn.close()

    if res is None:
        return jsonify({"error:": "machine not found"}), 404

    return jsonify(dict(res))

# Logs

@app.route('/api/logs')
def get_all_logs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM machine_logs ORDER BY recorded_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/api/logs/<int:id>')
def get_machine_log(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM machine_logs WHERE machine_id = ?", (id, ))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# Faults

@app.route('/api/faults')
def get_faults():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faults ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])

@app.route('/api/faults', methods=['POST'])
def create_faults(): 
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO faults (machine_id, description, severity, resolved, created_at)
        VALUES (?, ?, ?, 0, ?)
    ''', (
        data['machineId'],
        data['description'],
        data['severity'],
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    conn.commit()
    fault_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": fault_id,
        "machineId": data['machineId'],
        "description": data['description'],
        "severity": data['severity'],
        "resolved": False,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }), 201

if __name__ == '__main__':
    app.run(debug=True)
