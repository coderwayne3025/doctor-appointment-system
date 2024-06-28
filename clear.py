from app import db, app
from app import Appointment, User  # 导入你的模型

with app.app_context():
    # 删除所有表
    db.drop_all()
    # 重新创建所有表
    db.create_all()
    print("数据库已清空并重新创建所有表。")
