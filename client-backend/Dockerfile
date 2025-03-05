FROM python:3.13.2-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apk add --no-cache mariadb-connector-c-dev gcc musl-dev python3-dev

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "run.py" ]