from typing import Optional
from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, status, UploadFile, File

from .config import get_credentials_from_db
from .schemas import CredentialsSchema, DisplayCredentials, MailBody
from .mailer import send_mail
from .database import engine, db_dependency, Base
from .models import Credentials
from fastapi.responses import JSONResponse

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.post("/credentials/", status_code=status.HTTP_201_CREATED)
async def create_credentials(credentials: CredentialsSchema, db: db_dependency):
    existing_credentials = db.query(Credentials).filter(Credentials.custom_id == 1).first()
    if existing_credentials:
        db.delete(existing_credentials)
        db.commit()
    print(credentials)
    email_credentials = Credentials(**credentials.dict())
    db.add(email_credentials)
    db.commit()
    db.refresh(email_credentials)
    return email_credentials


@app.get("/credentials/", status_code=status.HTTP_200_OK, response_model=DisplayCredentials)
async def get_credentials():
    host, username, password, port = get_credentials_from_db()
    if host is None:
        raise HTTPException(status_code=404, detail="Credentials not found")
    return {"host": host, "username": username, "password": password, "port": port}



# @app.post("/send-email/", status_code=status.HTTP_200_OK)
# def schedule_mail(req: MailBody, tasks:BackgroundTasks):
#     data = req.dict()
#     tasks.add_task(send_mail, data, "/home/peetah/Kong/email/media/receipt.pdf")
#     return {"message": "email has been scheduled"}


@app.post("/send-email/", status_code=status.HTTP_200_OK)
async def schedule_mail( tasks: BackgroundTasks, mail: MailBody = Depends(MailBody.as_form),  file: Optional[UploadFile] = File(None)):
    data = mail.dict()
    file_location = None

    if file is not None:
        # Read file content to determine if it's empty.
        file_contents = await file.read()
        if file_contents:
            file_location = f"/tmp/{file.filename}"
            with open(file_location, "wb") as buffer:
                buffer.write(file_contents)
        # Optionally, if the file is empty, you can log a warning or set file_location to None.
        else:
            print("Empty file received; sending email without attachment.")

    # Schedule the email sending in the background.
    tasks.add_task(send_mail, data, file_location)
    return JSONResponse({"message": "Email has been scheduled"})