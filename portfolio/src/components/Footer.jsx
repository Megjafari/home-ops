import { Link } from "react-router-dom";
import { siteData } from "../data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-logo">{siteData.footer}</span>
          <ul className="footer-links">
            <li><Link to="/projects">projects</Link></li>
            <li><Link to="/about">about</Link></li>
            <li><Link to="/skills">skills</Link></li>
            <li><Link to="/contact">contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
