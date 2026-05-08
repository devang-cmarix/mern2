import { useState } from "react";
import "./styles/contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Message sent:", form);
  };

  return (
    <div className="contact-page">

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Contact</span>
      </nav>

      {/* ── Main card ── */}
      <div className="contact-card">

        {/* ── LEFT: info panel ── */}
        <aside className="contact-info">

          {/* Call To Us */}
          <div className="info-block">
            <div className="info-icon-row">
              <div className="icon-circle">
                {/* Phone icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                    A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4
                    2 2 0 0 1 3.06 1.22h3a2 2 0 0 1 2 1.72
                    12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91
                    a16 16 0 0 0 5.95 5.95l1.27-1.27a2 2 0 0 1 2.11-.45
                    12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z"/>
                </svg>
              </div>
              <h3 className="info-heading">Call To Us</h3>
            </div>
            <p className="info-text">We are available 24/7, 7 days a week.</p>
            <p className="info-text">Phone: +8801611112222</p>
          </div>

          <hr className="info-divider" />

          {/* Write To US */}
          <div className="info-block">
            <div className="info-icon-row">
              <div className="icon-circle">
                {/* Mail icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
                    c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="info-heading">Write To US</h3>
            </div>
            <p className="info-text">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="info-text">Emails: customer@exclusive.com</p>
            <p className="info-text">Emails: support@exclusive.com</p>
          </div>

        </aside>

        {/* ── RIGHT: form panel ── */}
        <div className="contact-form">

          {/* Top row: 3 inputs */}
          <div className="form-row">
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Your Name *"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Your Email *"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="form-input"
              type="tel"
              name="phone"
              placeholder="Your Phone *"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Textarea */}
          <textarea
            className="form-textarea"
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={9}
          />

          {/* Submit */}
          <div className="form-footer">
            <button className="btn-send" onClick={handleSubmit}>
              Send Message
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;