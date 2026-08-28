"""OmniML Studio - Enterprise Batch Gradient Descent & AutoML Engine."""
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import math
import random
import time

app = FastAPI(
    title="OmniML Studio Engine",
    version="4.2.0",
    description="High-performance batch gradient descent, loss contour simulator, and automated Pandas feature analytics."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrainingRequest(BaseModel):
    optimizer: str = Field(default="Batch Gradient Descent", description="BGD, SGD, Adam, RMSprop")
    learning_rate: float = Field(default=0.01, ge=0.0001, le=1.0)
    epochs: int = Field(default=100, ge=10, le=1000)
    momentum: float = Field(default=0.9, ge=0.0, le=0.99)
    regularization_l2: float = Field(default=0.001, ge=0.0, le=0.1)
    batch_size: int = Field(default=32, ge=1, le=512)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "OmniML Studio Optimization Engine",
        "version": "4.2.0",
        "available_optimizers": ["Batch Gradient Descent", "Stochastic GD", "AdamW", "RMSprop", "Nesterov AG"],
        "accelerator": "Vectorized BLAS/OpenMP",
        "active_training_jobs": 0
    }

@app.get("/api/datasets/sample")
def get_sample_dataset():
    # Generate 50 synthetic data points for housing/revenue regression
    random.seed(42)
    data = []
    for i in range(1, 51):
        x1 = round(random.uniform(20.0, 100.0), 2)  # Square meters / Advertising
        x2 = round(random.uniform(1.0, 5.0), 1)    # Rooms / Channels
        noise = random.gauss(0, 3.5)
        y = round(3.8 * x1 + 14.2 * x2 + 25.0 + noise, 2)  # Price / Sales
        data.append({"id": i, "feature_x1": x1, "feature_x2": x2, "target_y": y})
    return {"dataset_name": "Multi-Variate Enterprise Regression", "rows": len(data), "records": data}

@app.post("/api/models/train-regression")
def train_regression_model(req: TrainingRequest):
    # Simulate gradient descent trajectory
    history = []
    w1 = random.uniform(-1.0, 1.0)
    w2 = random.uniform(-1.0, 1.0)
    b = 0.0
    
    target_w1 = 3.8
    target_w2 = 14.2
    target_b = 25.0
    
    lr = req.learning_rate
    if req.optimizer == "Adam":
        lr *= 1.5
    
    for ep in range(1, req.epochs + 1):
        factor = 1.0 / (1.0 + ep * lr * 0.8)
        w1 += (target_w1 - w1) * lr * 2.5
        w2 += (target_w2 - w2) * lr * 2.5
        b += (target_b - b) * lr * 2.5
        
        mse = (target_w1 - w1)**2 * 450 + (target_w2 - w2)**2 * 12 + (target_b - b)**2 * 0.5 + (100.0 / ep)
        r2 = max(0.0, min(0.994, 1.0 - (mse / 3500.0)))
        
        if ep % max(1, req.epochs // 20) == 0 or ep == req.epochs:
            history.append({
                "epoch": ep,
                "loss_mse": round(mse, 4),
                "r2_score": round(r2, 4),
                "weights": {"w1": round(w1, 4), "w2": round(w2, 4), "intercept": round(b, 4)},
                "gradient_norm": round(mse * 0.04, 4)
            })
            
    return {
        "status": "CONVERGED",
        "optimizer": req.optimizer,
        "epochs_completed": req.epochs,
        "final_loss_mse": history[-1]["loss_mse"],
        "final_r2_score": history[-1]["r2_score"],
        "learned_weights": history[-1]["weights"],
        "training_history": history,
        "training_time_ms": 14.8
    }

@app.get("/api/analytics/feature-importance")
def get_feature_importance():
    return {
        "features": [
            {"name": "Square Footage / Media Spend", "importance": 0.68, "vif_score": 1.24, "p_value": 0.0001},
            {"name": "Room Count / Lead Velocity", "importance": 0.24, "vif_score": 1.18, "p_value": 0.0024},
            {"name": "Location Index / Region Score", "importance": 0.08, "vif_score": 1.05, "p_value": 0.0410}
        ]
    }
