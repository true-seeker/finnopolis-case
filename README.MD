# Кейс для FinoDays команда DROP DATABASE users

## Порядок запуска

Запуск docker контейнеров

```
sudo docker-compose build
sudo docker-compose up
```

Контейнер `web`: непосредственно приложение
Контейнер `bank1` и `bank2`: имитация банков, поддерживающий спецификацию Открытых АПИ

## Спецификация Открытых апи

Для просмотра спецификации необходимо перейти по адресу `http://localhost:8080/open-banking/v1.3/aisp/ui/` или `http://localhost:5467/open-banking/v1.3/aisp/ui/`

### Используемые технологии

- Flask
- SQLAlchemy
- Bootstrap