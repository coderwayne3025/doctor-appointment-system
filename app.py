# backend/app.py
# app.py
from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime

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
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
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
    return jsonify({'message': 'Welcome doctor!'})

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
