from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form, status

# class MailBody(BaseModel):
#     to: List[str]
#     subject: str
#     body: str

class CredentialsSchema(BaseModel):
    host: str
    username: str
    password: str
    port: int

class DisplayCredentials(CredentialsSchema):
    id: int
    

class MailBody(BaseModel):
    to: str
    subject: str
    body: str

    # This class method lets us use the model with form data.
    @classmethod
    def as_form(
        cls,
        to: str = Form(...),
        subject: str = Form(...),
        body: str = Form(...),
    ):
        return cls(to=to, subject=subject, body=body)