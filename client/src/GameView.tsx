import React, { useState } from "react";
import "./GameView.css";

type Panel = "settings" | "leaderboard" | null;

const LEADERBOARD = [
  { name: "dather9", score: 2840 },
  { name: "gayvinShan",    score: 2210 },
  { name: "rubGut",  score: 1990 },
];

const rankClass = (i: number) =>
  i === 0 ? "hc-lbRow isFirst"
  : i === 1 ? "hc-lbRow isSecond"
  : i === 2 ? "hc-lbRow isThird"
  : "hc-lbRow";

export default function GameView() {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [colorblind, setColorblind] = useState(false);
  const [isTableHovered, setIsTableHovered] = useState(false);

  const toggle = (panel: Panel) =>
    setActivePanel(prev => (prev === panel ? null : panel));

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

      {/* body */}
      <div className="hc-body" />
      <div className="hc-body2" />
      <div className="hc-body3" />

      {/* table */}
      <div className="hc-tableTop" />
      <div className="hc-tableLeg" />
      <div className="hc-tableBase" />

      <button
      type="button"
      className={`hc-tableButton ${isTableHovered ? "isDeckHovered" : ""}`}
      onMouseEnter={() => setIsTableHovered(true)}
      onMouseLeave={() => setIsTableHovered(false)}
      />

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

      {/* nav top-right */}
      <div className="hc-topNav">
        <button
          type="button"
          className={`hc-navBtn ${activePanel === "leaderboard" ? "isActive" : ""}`}
          onClick={() => toggle("leaderboard")}
        >
          Scores
        </button>
        <button
          type="button"
          className={`hc-navBtn ${activePanel === "settings" ? "isActive" : ""}`}
          onClick={() => toggle("settings")}
        >
          Settings
        </button>
      </div>

      {/* settings label */}
      {activePanel === "settings" && (
        <div className="hc-panel">
          <div className="hc-panelHeader">Settings</div>
          <div className="hc-panelBody">
            <div className="hc-settingRow">
              <span className="hc-settingLabel">Colorblind mode</span>
              <label className="hc-toggle">
                <input
                  type="checkbox"
                  checked={colorblind}
                  onChange={e => setColorblind(e.target.checked)}
                />
                <span className="hc-toggleSlider" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* leaderboard dipslay */}
      {activePanel === "leaderboard" && (
        <div className="hc-panel">
          <div className="hc-panelHeader">Leaderboard</div>
          <div className="hc-panelBody">
            <table className="hc-lbTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((p, i) => (
                  <tr key={p.name} className={rankClass(i)}>
                    <td className="hc-lbRank">{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}