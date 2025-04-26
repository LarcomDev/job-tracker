.PHONY: start-backend start-frontend start mongo down

start-backend:
	cd backend && go run main.go

start-frontend:
	cd frontend && npm start

start:
	make -j 2 start-backend start-frontend

mongo:
	docker-compose up -d mongodb

down:
	docker-compose down 