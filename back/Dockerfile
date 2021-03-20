FROM python:3.7-alpine
WORKDIR /back

ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV FLASK_ENV development

COPY . .
RUN apk add --no-cache gcc musl-dev linux-headers openssl-dev libffi-dev
RUN pip install --upgrade setuptools
RUN pip install --upgrade gcloud
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["python", "-m", "flask", "run"]