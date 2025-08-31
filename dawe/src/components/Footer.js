import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer-gradient">
    <div className="footer-content">
      <div className="footer-social">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
      </div>
      <div className="footer-text">
        &copy; {new Date().getFullYear()} Protein Data Warehouse &mdash; All Rights Reserved
      </div>
    </div>
  </footer>
);

export default Footer;