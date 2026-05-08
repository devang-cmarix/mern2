import { useEffect, useState } from "react";
import "./MusicBanner.css";

const MusicBanner = () => {
  const [time, setTime] = useState({
    hours: 23,
    days: 5,
    minutes: 59,
    seconds: 35,
  });

  useEffect(() => {
    // Target: 5 days, 23 hours, 59 minutes, 35 seconds from now
    const target =
      new Date().getTime() +
      5 * 24 * 60 * 60 * 1000 +
      23 * 60 * 60 * 1000 +
      59 * 60 * 1000 +
      35 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const timeUnits = [
    { value: time.days, label: "Days" },
    { value: time.hours, label: "Hours" },
    { value: time.minutes, label: "Minutes" },
    { value: time.seconds, label: "Seconds" },
  ];

  return (
    <section className="music-banner">
      {/* Dark gradient overlay */}
      <div className="banner-overlay" />

      {/* Product image — right side */}
      <div className="banner-image">
        <img src="/images/JBL_Hero.jpg" alt="JBL Boombox Speaker" />
      </div>

      {/* Left content */}
      <div className="banner-content">
        <p className="banner-category">Categories</p>

        <h1 className="banner-title">
          Enhance Your<br />Music Experience
        </h1>

        {/* Countdown circles */}
        <div className="banner-timer">
          {timeUnits.map((unit) => (
            <div className="timer-circle" key={unit.label}>
              <span className="timer-value">{pad(unit.value)}</span>
              <span className="timer-label">{unit.label}</span>
            </div>
          ))}
        </div>

        <button className="banner-btn">Buy Now!</button>
      </div>
    </section>
  );
};

export default MusicBanner;