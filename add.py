from app import app,db, User,DoctorAvailability,Appointment
from werkzeug.security import generate_password_hash
from datetime import datetime
# 创建一个新用户
"""
with app.app_context():
    # 创建一个新用户
    new_user = User(
        username='zhang',
        password=generate_password_hash('12345', method='pbkdf2:sha256'),
        role='doctor'
    )
    
    # 添加到数据库会话并提交
    db.session.add(new_user)
    db.session.commit()
    
    print("User added successfully!")
"""
"""with app.app_context():
    # 创建一个新用户
    new_appointment= Appointment(
        doctor_id=6,
        patient_id=4,
        
        appointment_time = datetime.strptime('2024-06-07 14:30:00', '%Y-%m-%d %H:%M:%S')
    )
    
    # 添加到数据库会话并提交
    db.session.add(new_appointment)
    db.session.commit()
    
    print("appointment added successfully!")
    """
with app.app_context():
    # 创建一个新用户
    new_appointment= DoctorAvailability(
        doctor_id=6,
        available_time=datetime.strptime('2024-06-07 14:30:00', '%Y-%m-%d %H:%M:%S')
        
        
    )
    
    # 添加到数据库会话并提交
    db.session.add(new_appointment)
    db.session.commit()
    
    print("appointment added successfully!")