import { useEffect, useRef } from 'react';

export function RotatingEarth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2.5;

    let rotation = 0;

    const drawOrbitingDots = () => {
      const dots = [
        { angle: 0.3, distance: 1.3, size: 6, color: '#ffd60a' },
        { angle: 1.8, distance: 1.5, size: 4, color: '#fca311' },
        { angle: 3.5, distance: 1.4, size: 5, color: '#14213d' },
      ];

      dots.forEach((dot) => {
        const x = centerX + Math.cos(rotation + dot.angle) * radius * dot.distance;
        const y = centerY + Math.sin(rotation + dot.angle) * radius * dot.distance;

        ctx.beginPath();
        ctx.arc(x, y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, dot.size + 3, 0, Math.PI * 2);
        ctx.strokeStyle = dot.color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    const drawEarth = () => {
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, '#4da6ff');
      gradient.addColorStop(0.3, '#0077cc');
      gradient.addColorStop(0.7, '#005599');
      gradient.addColorStop(1, '#003366');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const x = Math.cos(angle) * radius * 0.6;
        const y = Math.sin(angle) * radius * 0.6;
        const size = radius * (0.2 + Math.random() * 0.15);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#2d5f3f';
        ctx.fill();
      }

      ctx.restore();

      const atmosphereGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius,
        centerX,
        centerY,
        radius * 1.15
      );
      atmosphereGradient.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
      atmosphereGradient.addColorStop(1, 'rgba(100, 200, 255, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawOrbitingDots();
      drawEarth();

      rotation += 0.003;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
}
