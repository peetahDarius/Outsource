"""added phone

Revision ID: ec2cd7cc29a9
Revises: 4cc47a165b6d
Create Date: 2025-02-17 07:11:11.147967

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ec2cd7cc29a9'
down_revision = '4cc47a165b6d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('credentials', schema=None) as batch_op:
        batch_op.add_column(sa.Column('phone', sa.String(length=250), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('credentials', schema=None) as batch_op:
        batch_op.drop_column('phone')

    # ### end Alembic commands ###
