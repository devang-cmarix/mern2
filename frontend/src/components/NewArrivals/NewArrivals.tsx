import "./NewArrivals.css";

const NewArrivals = () => {
  return (
    <section className="na-section">

      {/* ── Header ── */}
      <div className="na-header">
        <div className="na-label">
          <span className="na-bar" />
          <span className="na-label-text">Featured</span>
        </div>
        <h2 className="na-title">New Arrival</h2>
      </div>

      {/* ── Grid ── */}
      <div className="na-grid">

        {/* PlayStation 5 — large left */}
        <div className="na-card na-card--large">
          <img src="/images/NewArrive1.jpg" alt="PlayStation 5" className="na-img na-img--ps5" />
          <div className="na-info">
            <h3>PlayStation 5</h3>
            <p>Black and White version of the PS5 coming out on sale.</p>
            <a href="#" className="na-link">Shop Now</a>
          </div>
        </div>

        {/* Women's Collections — top right */}
        <div className="na-card na-card--women">
          <img src="/images/NewArrive2.jpg" alt="Women's Collections" className="na-img na-img--women" />
          <div className="na-info">
            <h3>Women's Collections</h3>
            <p>Featured woman collections that give you another vibe.</p>
            <a href="#" className="na-link">Shop Now</a>
          </div>
        </div>

        {/* Speakers — bottom right left */}
        <div className="na-card na-card--small">
          <img src="/images/NewArrive3.jpg" alt="Speakers" className="na-img na-img--speakers" />
          <div className="na-info na-info--small">
            <h3>Speakers</h3>
            <p>Amazon wireless speakers</p>
            <a href="#" className="na-link">Shop Now</a>
          </div>
        </div>

        {/* Perfume — bottom right right */}
        <div className="na-card na-card--small">
          <img src="/images/NewArrive4.jpg" alt="Perfume" className="na-img na-img--perfume" />
          <div className="na-info na-info--small">
            <h3>Perfume</h3>
            <p>GUCCI INTENSE OUD EDP</p>
            <a href="#" className="na-link">Shop Now</a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NewArrivals;