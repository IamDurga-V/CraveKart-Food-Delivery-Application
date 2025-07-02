import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    alert("Form submitted! (Add backend logic here)");
  };

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h2>CraveKart</h2>
          <p>
            CraveKart is committed to delivering culinary excellence. Since our
            inception, we've strived to serve meals that not only satisfy your
            hunger but also uplift your mood. With a passion for taste and
            quality, we continue to turn everyday meals into unforgettable
            experiences.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 6385883751</li>
            <li>durgavellingiri8@gmail.com</li>
          </ul>
        </div>
        <div className="footer-content-contact">
          <h2>CONTACT US</h2>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © CraveKart.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
