import { useState } from "react";
import "./Team.css";

type Member = {
  id: number;
  name: string;
  role: string;
  image: string;
  twitter: string;
  instagram: string;
  linkedin: string;
};

const members: Member[] = [
  {
    id: 1,
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: "/images/team1.jpg",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Emma Watson",
    role: "Managing Director",
    image: "/images/team2.jpg",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Will Smith",
    role: "Product Designer",
    image: "/images/team3.jpg",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Chris Evans",
    role: "Head of Marketing",
    image: "/images/team1.jpg",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
  {
    id: 5,
    name: "Scarlett Johansson",
    role: "Lead Developer",
    image: "/images/team2.jpg",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
];

const VISIBLE = 3; // cards visible at once
const TOTAL_DOTS = 5;

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Team = () => {
  const [active, setActive] = useState(2); // 3rd dot active (0-indexed)

  // Determine which 3 members to show based on active dot
  const startIndex = Math.min(active, members.length - VISIBLE);
  const visible = members.slice(startIndex, startIndex + VISIBLE);

  return (
    <section className="team-section">

      {/* ── Cards ── */}
      <div className="team-grid">
        {visible.map((m) => (
          <div className="team-card" key={m.id}>

            {/* Photo */}
            <div className="team-photo">
              <img src={m.image} alt={m.name} />
            </div>

            {/* Info */}
            <div className="team-info">
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role">{m.role}</p>

              {/* Social icons */}
              <div className="team-socials">
                <a href={m.twitter} className="team-social-link" aria-label="Twitter">
                  <TwitterIcon />
                </a>
                <a href={m.instagram} className="team-social-link" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href={m.linkedin} className="team-social-link" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ── Dots ── */}
      <div className="team-dots">
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
          <button
            key={i}
            className={`team-dot ${i === active ? "team-dot--active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default Team;