from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from models import mongo, init_db
import config
from bson import ObjectId

app = Flask(__name__)
app.config.from_object(config)
CORS(app)
init_db(app)

# -------------------- AUTH --------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if mongo.db.users.find_one({'username': data['username']}):
        return jsonify({'msg': 'User exists'}), 400
    mongo.db.users.insert_one({
        'username': data['username'],
        'password': data['password'],
        'role': 'student'
    })
    return jsonify({'msg': 'Registered'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = mongo.db.users.find_one({'username': data['username'], 'password': data['password']})
    if not user:
        return jsonify({'msg': 'Invalid'}), 401
    return jsonify({'msg': 'Login successful', 'role': user['role']})


# -------------------- CERTIFICATES --------------------
@app.route('/upload_certificate', methods=['POST'])
def upload_certificate():
    name = request.form['name']
    year = request.form['year']
    department = request.form['department']
    event_date = request.form['event_date']
    college_name = request.form['college_name']
    event_name = request.form['event_name']
    position = request.form['position']
    amount = request.form['amount']
    file = request.files['file']
    filename = secure_filename(file.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    mongo.db.certificates.insert_one({
        'name': name,
        'year': year,
        'department': department,
        'event_date': event_date,
        'college_name': college_name,
        'event_name': event_name,
        'position': position,
        'amount': amount,
        'filename': filename
    })
    return jsonify({'msg': 'Uploaded'})

@app.route('/get_certificates', methods=['GET'])
def get_certificates():
    certs = list(mongo.db.certificates.find({}))
    for c in certs:
        c['_id'] = str(c['_id'])
    return jsonify(certs)

@app.route('/delete_certificate/<cert_id>', methods=['DELETE'])
def delete_certificate(cert_id):
    cert = mongo.db.certificates.find_one({'_id': ObjectId(cert_id)})
    if cert:
        path = os.path.join(app.config['UPLOAD_FOLDER'], cert['filename'])
        if os.path.exists(path):
            os.remove(path)
        mongo.db.certificates.delete_one({'_id': ObjectId(cert_id)})
    return jsonify({'msg': 'Certificate deleted'})

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


# -------------------- EVENTS --------------------
@app.route('/add_event', methods=['POST'])
def add_event():
    data = request.json
    mongo.db.events.insert_one(data)
    return jsonify({'msg': 'Event added'})

@app.route('/get_events', methods=['GET'])
def get_events():
    events = list(mongo.db.events.find({}))
    for e in events:
        e['_id'] = str(e['_id'])
    return jsonify(events)

@app.route('/delete_event/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    mongo.db.events.delete_one({'_id': ObjectId(event_id)})
    return jsonify({'msg': 'Event deleted'})

@app.route('/update_event/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    mongo.db.events.update_one({'_id': ObjectId(event_id)}, {'$set': data})
    return jsonify({'msg': 'Event updated'})


# -------------------- WINNERS --------------------
@app.route('/add_winner', methods=['POST'])
def add_winner():
    file = request.files['file']
    text = request.form.get('text', '')  # get text if present
    filename = secure_filename(file.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    mongo.db.winners.insert_one({
        'filename': filename,
        'text': text
    })
    return jsonify({'msg': 'Winner added'})

@app.route('/get_winners', methods=['GET'])
def get_winners():
    winners = list(mongo.db.winners.find({}))
    for w in winners:
        w['_id'] = str(w['_id'])
    return jsonify(winners)

@app.route('/update_winner/<winner_id>', methods=['PUT'])
def update_winner(winner_id):
    data = request.json
    mongo.db.winners.update_one(
        {'_id': ObjectId(winner_id)},
        {'$set': {'text': data.get('text', '')}}
    )
    return jsonify({'msg': 'Winner updated'})

@app.route('/delete_winner/<winner_id>', methods=['DELETE'])
def delete_winner(winner_id):
    winner = mongo.db.winners.find_one({'_id': ObjectId(winner_id)})
    if winner:
        path = os.path.join(app.config['UPLOAD_FOLDER'], winner['filename'])
        if os.path.exists(path):
            os.remove(path)
        mongo.db.winners.delete_one({'_id': ObjectId(winner_id)})
    return jsonify({'msg': 'Winner deleted'})


# -------------------- MAIN --------------------
if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
