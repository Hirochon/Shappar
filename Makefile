folder := ""

migrations:
	docker-compose run --rm shappar-back python3 manage.py makemigrations --settings=config.settings.local

migrate:
	docker-compose run --rm shappar-back python3 manage.py migrate --settings=config.settings.local

createsuperuser:
	docker-compose run --rm shappar-back python3 manage.py createsuperuser --settings=config.settings.local

shell:
	docker-compose run --rm shappar-back python3 manage.py shell --settings=config.settings.local

startapp:
	docker-compose run --rm shappar-back python3 manage.py startapp $(folder) --settings=config.settings.local

collectstatic:
	docker-compose run --rm shappar-back python3 manage.py collectstatic --noinput --settings=config.settings.local