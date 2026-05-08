import "./styles/notFound.css";
import { Link } from "react-router";

const NotFound = () => {

  return (
    <div className="contact-page">

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">404 Error</span>
      </nav>
<div className="not-found">
<h1 className="abc">404 Not Found</h1>
<p className="abcd">Your visited page not found. You may go home page.</p>

            <button className="btn-send">
              <Link to="/" className="ppp">Back To Home page</Link>
            </button>
</div>
      </div>
  );
};

export default NotFound;