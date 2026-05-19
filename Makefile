.PHONY: dev ml

dev:
	docker compose up -d
ml:
	docker compose --profile ml up -d
