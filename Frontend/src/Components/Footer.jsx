import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        {/* Left Section - Company Info + Social Links */}
        <div className="footer-left">
          <h2 className="footer-logo">Mangalore Store</h2>
          <p className="footer-description">
          Mangalore Store is a fast, reliable online platform for groceries, fresh produce, and daily essentials. We focus on freshness, quality, and customer satisfaction — delivering everything right to your doorstep.
          </p>

          <div className="social-links">
            <a href="https://www.instagram.com/qineossoftware9?igsh=eWxzNHM3dGF4ajBv" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/61570322945024" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.linkedin.com/company/qineos-software-private-limited" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
            <a href="https://m.youtube.com/@qineossoftware?fbclid=PAQ0xDSwKQEMRleHRuA2FlbQIxMAABp3CwGlFerFgYlWkOfgZpqp3sLHyAHqqVnIld4kjEyJJITpdLUcLtNyWVN9kQ_aem_XSaSKc1khrBg3jhHvh2teA" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>

          <p className="footer-company">&copy; {new Date().getFullYear()} Mangalore Store. All rights reserved.</p>
        </div>

        {/* Center Section - Links */}
        <div className="footer-center">
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/faqs">FAQs</Link>
          </div>
        </div>

        {/* Right Section - Get In Touch */}
        <div className="footer-right">
          <h4>Get In Touch</h4>
          <p><FaMapMarkerAlt className="footer-icon" /> 123 Mangalore, Dakshina-Kannada Dist</p>
          <p><FaPhoneAlt className="footer-icon" /> <a href="tel:+919876543210" className="footer-phone">+919167055930</a></p>
          <p><FaEnvelope className="footer-icon" /> <a href="mailto:mangalorestore@gmail.com" className="footer-email">qineossoftware@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
