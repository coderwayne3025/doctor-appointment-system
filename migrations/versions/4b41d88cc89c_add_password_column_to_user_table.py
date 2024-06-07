"""Add password column to user table

Revision ID: 4b41d88cc89c
Revises: 9a6483e08365
Create Date: 2024-06-07 11:09:52.556896

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4b41d88cc89c'
down_revision = '9a6483e08365'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    
    with op.batch_alter_table('user', schema=None) as batch_op:
        # 添加一个默认值 'default_password' 给新列
        batch_op.add_column(sa.Column('password', sa.String(length=200), nullable=False, server_default='default_password'))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('password')

    op.create_table('appointment',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('doctor_id', sa.INTEGER(), nullable=False),
    sa.Column('patient_id', sa.INTEGER(), nullable=False),
    sa.Column('appointment_time', sa.DATETIME(), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['patient_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('doctoravailability',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('doctor_id', sa.INTEGER(), nullable=False),
    sa.Column('available_time', sa.DATETIME(), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
