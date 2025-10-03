import { useEffect, useState } from "react";

export function SpaceBackground() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the background image for better performance
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = "/background.png";
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url(/background.png)",
          opacity: imageLoaded ? 1 : 0,
        }}
      />

      {/* Fallback gradient while image loads */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(to bottom, #000814, #001d3d, #003566)",
          opacity: imageLoaded ? 0 : 1,
        }}
      />

      {/* Optional overlay for better text readability */}
      <div
        className="absolute inset-0 bg-black/20"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,20,61,0.2) 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Subtle animated overlay for depth */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            animationDuration: "8s",
          }}
        />
      </div>

      {/* Twinkling stars overlay */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
