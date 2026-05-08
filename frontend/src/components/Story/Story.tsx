import "./story.css";

const AboutSection = () => {
  return (
    <section className="about">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        Home / <span>About</span>
      </div>

      {/* Content */}
      <div className="about-container">

        {/* Left */}
        <div className="about-text">
          <h1>Our Story</h1>

          <p>
            Launched in 2015, Exclusive is South Asia’s premier online shopping
            marketplace with an active presence in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Exclusive
            has 10,500 sellers and 300 brands and serves 3 millions customers
            across the region.
          </p>

          <p>
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assortment in categories
            ranging from consumer.
          </p>
        </div>

        {/* Right */}
        <div className="about-image">
          <img src="/images/story.jpg" alt="Our Story" />
        </div>

      </div>

    </section>
  );
};

export default AboutSection;