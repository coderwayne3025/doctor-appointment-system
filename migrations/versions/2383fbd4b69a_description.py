"""description

Revision ID: 2383fbd4b69a
Revises: e34e33378792
Create Date: 2024-06-28 23:43:13.650892

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2383fbd4b69a'
down_revision = 'e34e33378792'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.String(length=600), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('description')

    # ### end Alembic commands ###
