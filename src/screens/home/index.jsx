
import React, { useEffect, useRef, useState } from 'react';
import { SWATCHES } from '../../../constant';
import { Group, ColorSwatch } from '@mantine/core';
import axios from 'axios';

function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('rgb(255, 255, 255)');
  const [reset, setReset] = useState(false);
  const [dictOfVar, setDictOfVar] = useState({});
  const [latexExpression, setLatexExpression] = useState([]);
  const [result, setResult] = useState({});

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult("");
      setDictOfVar({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
      }
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const renderLatexToCanvas = (expression, answer) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression([...latexExpression, latex]);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const SendData = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        setResult(null);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/EduTech`, {
          image: canvas.toDataURL('image/png'),
          dict_of_vars: dictOfVar,
        });

        const resp = response.data;
        if (resp && resp.status === "success" && resp.data && Array.isArray(resp.data)) {
          if (resp.data.length > 0) {
            const firstData = resp.data[0];
            setResult({
              expression: firstData.expr,
              answer: firstData.result,
            });
          }
        } else {
          setResult({
            expression: "Error",
            answer: "Invalid response format"
          });
        }
      } catch (error) {
        setResult({
          expression: "Error",
          answer: error.message || "Failed to process"
        });
      }
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        setIsDrawing(true);
      }
    }
    setLatexExpression([]);
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    if (isDrawing && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="control-panel">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">SolveIt</h1>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm text-slate-300 mb-1">Drawing Color</span>
                <div className="flex gap-1 p-1 bg-slate-700/50 rounded-md">
                  {SWATCHES.map((swatchColor) => (
                    <ColorSwatch
                      key={swatchColor}
                      color={swatchColor}
                      onClick={() => setColor(swatchColor)}
                      className="cursor-pointer transition-all duration-200 hover:scale-110"
                      size={20}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => setReset(true)}
                className="button button-clear"
              >
                🗑️ Clear
              </button>
              <button
                onClick={SendData}
                className="button button-solve"
              >
                ✨ Solve
              </button>
            </div>
          </div>
        </div>
      </nav>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-slate-900 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

      {result && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-slate-800/95 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-slate-700 min-w-[300px]">
            <div className="text-xl text-white">
              {`${result.expression} = ${result.answer}`}
            </div>
          </div>
        </div>
      )}

      {result === null && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-500 border-t-blue-500"></div>
              <span className="text-lg text-white">Processing equation...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
