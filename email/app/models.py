from sqlalchemy import String, Integer, Column
from .database import Base


class Credentials(Base):
    __tablename__ = "credentials"
    
    id = Column(Integer, primary_key=True, index=True)
    port = Column(Integer)
    custom_id = Column(Integer, default=1)
    host = Column(String)
    username = Column(String)
    password = Column(String)
