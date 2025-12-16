import React, { useEffect, useRef } from "react";
import Image from "next/image";

const ImageBanner = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // 3D Particle animation setup and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particleCount = 70;
    const baseColor = { r: 189, g: 38, b: 211 }; // #BD26D3

    // Set canvas to full width of container
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Perspective settings
    const perspective = 400;
    const focalLength = 300;

    // Initialize 3D particles
    particlesRef.current = Array(particleCount)
      .fill()
      .map(() => ({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        size: Math.random() * 4 + 2,
        baseSize: Math.random() * 4 + 2, // Store original size for scaling
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        speedZ: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      }));

    // Animation function with 3D perspective
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort particles by z-index for proper depth rendering
      const sortedParticles = [...particlesRef.current].sort(
        (a, b) => a.z - b.z
      );

      // Update and draw particles
      sortedParticles.forEach((particle) => {
        // Apply mouse influence (slight attraction)
        const mouseInfluenceX =
          (mouseX - canvas.width / 2 - particle.x) * 0.0001;
        const mouseInfluenceY =
          (mouseY - canvas.height / 2 - particle.y) * 0.0001;

        // Update position with subtle mouse influence
        particle.x += particle.speedX + mouseInfluenceX;
        particle.y += particle.speedY + mouseInfluenceY;
        particle.z -= particle.speedZ;

        // If particle goes behind the viewer, reset to far distance
        if (particle.z < -focalLength) {
          particle.z = Math.random() * 1000;
          particle.x = Math.random() * canvas.width - canvas.width / 2;
          particle.y = Math.random() * canvas.height - canvas.height / 2;
        }

        // Calculate 3D projection
        const scale = focalLength / (focalLength + particle.z);
        const x2d = particle.x * scale + canvas.width / 2;
        const y2d = particle.y * scale + canvas.height / 2;
        const scaledSize = particle.baseSize * scale;

        // Calculate color based on depth
        const distance = 1 - Math.min(particle.z / 1000, 1);
        const opacity = particle.opacity * distance;

        // Apply color variation based on depth
        const colorVariation = Math.max(0.6, distance);
        const r = Math.floor(baseColor.r * colorVariation);
        const g = Math.floor(baseColor.g * colorVariation);
        const b = Math.floor(baseColor.b * colorVariation);

        // Draw particle with size based on perspective
        ctx.beginPath();
        ctx.arc(x2d, y2d, scaledSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();

        // Add glow effect for closer particles
        if (distance > 0.8) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, scaledSize * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDarkMode]);

  return (
    <div
      className="relative w-screen overflow-hidden mb-8"
      style={{ marginLeft: "calc(-50vw + 50%)" }}
    >
      {/* This technique breaks out of the parent container to go full-width */}
      <div
        className="w-screen"
        style={{
          position: "relative",
          // Desktop uses aspect ratio
          paddingBottom: "15%", // ~4.5:1 aspect ratio for desktop
        }}
      >
        {/* Responsive styles */}
        <style jsx>{`
          div {
            width: 100vw !important;
          }

          /* Fixed heights for tablet and mobile */
          @media (max-width: 1023px) {
            div {
              padding-bottom: 0 !important; /* Remove aspect ratio padding */
              height: 240px !important; /* Fixed height for tablet */
            }
          }

          @media (max-width: 640px) {
            div {
              padding-bottom: 0 !important; /* Remove aspect ratio padding */
              height: 180px !important; /* Fixed height for mobile */
            }
          }
        `}</style>

        <Image
          src={isDarkMode ? "/dashboard.png" : "/dashboard-light.png"}
          alt={"Wave Background"}
          fill
          priority={true}
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center bottom",
            objectFit: "cover",
          }}
        />

        {/* Canvas for 3D particle animation */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
      </div>
    </div>
  );
};

export default ImageBanner;
