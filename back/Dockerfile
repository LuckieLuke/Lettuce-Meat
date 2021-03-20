FROM python:3.7
WORKDIR /back

ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV FLASK_ENV development

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "-m", "flask", "run"]