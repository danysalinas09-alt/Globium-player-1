import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Download, Undo2, X } from 'lucide-react';

interface WhiteboardCanvasProps {
  onClose: () => void;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#fb7185'); // default rose/burgundy accent
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state to history
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isEraser ? '#ffffff' : color;

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), currentState]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current
    const prevState = newHistory[newHistory.length - 1];
    ctx.putImageData(prevState, 0, 0);
    setHistory(newHistory);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const clearedState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev, clearedState]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `whiteboard-notes-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = [
    { name: 'Rose', hex: '#fb7185' },
    { name: 'Burgundy', hex: '#831843' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Black', hex: '#0f172a' },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col">
      {/* Top toolbar */}
      <div className="h-14 bg-[#4a0414] text-white px-4 flex items-center justify-between border-b border-[#831843] shadow-md z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wide flex items-center gap-2 text-rose-200">
            <Pencil className="w-4 h-4 text-rose-400" />
            CLASSROOM WHITEBOARD
          </span>

          <div className="h-6 w-px bg-rose-900/60 mx-1 hidden sm:block" />

          {/* Color palette */}
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setColor(c.hex);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  !isEraser && color === c.hex ? 'scale-125 border-white shadow-sm' : 'border-black/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Color ${c.name}`}
              />
            ))}
          </div>

          <div className="h-6 w-px bg-rose-900/60 mx-1 hidden sm:block" />

          {/* Stroke thickness */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-rose-200">
            <span>Thickness:</span>
            {[2, 4, 8, 14].map((w) => (
              <button
                key={w}
                onClick={() => setLineWidth(w)}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  lineWidth === w ? 'bg-rose-500 text-white' : 'bg-rose-950 hover:bg-rose-900 text-rose-200'
                }`}
                aria-label={`Thickness ${w}px`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isEraser ? 'bg-amber-500 text-black font-bold' : 'bg-rose-900 hover:bg-rose-800 text-rose-100'
            }`}
            title="Eraser tool"
            aria-label="Eraser tool"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 rounded-lg text-xs bg-rose-900 hover:bg-rose-800 disabled:opacity-40 text-rose-100 transition"
            title="Undo stroke"
            aria-label="Undo stroke"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-900 hover:bg-rose-800 text-rose-100 flex items-center gap-1 transition"
            title="Clear canvas"
            aria-label="Clear all canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-900 hover:bg-rose-800 text-rose-100 flex items-center gap-1 transition"
            title="Save notes as image"
            aria-label="Download whiteboard notes"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <div className="h-6 w-px bg-rose-900/60 mx-1" />

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition shadow"
            aria-label="Close board"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>


      {/* Canvas */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
