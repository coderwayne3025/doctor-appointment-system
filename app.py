# backend/app.py
# app.py
from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime
import logging

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# 数据模型
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80),nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'patient', 'doctor', 'admin'
    job = db.Column(db.String(20), nullable=True)

class DoctorAvailability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    available_time = db.Column(db.DateTime, nullable=False)

class Appointment(db.Model):
    patient_name = db.Column(db.String(80))
    doctor_name = db.Column(db.String(80))
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    department=db.Column(db.String(20), nullable=True)
    
    
   
   
   
    


# 登录管理
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# 注册新用户
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], password=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'})

# 用户登录
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        if user.role == 'admin':
            return jsonify({'message': 'Logged in as admin', 'redirect': '/admin'})
        elif user.role == 'doctor':
            return jsonify({'message': 'Logged in as doctor', 'redirect': '/doctor'})
        elif user.role == 'patient':
            return jsonify({'message': 'Logged in as patient', 'redirect': '/patient'})
    return jsonify({'message': 'Invalid credentials'}), 401

# 用户登出
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully!'})

# 保护路由示例
@app.route('/admin')
@login_required
def admin():
    if current_user.role != 'admin':
        return jsonify({'message': 'Access denied'}), 403
    return jsonify({'message': 'Welcome admin!'})

@app.route('/doctor')
@login_required
def doctor():
    if current_user.role != 'doctor':
        return jsonify({'message': 'Access denied'}), 403
    return app.send_static_file('doctor.html')

@app.route('/patient')
@login_required
def patient():
    if current_user.role != 'patient':
        return jsonify({'message': 'Access denied'}), 403
    return app.send_static_file('index.html')
@app.route('/')
def index():
    return app.send_static_file('MAIN/mainpage.html')
@app.route('/doctors', methods=['GET'])
def get_doctors():
    # 查询所有角色为医生的用户
    doctors = User.query.filter_by(role='doctor').all()

    # 查询所有医生的空闲时间
    availability_data = DoctorAvailability.query.all()

    # 构建医生ID到空闲时间的映射
    availability_map = {}
    for availability in availability_data:
        if availability.doctor_id not in availability_map:
            availability_map[availability.doctor_id] = []
        availability_map[availability.doctor_id].append(availability.available_time)

    # 构建返回的医生列表，包括空闲时间
    doctor_list = []
    for doc in doctors:
        doctor_list.append({
            'id': doc.id,
            'username': doc.username,
            'specialty': doc.job,
            'availability': availability_map.get(doc.id, [])  # 获取医生的空闲时间，如果没有则返回空列表
        })

    return jsonify(doctor_list)

@app.route('/appointments', methods=['POST'])
def book_appointment():
    data = request.json
    new_appointment = Appointment(
        doctor_id=data['selectedDoctorId'],
        patient_id=data['patientID'],
        patient_name=data['patientName'],
        doctor_name=data['selectedDoctor'],
        appointment_time=datetime.strptime(data['selectedTime'], '%Y-%m-%dT%H:%M'),
        department = data['selectedDepartment'],
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment booked successfully!'}), 201

@app.route('/doctor/set_availability', methods=['POST'])
@login_required
def set_availability():
    if current_user.role != 'doctor':
        return 'Access denied', 403
    print("hello")
    print(request)
    data = request.get_json()
    print(data)
    available_time = datetime.strptime(data['available_time'], '%Y-%m-%dT%H:%M')
    print(available_time)
    new_availability = DoctorAvailability(doctor_id=current_user.id, available_time=available_time)
    db.session.add(new_availability)
    db.session.commit()
    return jsonify({'message': 'Availability set successfully!'})
@app.route('/bookings', methods=['GET'])
def get_bookings():
    # 获取请求中的患者ID
    patient_id = current_user.id
    
    

    try:
        # 查询该患者的所有预约记录
        appointments = Appointment.query.filter_by(patient_id=patient_id).all()

        # 构建返回结果
        result = []
        for appointment in appointments:
            doctor = User.query.get(appointment.doctor_id)
            result.append({
                'doctorName': doctor.username,
                'specialty': doctor.job,  # 修改此行以适应你的模型
                'date': appointment.appointment_time.strftime('%Y-%m-%d'),
                'time': appointment.appointment_time.strftime('%H:%M')
            })

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    app.logger.info('Current user ID: %s', current_user.id)
    return jsonify({'id': current_user.id})

@app.route('/doctor/appointments', methods=['GET'])
@login_required
def get_appointments():
    if current_user.role != 'doctor':
        return 'Access denied', 403
    appointments = Appointment.query.filter_by(doctor_id=current_user.id).all()
    response = []
    for appointment in appointments:
        patient = User.query.get(appointment.patient_id)
        response.append({
            'patient_name': patient.username,
            'appointment_time': appointment.appointment_time.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
