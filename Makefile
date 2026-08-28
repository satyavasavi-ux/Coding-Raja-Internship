all: install build test

install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

build:
	cd frontend && npm run build

test:
	pytest backend/tests
	cd frontend && npm test

run-backend:
	uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

run-frontend:
	cd frontend && npm run dev -- --port 3000
