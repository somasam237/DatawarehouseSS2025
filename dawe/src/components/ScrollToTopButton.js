import React, { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={show}>
      <Fab
        color="secondary"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1200,
          boxShadow: 6,
          background: "linear-gradient(135deg, #a21caf 60%, #f59e42 100%)",
          color: "#fff",
          '&:hover': {
            background: "linear-gradient(135deg, #f59e42 60%, #a21caf 100%)",
            transform: 'scale(1.15) rotate(-8deg)',
          },
          transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        }}
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon fontSize="large" />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;
