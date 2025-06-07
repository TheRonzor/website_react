import { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface Point {
  x: number;
  y: number;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export default function LinearAlgebraIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalPoints, setOriginalPoints] = useState<Point[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 0],
    [0, 1],
  ]);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw axes
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawAxes(ctx);

    // Draw original points
    originalPoints.forEach((pt) => drawPoint(ctx, pt, 'blue', true));

    // Draw transformed points
    originalPoints.forEach((pt) => {
      const transformed = applyMatrix(pt, matrix);
      drawPoint(ctx, transformed, 'red', false);
    });
  }, [originalPoints, matrix]);

  const addPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - CANVAS_WIDTH / 2;
    const y = -(e.clientY - rect.top - CANVAS_HEIGHT / 2); // Flip y-axis
    setOriginalPoints((prev) => [...prev, { x, y }]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    addPointFromEvent(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing.current) {
      addPointFromEvent(e);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleSliderChange = (i: number, j: number, value: number) => {
    const newMatrix = [...matrix.map(row => [...row])];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
  };

  const clearCanvas = () => {
    setOriginalPoints([]);
  };

  const resetMatrix = () => {
    setMatrix([
      [1, 0],
      [0, 1],
    ]);
  };

  const latex = `
$$\\begin{bmatrix} ${matrix[0][0].toFixed(2)} & ${matrix[0][1].toFixed(2)} \\\\ 
${matrix[1][0].toFixed(2)} & ${matrix[1][1].toFixed(2)} \\end{bmatrix}
\\begin{bmatrix} x \\\\ y \\end{bmatrix} =
\\begin{bmatrix}
${matrix[0][0].toFixed(2)}x + ${matrix[0][1].toFixed(2)}y \\\\ 
${matrix[1][0].toFixed(2)}x + ${matrix[1][1].toFixed(2)}y
\\end{bmatrix}$$`;

  return (
    <div className="container py-4">
      <h1 className="text-center">Intro to Linear Algebra</h1>
      <p className="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

      <div className="d-flex justify-content-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="d-flex justify-content-center align-items-start mt-4">
        <div className="d-flex flex-row me-4">
          {[0, 1].map((j) => (
            <div className="d-flex flex-column me-3" key={j}>
              {[0, 1].map((i) => (
                <div className="mb-3" key={i}>
                  <label className="form-label">
                    {matrix[i][j].toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    step={0.1}
                    value={matrix[i][j]}
                    className="form-range"
                    onChange={(e) => handleSliderChange(i, j, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <MathJaxContext>
            <MathJax>{`\\[${latex}\\]`}</MathJax>
          </MathJaxContext>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-danger mx-2" onClick={clearCanvas}>Clear Plot</button>
        <button className="btn btn-secondary mx-2" onClick={resetMatrix}>Reset Matrix</button>
      </div>
    </div>
  );
}

function drawAxes(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

  // x-axis
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT / 2);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  ctx.stroke();

  // y-axis
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
}

function drawPoint(ctx: CanvasRenderingContext2D, pt: Point, color: string, filled: boolean) {
  ctx.beginPath();
  ctx.arc(pt.x + CANVAS_WIDTH / 2, -pt.y + CANVAS_HEIGHT / 2, 5, 0, 2 * Math.PI);
  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function applyMatrix(pt: Point, matrix: number[][]): Point {
  return {
    x: pt.x * matrix[0][0] + pt.y * matrix[0][1],
    y: pt.x * matrix[1][0] + pt.y * matrix[1][1],
  };
}
