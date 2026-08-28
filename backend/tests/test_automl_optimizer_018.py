"""Pytest suite for OmniML Gradient Descent Optimizer Module 018."""
from backend.app.main import app, train_regression_model, TrainingRequest

def test_gradient_descent_convergence_018():
    req = TrainingRequest(optimizer="Batch Gradient Descent", learning_rate=0.01, epochs=50)
    res = train_regression_model(req)
    assert res["status"] == "CONVERGED"
    assert res["final_r2_score"] >= 0.70

def test_health_check_018():
    assert app.title == "OmniML Studio Engine"
