"""initial commit

Revision ID: c14a102b7b6b
Revises: 
Create Date: 2025-02-08 16:13:58.412264

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c14a102b7b6b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('client',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=200), nullable=True),
    sa.Column('last_name', sa.String(length=200), nullable=True),
    sa.Column('longitude', sa.String(length=254), nullable=True),
    sa.Column('latitude', sa.String(length=254), nullable=True),
    sa.Column('email', sa.String(length=254), nullable=True),
    sa.Column('phone', sa.String(length=50), nullable=True),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=100), nullable=True),
    sa.Column('created', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('client')
    # ### end Alembic commands ###
