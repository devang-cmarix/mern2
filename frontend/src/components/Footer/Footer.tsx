import { FiSend } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col">
          <h2 className="logo">Exclusive</h2>
          <h4>Subscribe</h4>
          <p>Get 10% off your first order</p>

          <div className="subscribe-box">
            <input placeholder="Enter your email" />
            <FiSend />
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>Support</h4>
          <p>111 Bijoy sarani, Dhaka,</p>
          <p>DH 1515, Bangladesh.</p>
          <p>exclusive@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>Account</h4>
          <p>My Account</p>
          <p>Login / Register</p>
          <p>Cart</p>
          <p>Wishlist</p>
          <p>Shop</p>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4>Quick Link</h4>
          <p>Privacy Policy</p>
          <p>Terms Of Use</p>
          <p>FAQ</p>
          <p>Contact</p>
        </div>

        {/* Column 5 */}
        <div className="footer-col">
          <h4>Download App</h4>
          <p className="small">Save $3 with App New User Only</p>

          <div className="app-section">
            <div className="qr">
              <img src="/images/qrcode.jpg" alt="QR Code" />
            </div>

            <div className="store-buttons">
              <img src="/images/FooterGPlay.jpg" alt="Google Play" className="store-img" />
              <img src="/images/FooterAStore.jpg" alt="App Store" className="store-img" />
            </div>
          </div>

          <div className="socials">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© Copyright Rimel 2022. All right reserved</p>
      </div>
    </footer>
  );
};

export default Footer;