import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Camera, ImagePlus, Loader2, RefreshCw, Video, VideoOff,
  Pencil, Eraser, Trash2, Sparkles, RotateCcw
} from "lucide-react";

// ─── Tab constants ────────────────────────────────────────────────────────────
const TAB_CAMERA  = "camera";
const TAB_DRAW    = "draw";

function ObjectDetection() {
  const [activeTab, setActiveTab]       = useState(TAB_CAMERA);
  const [targetLanguage, setTargetLanguage] = useState(
    () => localStorage.getItem("targetLanguage") || "Spanish"
  );
  const navigate = useNavigate();

  // Sync language from Navbar
  useEffect(() => {
    const onStorage = () => setTargetLanguage(localStorage.getItem("targetLanguage") || "Spanish");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Auth guard
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      toast.warning("Please login to access this feature.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--c-text1)", marginBottom: "0.5rem" }}>
          Visual <span style={{ background: "linear-gradient(90deg, #0DFFB0, #7C5CFC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learning Lab</span>
        </h1>
        <p style={{ color: "var(--c-text2)", fontSize: "1rem" }}>
          Scan objects around you — or draw & let AI guess — to learn words in <strong style={{ color: "var(--c-acc)" }}>{targetLanguage}</strong>
        </p>

        {/* Tabs */}
        <div style={{ display: "inline-flex", gap: 8, marginTop: "1.5rem", background: "var(--c-surface2)", borderRadius: 12, padding: 4, border: "1px solid var(--c-border)" }}>
          <TabBtn active={activeTab === TAB_CAMERA} onClick={() => setActiveTab(TAB_CAMERA)} icon={<Camera size={15} />} label="Scan Objects" />
          <TabBtn active={activeTab === TAB_DRAW}   onClick={() => setActiveTab(TAB_DRAW)}   icon={<Pencil  size={15} />} label="✏️ Draw & Learn" />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {activeTab === TAB_CAMERA
          ? <CameraTab targetLanguage={targetLanguage} />
          : <DrawTab   targetLanguage={targetLanguage} />
        }
      </div>
    </div>
  );
}

// ─── Small reusable TabBtn ────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
        fontSize: "0.84rem", fontWeight: 600, transition: "all 0.2s",
        background: active ? "var(--c-acc)" : "transparent",
        color:      active ? "#060810"        : "var(--c-text2)",
        boxShadow:  active ? "0 2px 12px rgba(13,255,176,0.25)" : "none",
      }}
    >
      {icon} {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA TAB — upload image or use live camera to detect objects
// ═══════════════════════════════════════════════════════════════════════════════
function CameraTab({ targetLanguage }) {
  const [mode, setMode]               = useState("upload"); // "upload" | "live"
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState("image/jpeg");
  const [results, setResults]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      setResults(null);
      setImageBase64(null);
    } catch (err) {
      toast.error("Camera access denied. Please allow camera in browser settings.");
      setMode("upload");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Capture frame from live camera
  const captureFrame = () => {
    const video  = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setImageBase64(dataUrl);
    stopCamera();
    setMode("upload"); // show preview
  };

  // Upload from file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setImageMimeType(file.type);
      setResults(null);
    };
    reader.readAsDataURL(file);
  };

  // Detect via backend
  const handleDetect = async () => {
    if (!imageBase64) return;
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/object-detection/detect`,
        { imageBase64: imageBase64.split(",")[1], imageMimeType, targetLanguage },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (res.data.success) {
        setResults(res.data.data.detectedObjects);
        if (res.data.usedFallback) {
          toast.info("Showing sample results. Add a valid Gemini API key for real detection!", { autoClose: 5000 });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageBase64(null);
    setResults(null);
    stopCamera();
  };

  return (
    <div style={{ background: "var(--c-surface1)", border: "1px solid var(--c-border)", borderRadius: 20, overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--c-text1)", background: "var(--c-surface3)", padding: "4px 12px", borderRadius: 8, border: "1px solid var(--c-border)" }}>
          Target: <span style={{ color: "var(--c-acc)" }}>{targetLanguage}</span>
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Mode toggle */}
          <button
            onClick={() => { if (mode === "upload") { setMode("live"); startCamera(); } else { stopCamera(); setMode("upload"); } }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--c-border)", background: mode === "live" ? "rgba(13,255,176,0.1)" : "var(--c-surface2)", color: mode === "live" ? "var(--c-acc)" : "var(--c-text2)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
          >
            {mode === "live" ? <><VideoOff size={13} /> Stop Camera</> : <><Video size={13} /> Live Camera</>}
          </button>
          {imageBase64 && (
            <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-surface2)", color: "var(--c-text2)", fontSize: "0.78rem", cursor: "pointer" }}>
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        {/* Live Camera View */}
        {mode === "live" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", border: "2px solid var(--c-acc)", position: "relative" }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(13,255,176,0.15)", border: "1px solid var(--c-acc)", borderRadius: 8, padding: "3px 10px", fontSize: "0.72rem", color: "var(--c-acc)", fontWeight: 700 }}>
                🔴 LIVE
              </div>
            </div>
            <button onClick={captureFrame} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 12, background: "var(--c-acc)", color: "#060810", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", boxShadow: "0 0 20px rgba(13,255,176,0.3)" }}>
              <Camera size={18} /> Capture & Analyze
            </button>
          </div>
        )}

        {/* Upload / Preview View */}
        {mode === "upload" && (
          !imageBase64 ? (
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", border: "2px dashed var(--c-border)", borderRadius: 16, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(13,255,176,0.5)"; e.currentTarget.style.background = "var(--c-surface2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--c-border)"; e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ padding: 16, borderRadius: 14, background: "var(--c-surface3)", marginBottom: 12 }}>
                <ImagePlus size={32} style={{ color: "var(--c-text3)" }} />
              </div>
              <span style={{ fontWeight: 700, color: "var(--c-text1)", marginBottom: 4 }}>Click to upload an image</span>
              <span style={{ fontSize: "0.78rem", color: "var(--c-text3)" }}>JPG, PNG, WebP — or use Live Camera above</span>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
              <img src={imageBase64} alt="Preview" style={{ width: "100%", maxHeight: 380, objectFit: "contain", borderRadius: 14, border: "1px solid var(--c-border)" }} />

              {!results ? (
                <button onClick={handleDetect} disabled={loading}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 36px", borderRadius: 12, background: "var(--c-acc)", color: "#060810", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 0 20px rgba(13,255,176,0.25)" }}
                >
                  {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Analyzing...</> : <><Camera size={18} /> Detect Objects</>}
                </button>
              ) : (
                <ResultGrid results={results} targetLanguage={targetLanguage} />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ResultGrid({ results, targetLanguage }) {
  return (
    <div style={{ width: "100%" }}>
      <h3 style={{ color: "var(--c-text1)", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
        Detected Objects <span style={{ fontSize: "0.75rem", padding: "2px 10px", background: "rgba(13,255,176,0.1)", color: "var(--c-acc)", borderRadius: 999 }}>{results.length} found</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {results.map((obj, i) => (
          <div key={i} style={{ background: "var(--c-surface2)", border: "1px solid var(--c-border)", borderRadius: 14, padding: "1rem", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(13,255,176,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--c-border)"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--c-text3)", textTransform: "uppercase", letterSpacing: "1px" }}>English</span>
              <span style={{ fontSize: "0.68rem", color: "var(--c-acc)" }}>{Math.round((obj.confidence || 0.85) * 100)}%</span>
            </div>
            <p style={{ color: "var(--c-text2)", fontWeight: 500, marginBottom: "0.75rem" }}>{obj.objectName}</p>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--c-text3)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 4 }}>{targetLanguage}</span>
            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--c-acc2)", fontStyle: "italic" }}>{obj.translation}</p>
            {obj.pronunciation && <p style={{ fontSize: "0.72rem", color: "var(--c-text3)", marginTop: 4 }}>"{obj.pronunciation}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DRAW TAB — kids draw something, AI guesses + teaches the word
// ═══════════════════════════════════════════════════════════════════════════════
function DrawTab({ targetLanguage }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing]     = useState(false);
  const [tool, setTool]           = useState("pen");   // "pen" | "eraser"
  const [color, setColor]         = useState("#0DFFB0");
  const [brushSize, setBrushSize] = useState(6);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [hasDrawn, setHasDrawn]   = useState(false);
  const lastPos = useRef(null);

  // Setup canvas with dark background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width  / rect.width),
      y: (clientY - rect.top)  * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
    setDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const pos    = getPos(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#0d1117" : color;
    ctx.lineWidth   = tool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.globalAlpha = 1;
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setResult(null);
    setHasDrawn(false);
  };

  const analyzeDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      toast.info("Draw something first! 🎨");
      return;
    }
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const imageBase64 = canvas.toDataURL("image/png").split(",")[1];

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/object-detection/analyze-drawing`,
        { imageBase64, imageMimeType: "image/png", targetLanguage },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not analyze drawing.");
    } finally {
      setLoading(false);
    }
  };

  const colors = ["#0DFFB0", "#7C5CFC", "#FF6B6B", "#FFD93D", "#4ECDC4", "#FF9F43", "#ffffff", "#aaaaaa"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Toolbar */}
      <div style={{ background: "var(--c-surface2)", borderRadius: 14, padding: "12px 16px", border: "1px solid var(--c-border)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        {/* Pen / Eraser */}
        <div style={{ display: "flex", gap: 6 }}>
          <ToolBtn active={tool === "pen"}    onClick={() => setTool("pen")}    icon={<Pencil size={14}/>} label="Pen" />
          <ToolBtn active={tool === "eraser"} onClick={() => setTool("eraser")} icon={<Eraser size={14}/>} label="Eraser" />
        </div>

        {/* Colors */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {colors.map(c => (
            <button key={c} onClick={() => { setColor(c); setTool("pen"); }}
              style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: color === c && tool === "pen" ? "3px solid white" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s" }}
            />
          ))}
        </div>

        {/* Brush size */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.7rem", color: "var(--c-text3)" }}>Size</span>
          <input type="range" min={2} max={20} value={brushSize} onChange={e => setBrushSize(+e.target.value)}
            style={{ width: 70, accentColor: "var(--c-acc)" }}
          />
        </div>

        {/* Clear */}
        <button onClick={clearCanvas}
          style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto", padding: "5px 12px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-surface3)", color: "var(--c-text2)", fontSize: "0.78rem", cursor: "pointer" }}
        >
          <Trash2 size={13} /> Clear
        </button>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "2px solid var(--c-border)" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: 340, cursor: tool === "eraser" ? "cell" : "crosshair", touchAction: "none" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎨</span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "1rem", fontWeight: 600 }}>Draw anything here!</span>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.8rem", marginTop: 4 }}>A dog, a house, a car, a sun…</span>
          </div>
        )}
      </div>

      {/* Analyze button */}
      <button onClick={analyzeDrawing} disabled={loading || !hasDrawn}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 14, background: hasDrawn ? "linear-gradient(135deg, #0DFFB0, #7C5CFC)" : "var(--c-surface3)", color: hasDrawn ? "#060810" : "var(--c-text3)", fontWeight: 800, fontSize: "1rem", border: "none", cursor: hasDrawn ? "pointer" : "not-allowed", transition: "all 0.3s", boxShadow: hasDrawn ? "0 0 24px rgba(13,255,176,0.3)" : "none" }}
      >
        {loading
          ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> AI is thinking...</>
          : <><Sparkles size={18} /> What did I draw? Guess it! ✨</>
        }
      </button>

      {/* Result card */}
      {result && <DrawingResult result={result} targetLanguage={targetLanguage} onTryAgain={clearCanvas} />}
    </div>
  );
}

function ToolBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: "1px solid", borderColor: active ? "var(--c-acc)" : "var(--c-border)", background: active ? "rgba(13,255,176,0.1)" : "var(--c-surface3)", color: active ? "var(--c-acc)" : "var(--c-text3)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
    >
      {icon} {label}
    </button>
  );
}

function DrawingResult({ result, targetLanguage, onTryAgain }) {
  return (
    <div style={{ background: "var(--c-surface2)", border: "1px solid var(--c-acc)", borderRadius: 20, padding: "1.5rem", boxShadow: "0 0 30px rgba(13,255,176,0.08)" }}>
      {/* Encouragement banner */}
      <div style={{ background: "linear-gradient(135deg, rgba(13,255,176,0.12), rgba(124,92,252,0.12))", borderRadius: 12, padding: "12px 16px", marginBottom: "1rem", textAlign: "center" }}>
        <span style={{ fontSize: "1.5rem" }}>🎉</span>
        <p style={{ color: "var(--c-acc)", fontWeight: 700, fontSize: "1.05rem", margin: "4px 0 0" }}>
          {result.encouragement || "Amazing drawing!"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1rem" }}>
        {/* Guessed object */}
        <div style={{ background: "var(--c-surface3)", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--c-text3)", letterSpacing: "1px", display: "block", marginBottom: 4 }}>I THINK YOU DREW</span>
          <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--c-text1)" }}>{result.guessedObject}</span>
        </div>

        {/* Word in target language */}
        <div style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--c-acc2)", letterSpacing: "1px", display: "block", marginBottom: 4 }}>IN {targetLanguage.toUpperCase()}</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--c-acc2)", fontStyle: "italic" }}>{result.targetWord}</span>
          {result.pronunciation && <p style={{ fontSize: "0.75rem", color: "var(--c-text3)", marginTop: 4 }}>"{result.pronunciation}"</p>}
        </div>
      </div>

      {result.exampleSentence && (
        <div style={{ background: "var(--c-surface3)", borderRadius: 10, padding: "10px 14px", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--c-text3)", display: "block", marginBottom: 4 }}>EXAMPLE SENTENCE</span>
          <p style={{ color: "var(--c-text2)", fontSize: "0.9rem", margin: 0, fontStyle: "italic" }}>{result.exampleSentence}</p>
        </div>
      )}

      {result.funFact && (
        <div style={{ background: "rgba(255,159,67,0.08)", border: "1px solid rgba(255,159,67,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#FF9F43", display: "block", marginBottom: 4 }}>⚡ FUN FACT</span>
          <p style={{ color: "var(--c-text2)", fontSize: "0.85rem", margin: 0 }}>{result.funFact}</p>
        </div>
      )}

      <button onClick={onTryAgain}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "10px", borderRadius: 10, border: "1px solid var(--c-border)", background: "var(--c-surface3)", color: "var(--c-text2)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
      >
        <RotateCcw size={14} /> Draw Something Else
      </button>
    </div>
  );
}

export default ObjectDetection;
