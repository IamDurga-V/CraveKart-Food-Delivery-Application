import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    alert(`Thank you, ${name}! We'll get back to you soon.`);
    e.target.reset();
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
            <a
              href="https://github.com/IamDurga-V"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.facebook_icon} alt="GitHub" />
            </a>
            <a
              href="https://x.com/durgavellingiri?t=qf27gmJPyvidN5gumkJBQw&s=09"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a
              href="https://www.linkedin.com/in/durga-v-780165277/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
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
