from .config import get_credentials_from_db
from ssl import create_default_context
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from smtplib import SMTP_SSL
from .schemas import MailBody


def send_mail(data: dict |None = None, file_path: str | None = None):
    HOST, PASSWORD, USERNAME, PORT = get_credentials_from_db()
    
    msg = MailBody(**data)

    message = MIMEMultipart()
    message["From"]  = USERNAME
    message["To"] = msg.to
    message["Subject"] = msg.subject
    
    body_html = msg.body.replace("\n", "<br>")
    message.attach(MIMEText(body_html, "html"))
    
    if file_path:
        try:
            with open(file_path, "rb") as file:
                part = MIMEApplication(file.read(), Name=file_path.split("/")[-1])
                part["Content-Disposition"] = f'attachment; filename="{file_path.split("/")[-1]}"'
                message.attach(part)
        except Exception as e:
            print("Error attaching file:", e)
            return {"status": 500, "errors": f"Failed to attach file: {str(e)}"}
    
    ctx = create_default_context()
    
    try:
        print("Attempting to send email with attachment...")
        
        with SMTP_SSL(HOST, 465, context=ctx) as server:
            server.login(USERNAME, PASSWORD)
            server.send_message(message)
            server.quit()
        
        return {"status": 200, "errors": None}
    except Exception as e:
        return {"status": 500, "errors": e}, 
    