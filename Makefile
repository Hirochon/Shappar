folder := ""

runserver:
	docker-compose run --rm shappar-back python3 manage.py runserver 0.0.0.0:8000 --settings=config.settings.local

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

test:
	docker-compose run --rm shappar-back python3 manage.py test --settings=config.settings.local

test_views:
	docker-compose run --rm shappar-back python3 manage.py test apiv1.tests.test_views --settings=config.settings.local

test_serializers:
	docker-compose run --rm shappar-back python3 manage.py test apiv1.tests.test_serializers --settings=config.settings.local