import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, ImagePlus, Loader2, RefreshCw, Video, VideoOff,
  Pencil, Eraser, Trash2, Sparkles, RotateCcw, Zap, ChevronRight, Activity, Cpu, Scan, Box
} from "lucide-react";

const TAB_CAMERA = "camera";
const TAB_DRAW = "draw";

function ObjectDetection() {
  const [activeTab, setActiveTab] = useState(TAB_CAMERA);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "Spanish");

  // --- CAMERA LOGIC ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // --- DRAWING LOGIC ---
  const drawCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [brushSize, setBrushSize] = useState(6);
  const [brushColor, setBrushColor] = useState("#1E1A1D");

  useEffect(() => {
    if (activeTab === TAB_DRAW && drawCanvasRef.current) {
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 800;
      canvas.height = 450;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [activeTab]);

  const getCoordinates = (e) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : brushColor;
    
    setIsDrawing(true);
    if (e.cancelable) e.preventDefault();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
    if (e.cancelable) e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const analyzeDrawing = async () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    setLoading(true);
    const base64 = canvas.toDataURL("image/png").split(",")[1];

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/object-detection/analyze-drawing`, {
        imageBase64: base64,
        targetLanguage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      toast.error("Sketch analysis failed. Verify identity.");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      toast.error("Optic access denied.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (activeTab === TAB_CAMERA) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [activeTab]);

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/object-detection/detect`, {
        imageBase64: base64,
        targetLanguage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setResults(res.data.data);
    } catch (err) {
      toast.error("Analysis interrupted. Verify identity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32">
      <div className="container-premium">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 border-b-4 border-ink pb-12">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="pill-badge text-sakura border-sakura">Linguistic Optics</span>
                    <span className="text-ink/20 font-black">/</span>
                    <span className="text-[10px] font-black text-ink uppercase tracking-widest">v2.5 Scanning Simulation</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-4 uppercase">Visual <span className="text-sakura italic">Lens.</span></h1>
                <p className="text-xl text-ink/40 font-bold max-w-xl">Environment-to-Language transition via high-density neural analysis.</p>
            </div>
            
            <div className="flex bg-ink p-1.5 rounded-2xl shadow-2xl shadow-ink/20">
                <button 
                    onClick={() => { setActiveTab(TAB_CAMERA); setResults(null); }}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === TAB_CAMERA ? 'bg-white text-ink shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                    Optical Sensor
                </button>
                <button 
                    onClick={() => { setActiveTab(TAB_DRAW); setResults(null); }}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === TAB_DRAW ? 'bg-white text-ink shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                    Sketch Lab
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* INTERFACE AREA */}
            <div className="lg:col-span-7">
                <div className="relative rounded-[3rem] overflow-hidden bg-ink p-4 shadow-[0_40px_100px_-20px_rgba(38,29,34,0.3)]">
                    {activeTab === TAB_CAMERA ? (
                        <div className="relative aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
                            <canvas ref={canvasRef} className="hidden" />
                            
                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 border-[40px] border-transparent group-hover:border-sakura/5 transition-all pointer-events-none"></div>
                            <motion.div 
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-1 bg-sakura/30 blur-sm z-10"
                            ></motion.div>

                            {!stream && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                                    <VideoOff size={64} strokeWidth={1} className="mb-6" />
                                    <button onClick={startCamera} className="btn-premium !bg-sakura">Initialize Optics</button>
                                </div>
                            )}

                            {stream && (
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8">
                                    <button 
                                        onClick={captureAndDetect}
                                        disabled={loading}
                                        className="w-20 h-20 rounded-full bg-white border-8 border-sakura/20 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all duration-500"
                                    >
                                        {loading ? <Loader2 className="animate-spin text-sakura" size={32} /> : <div className="w-12 h-12 rounded-full bg-sakura" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-6">
                            <div className="relative aspect-video bg-white rounded-2xl overflow-hidden border-4 border-ink">
                                <canvas 
                                    ref={drawCanvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="w-full h-full cursor-crosshair touch-none"
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 p-4 bg-ink/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setTool("pencil")}
                                        className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${tool === "pencil" ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/5"}`}
                                    >
                                        <Pencil size={14} /> Pencil
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setTool("eraser")}
                                        className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${tool === "eraser" ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/5"}`}
                                    >
                                        <Eraser size={14} /> Eraser
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={clearCanvas}
                                        className="p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
                                    >
                                        <Trash2 size={14} /> Clear
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-ink/40 uppercase tracking-widest">Size</span>
                                        <input 
                                            type="range" 
                                            min="2" 
                                            max="20" 
                                            value={brushSize} 
                                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                            className="w-20 accent-ink cursor-pointer"
                                        />
                                        <span className="text-xs font-black text-ink w-8">{brushSize}px</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {["#1E1A1D", "#E05A47", "#3B82F6", "#10B981"].map((c) => (
                                            <button 
                                                key={c}
                                                type="button"
                                                onClick={() => { setBrushColor(c); setTool("pencil"); }}
                                                className={`w-6 h-6 rounded-full border-2 transition-all ${brushColor === c && tool === "pencil" ? "border-sakura scale-110" : "border-transparent"}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={analyzeDrawing}
                                    disabled={loading}
                                    className="btn-premium !bg-sakura !py-3 !px-6 text-xs flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                    Analyze
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mt-12 flex items-center gap-6 opacity-20">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Scan size={14}/> Auto-Detection</div>
                    <div className="w-1 h-1 rounded-full bg-ink"></div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Cpu size={14}/> Neural Link</div>
                    <div className="w-1 h-1 rounded-full bg-ink"></div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Box size={14}/> Reality Mapping</div>
                </div>
            </div>

            {/* RESULTS AREA */}
            <div className="lg:col-span-5 space-y-8">
                <AnimatePresence mode="wait">
                    {!results ? (
                        <motion.div 
                            key="waiting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-card !border-dashed !border-ink/20 flex flex-col items-center justify-center py-32 text-ink/20"
                        >
                            <Activity size={48} strokeWidth={1} className="mb-6 opacity-40 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Waiting for Sensor Input</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black text-sakura uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Zap size={14} strokeWidth={3} fill="currentColor" /> Intelligence Found
                                </h3>
                                <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">{(results.detectedObjects || []).length} Entities</span>
                            </div>

                            {results.encouragement && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-sakura/10 text-sakura border-2 border-sakura/20 rounded-2xl font-black text-xs uppercase tracking-widest text-center"
                                >
                                    ✨ {results.encouragement}
                                </motion.div>
                            )}

                            {(results.detectedObjects || []).map((obj, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card !p-10 !rounded-[2.5rem] relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-10 border-b border-ink/5 pb-6">
                                        <div>
                                            <span className="text-[10px] font-black text-sakura uppercase tracking-widest mb-2 block">Source Object</span>
                                            <h4 className="text-4xl font-black text-ink uppercase tracking-tighter">{obj.objectName}</h4>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-ink text-white flex items-center justify-center shadow-2xl shadow-ink/10">
                                            <Sparkles size={24} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        <div className="p-8 bg-ink text-white rounded-[1.5rem]">
                                            <span className="text-[10px] font-black text-sakura uppercase tracking-widest mb-4 block">Neural Translation</span>
                                            <p className="text-xl font-black tracking-tight">{obj.translations}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest mb-2 block">Linguistic Context</span>
                                            <p className="text-lg text-ink font-bold leading-tight italic">"{obj.example || obj.exampleSentence}"</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )
                    }
                </AnimatePresence>
            </div>
        </div>

      </div>
    </div>
  );
}

export default ObjectDetection;
