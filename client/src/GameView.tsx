import React, { useState } from "react";
import "./GameView.css";

export default function GameView() {

  const [isDeckHovered, setIsDeckHovered] = useState(false);

  return (
    <div className="hc-stage">
      {/* wall */}
      <div className="hc-wall" />

      {/* floor */}
      <div className="hc-floor" />
      <div className="hc-floorLip" />

      {/* light / spotlight */}
      <div className="hc-spotlight" />

      {/* LAMP */}
      <div className="hc-lampCord" />
      <div className="hc-lampShade" />
      <div className="hc-lampRim" />
      <div className="hc-lampBulb" />

      {/* table */}
      <div className="hc-tableTop" />
      <div className="hc-tableLeg" />
      <div className="hc-tableBase" />

      {/* deck */}
      <button
        type="button"
        className={`hc-deckButton ${isDeckHovered ? "isDeckHovered" : ""}`}
        onMouseEnter={() => setIsDeckHovered(true)}
        onMouseLeave={() => setIsDeckHovered(false)}
      >
        <div className="hc-deckCards">
          <div className="hc-card backCard" />
          <div className="hc-card midCard" />
          <div className="hc-card topCard">
            <div className="hc-cardTitle">HUES</div>
            <div className="hc-cardAnd">AND</div>
            <div className="hc-cardTitle">CUES</div>
          </div>
        </div>

        <div className="hc-deckTip">Draw a card</div>
      </button>
    </div>
  );
}