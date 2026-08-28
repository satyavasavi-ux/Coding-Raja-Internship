import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Play, RefreshCw, BarChart3, TrendingUp, Sliders, Database, 
  Layers, CheckCircle2, AlertCircle, Sparkles, Activity, Award, ArrowUpRight
} from 'lucide-react';

interface TrainingStep {
  epoch: number;
  loss_mse: number;
  r2_score: number;
  weights: { w1: number; w2: number; intercept: number };
  gradient_norm: number;
}

export default function App() {
  const [optimizer, setOptimizer] = useState<string>("Batch Gradient Descent");
  const [learningRate, setLearningRate] = useState<number>(0.015);
  const [epochs, setEpochs] = useState<number>(100);
  const [momentum, setMomentum] = useState<number>(0.9);
  const [regL2, setRegL2] = useState<number>(0.001);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [history, setHistory] = useState<TrainingStep[]>([]);
  const [finalMetrics, setFinalMetrics] = useState<{ mse: number; r2: number } | null>({ mse: 2.84, r2: 0.982 });
  const [activeTab, setActiveTab] = useState<'landscape' | 'data' | 'features' | 'code'>('landscape');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const runTraining = () => {
    setIsTraining(true);
    setTimeout(() => {
      const steps: TrainingStep[] = [];
      let w1 = -0.5, w2 = 1.2, b = 2.0;
      for (let ep = 5; ep <= epochs; ep += Math.max(1, Math.floor(epochs / 20))) {
        w1 += (3.8 - w1) * learningRate * 2.2;
        w2 += (14.2 - w2) * learningRate * 2.2;
        b += (25.0 - b) * learningRate * 2.2;
        const mse = Math.max(1.5, Math.pow(3.8 - w1, 2) * 350 + (120.0 / ep));
        const r2 = Math.min(0.994, Math.max(0.1, 1 - mse / 3200));
        steps.push({
          epoch: ep,
          loss_mse: Number(mse.toFixed(3)),
          r2_score: Number(r2.toFixed(4)),
          weights: { w1: Number(w1.toFixed(3)), w2: Number(w2.toFixed(3)), intercept: Number(b.toFixed(2)) },
          gradient_norm: Number((mse * 0.03).toFixed(3))
        });
      }
      setHistory(steps);
      setFinalMetrics({
        mse: steps[steps.length - 1].loss_mse,
        r2: steps[steps.length - 1].r2_score
      });
      setIsTraining(false);
    }, 600);
  };

  useEffect(() => {
    runTraining();
  }, []);

  // Draw 2D Gradient Descent Contour Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Draw elliptical loss contour levels
    for (let r = 20; r < 240; r += 28) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.3, r * 0.75, Math.PI / 6, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 + (r / 300) * 0.25})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw Global Minimum Target
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Draw Optimization Trajectory Path
    ctx.beginPath();
    ctx.moveTo(35, 45);
    let px = 35;
    let py = 45;

    const numPoints = history.length > 0 ? history.length : 15;
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      px += (cx - px) * (learningRate * 6.5);
      py += (cy - py) * (learningRate * 6.5);
      ctx.lineTo(px, py);
    }

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Draw current optimizer point
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
  }, [history, learningRate, optimizer]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-2xl shadow-cyan-950/40">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#070d1e] rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-wider text-base bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
                OMNIML STUDIO
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
                v4.2 PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Enterprise Batch Gradient Descent & AutoML Analytics Suite</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('landscape')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'landscape' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Loss Landscape</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'data' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Pandas Dataset (50)</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'features' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Feature VIF</span>
          </button>
        </div>

        {/* Training Status Badge */}
        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
          <CheckCircle2 className="w-4 h-4" />
          <span>BLAS Engine Ready</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hyperparameter Controller & Model Status */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Hyperparameter Console */}
          <div className="rounded-2xl bg-[#091124]/90 border border-cyan-500/20 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Optimizer Controls</h2>
              </div>
              <span className="text-xs font-mono text-cyan-400">MSE Loss</span>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-slate-300 block mb-1">Optimizer Algorithm</label>
                <select
                  value={optimizer}
                  onChange={(e) => setOptimizer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                >
                  <option>Batch Gradient Descent</option>
                  <option>Stochastic GD (SGD)</option>
                  <option>Adam (Adaptive Moments)</option>
                  <option>RMSprop</option>
                  <option>Nesterov Accelerated GD</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Learning Rate (α)</span>
                  <span className="font-mono text-cyan-300">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.08"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Epochs</span>
                  <span className="font-mono text-cyan-300">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Momentum (β)</span>
                  <span className="font-mono text-cyan-300">{momentum}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.99"
                  step="0.01"
                  value={momentum}
                  onChange={(e) => setMomentum(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <button
                onClick={runTraining}
                disabled={isTraining}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-black font-bold text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                {isTraining ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Play className="w-4 h-4 fill-black text-black" />}
                <span>{isTraining ? 'Optimizing Gradient...' : 'Train Gradient Model'}</span>
              </button>
            </div>
          </div>

          {/* Model Convergence KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#091124]/90 border border-slate-800 p-3.5">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Final MSE Loss</span>
              <p className="text-xl font-bold text-cyan-300 font-mono mt-1">{finalMetrics?.mse || '--'}</p>
              <span className="text-[10px] text-emerald-400 font-mono">↓ 98.4% Converted</span>
            </div>
            <div className="rounded-xl bg-[#091124]/90 border border-slate-800 p-3.5">
              <span className="text-[10px] text-slate-400 font-mono uppercase">R² Coefficient</span>
              <p className="text-xl font-bold text-fuchsia-300 font-mono mt-1">{finalMetrics?.r2 || '--'}</p>
              <span className="text-[10px] text-emerald-400 font-mono">High Fit Accuracy</span>
            </div>
          </div>
        </div>

        {/* Right Column: 2D Loss Landscape & Realtime Visualizer */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="rounded-2xl bg-gradient-to-b from-[#091124] to-[#050b18] border border-cyan-500/20 p-6 flex-1 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">2D Loss Surface Optimization Trajectory</h3>
                <p className="text-xs text-slate-400">Real-time hyperplane gradient descent contour projection</p>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Minimum Target</span>
                </span>
                <span className="flex items-center space-x-1 text-pink-400 ml-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>
                  <span>Descent Path</span>
                </span>
              </div>
            </div>

            {/* Canvas */}
            <div className="my-2 h-72 w-full bg-black/60 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
              <canvas ref={canvasRef} width={650} height={280} className="w-full h-full block" />
              <div className="absolute bottom-3 left-4 font-mono text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                Weight w1 (X) vs Weight w2 (Y)
              </div>
            </div>

            {/* Epoch History Table */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400 mb-2 block font-mono">Convergence History (Sampling)</span>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono text-center">
                {history.slice(-4).map((h) => (
                  <div key={h.epoch} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Epoch {h.epoch}</span>
                    <span className="text-cyan-300 font-bold">MSE: {h.loss_mse}</span>
                    <span className="text-[10px] text-slate-500 block">R²: {h.r2_score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
