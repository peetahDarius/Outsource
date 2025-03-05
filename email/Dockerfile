FROM python:3.13.2-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apk add \
    postgresql-dev \
    gcc \
    musl-dev

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "app.py" ]