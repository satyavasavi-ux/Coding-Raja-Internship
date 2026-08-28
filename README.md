# OmniML Studio - Enterprise Batch Gradient Descent & AutoML Workbench

OmniML Studio is an end-to-end machine learning optimization, batch gradient descent workbench, loss contour simulator, and automated feature engineering pipeline platform.

## Architecture
- **Optimization Core**: Batch Gradient Descent (BGD), Stochastic GD (SGD), AdamW, RMSProp, and Nesterov Momentum.
- **Loss Surface Visualizer**: Real-time 2D/3D hyperplane loss contour trajectory simulation.
- **Pandas Pipeline**: Automated multi-collinearity VIF scoring, outlier filtering, and feature importance weighting.
- **FastAPI Engine**: High-throughput vectorized parameter updates with sub-millisecond execution.

## Installation Instructions
```bash
# Clone the repository
git clone git@github.com:gandhikomarala/Coding-Raja-Internship.git
cd Coding-Raja-Internship

# Backend dependencies
pip install -r backend/requirements.txt

# Frontend dependencies
cd frontend
npm install
```

## Build Instructions
```bash
# Build the production frontend distribution
cd frontend
npm run build

# Build with Docker Compose
cd ..
docker-compose build
```

## Run Instructions
```bash
# Start FastAPI backend server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

# Start Frontend Dev Server
cd frontend
npm run dev -- --port 3000

# Run all with Docker Compose
docker-compose up -d
```

## Test Instructions
```bash
# Run backend Pytest suite
pytest backend/tests

# Run frontend Vitest suite
cd frontend && npm test
```
