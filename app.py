# backend/app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask.cli import with_appcontext
import click

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# 数据模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'patient', 'doctor', 'admin'

class DoctorAvailability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    available_time = db.Column(db.DateTime, nullable=False)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)

@click.command(name='insert_initial_data')
@with_appcontext
def insert_initial_data():
    if not User.query.first():
        doctor = User(username='doctor1', role='doctor')
        patient = User(username='patient1', role='patient')
        
        db.session.add(doctor)
        db.session.add(patient)
        db.session.commit()
        print("Initial data inserted.")
    else:
        print("Data already exists.")
app.cli.add_command(insert_initial_data)
@app.route('/')
def index():
    return app.send_static_file('index.html')

# API端点示例
@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = User.query.filter_by(role='doctor').all()
    return jsonify([{'id': doc.id, 'username': doc.username} for doc in doctors])

@app.route('/appointments', methods=['POST'])
def book_appointment():
    data = request.json
    new_appointment = Appointment(
        doctor_id=data['doctor_id'],
        patient_id=data['patient_id'],
        appointment_time=datetime.strptime(data['appointment_time'], '%Y-%m-%d')
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment booked successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)
