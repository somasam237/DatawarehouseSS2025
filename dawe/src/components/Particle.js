import React, { useEffect, useRef } from "react";
import Particles from "react-tsparticles";
import "./Particle.css"; // Create this for your loader/atom styles

const particleOptions = {
  particles: {
    number: { value: 140, density: { enable: true, value_area: 800 } },
    color: { value: ["#2EB67D", "#ECB22E", "#E01E5B", "#36C5F0"] },
    shape: { type: "circle" },
    opacity: { value: 1, random: false },
    size: { value: 8, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#808080",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 5,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
    },
    modes: {
      repulse: { distance: 70, duration: 0.4 },
      push: { particles_nb: 4 },
    },
  },
  retina_detect: true,
};

const words = ["Welcome", "to", "Protein Data Warehouse"];

const AnimatedText = ({ words }) => {
  const ref = useRef();
  useEffect(() => {
    let wordsCount = 0;
    let count = 0;
    let spans = [];
    let letterInterval, removeInterval;

    function entry() {
      if (wordsCount < words.length) {
        let word = words[wordsCount];
        let txtArr = word.split("");
        count = 0;
        ref.current.innerHTML = "";
        txtArr.forEach((letter) => {
          let _letter = letter === " " ? "\u00A0" : letter;
          ref.current.innerHTML += `<span>${_letter}</span>`;
        });
        spans = ref.current.childNodes;
        letterInterval = setInterval(activeLetter, 70);
      } else {
        wordsCount = 0;
        entry();
      }
    }

    function activeLetter() {
      spans[count].classList.add("active");
      count++;
      if (count === spans.length) {
        clearInterval(letterInterval);
        setTimeout(() => {
          eraseText();
        }, 600);
      }
    }

    function eraseText() {
      count--;
      removeInterval = setInterval(removeLetter, 40);
    }

    function removeLetter() {
      spans[count].classList.remove("active");
      count--;
      if (count === -1) {
        clearInterval(removeInterval);
        wordsCount++;
        entry();
      }
    }

    entry();
    return () => {
      clearInterval(letterInterval);
      clearInterval(removeInterval);
    };
  }, [words]);

  return (
    <div className="animated-text" ref={ref} style={{ fontSize: "2rem", textAlign: "center", margin: "1.5rem 0" }} />
  );
};

const Particle = () => (
  <div>
    {/* Loader/Atom Animation */}
    <div className="loader-container">
      <div className="atom">
        <div className="electron"></div>
        <div className="electron-alpha"></div>
        <div className="electron-omega"></div>
      </div>
    </div>
    {/* Animated Text */}
    <AnimatedText words={words} />
    {/* Particle Effect */}
     <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", zIndex: -1 }}>

      <Particles
        id="tsparticles"
        options={particleOptions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
    </div>
  </div>
);

export default Particle;
