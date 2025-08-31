// src/components/ParticlesBackground.js
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  // Use useCallback to avoid unnecessary re-renders
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const options = {
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: "#ffffff" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: {
        value: ["#36C5F0", "#ECB22E", "#2EB67D", "#E01E5B"],
      },
      links: {
        color: "#808080",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      collisions: { enable: false },
      move: {
        directions: "none",
        enable: true,
        outModes: { default: "out" },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        value: 80,
        density: { enable: true, area: 800 },
      },
      opacity: {
        value: 0.9,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 4, max: 8 },
      },
    },
    detectRetina: true,
  };

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
};

export default ParticlesBackground;
