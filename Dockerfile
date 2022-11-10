FROM python:3.10

ENV PYTHONUNBUFFERED 1

ENV APP_ROOT app

WORKDIR .

RUN apt-get update

RUN pip3 install -U pip

COPY requirements.txt ${APP_ROOT}/requirements.txt

RUN pip3 install -r ${APP_ROOT}/requirements.txt

ADD . ${APP_ROOT}

COPY . .