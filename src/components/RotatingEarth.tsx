import { useEffect, useRef } from "react";

export function RotatingEarth() {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    // Ensure the image is loaded
    const handleLoad = () => {
      console.log("Earth image loaded successfully");
    };

    img.addEventListener("load", handleLoad);

    return () => {
      img.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative group">
        {/* Main Earth Image */}
        <img
          ref={imageRef}
          src="/Earth.png"
          alt="Earth"
          className="w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-full animate-spin drop-shadow-2xl transition-transform group-hover:scale-105"
          style={{
            animationDuration: "30s",
            animationTimingFunction: "linear",
            filter:
              "drop-shadow(0 0 40px rgba(59, 130, 246, 0.6)) brightness(1.1) contrast(1.1)",
          }}
        />

        {/* Atmospheric Glow Effect */}
        <div
          className="absolute inset-0 rounded-full animate-pulse opacity-70"
          style={{
            background:
              "radial-gradient(circle, transparent 40%, rgba(6, 182, 212, 0.1) 60%, rgba(6, 182, 212, 0.3) 100%)",
          }}
        ></div>

        {/* Orbital Ring 1 */}
        <div
          className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin"
          style={{
            animationDuration: "25s",
            animationDirection: "reverse",
            width: "120%",
            height: "120%",
            left: "-10%",
            top: "-10%",
          }}
        >
          {/* Small orbital dot */}
          <div
            className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
            style={{ top: "50%", right: "0", transform: "translateY(-50%)" }}
          ></div>
        </div>

        {/* Orbital Ring 2 */}
        <div
          className="absolute inset-0 border border-blue-400/20 rounded-full animate-spin"
          style={{
            animationDuration: "40s",
            width: "140%",
            height: "140%",
            left: "-20%",
            top: "-20%",
          }}
        >
          {/* Small orbital dot */}
          <div
            className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
            style={{ top: "0", left: "50%", transform: "translateX(-50%)" }}
          ></div>
        </div>

        {/* Floating particles/stars around Earth */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle rotating highlight overlay */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-spin opacity-60"
          style={{
            animationDuration: "35s",
            background:
              "conic-gradient(transparent 0deg, rgba(255,255,255,0.1) 45deg, transparent 90deg)",
          }}
        />
      </div>
    </div>
  );
}
