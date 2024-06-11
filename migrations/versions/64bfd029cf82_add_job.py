"""add job

Revision ID: 64bfd029cf82
Revises: d966abbc177d
Create Date: 2024-06-08 20:44:03.747572

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '64bfd029cf82'
down_revision = 'd966abbc177d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('job', sa.String(length=20), nullable=False,server_default='default_job'))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('job')

    # ### end Alembic commands ###
