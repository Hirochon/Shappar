FROM python:3.8.1

ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY requirements.txt /code/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
COPY ./ /code/

EXPOSE 8000