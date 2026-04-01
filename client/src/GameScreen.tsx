import React, { useState } from 'react';
//import {socket} from "./api/socket.tsx";
import "./GameScreen.css";
import { Socket } from 'socket.io-client';
import type { GameState } from "./types";
import warpedBoard from "./assets/warped_board.png";
import LeaderboardSort from './LeaderboardSort';


type Panel = "settings" | "leaderboard" | null;

function generateLeaderboard(gameState){
  let LEADERBOARD = [];
  if (gameState != undefined){
    let general = [];
    general[0] = [gameState.self.score, gameState.self.name];
    for (let i = 1; i < 4; i++){
      general[i] = [gameState.otherPlayers[i - 1].score, gameState.otherPlayers[i - 1].name];
    }
    general = LeaderboardSort(general);
    for (let i = 0; i < 4; i++){
      LEADERBOARD[i] = { name: general[i][1], score: general[i][0] }
    };
  } else {
    LEADERBOARD = [ {name: "we messed up", score: -1}];
  }

  return LEADERBOARD;
}

function color_string_to_background(colorString){
  if (colorString == "RED"){
    return "radial-gradient(ellipse at 40% 30%, #f60202 0%, #c81515 55%, #5f0202 100%)";
  } else if (colorString == "YELLOW"){
    return "radial-gradient(ellipse at 40% 30%, #dfdb0b 0%, #afad1c 55%, #6e6809 100%)";
  } else if (colorString == "GREEN"){
    return "radial-gradient(ellipse at 15% 10%, #229508 0%, #166904 55%, #105301 100%)";
  } else {
    return "radial-gradient(ellipse at 15% 10%, #0532ff 0%, #2b28c9 55%, #0e025f 100%)";
  }
}

const rankClass = (i: number) =>
  i === 0 ? "hc-lbRow isFirst"
  : i === 1 ? "hc-lbRow isSecond"
  : i === 2 ? "hc-lbRow isThird"
  : "hc-lbRow";

interface Props {
  socket: Socket| null;
  gameState: GameState | undefined;
  switchView: (v:"board" | "game") => void;
}

//pass in the props
export default function GameScreen({socket, gameState, switchView}: Props) {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [colorblind, setColorblind] = useState(false);
  const [isTableHovered, setIsTableHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [cueText, setCueText] = useState('');
  const [cardDrawn, setCardDrawn] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const toggle = (panel: Panel) =>
    setActivePanel(prev => (prev === panel ? null : panel));

  const showAnnouncement = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 1000000);
  };

  //add the switch view functionality
  const viewChanger = () =>{
    //this call that setView func defined in app.tsx
    switchView("board");
    console.log("View Switched!");
  };

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
      <div className="hc-body" style={{background: color_string_to_background(gameState?.otherPlayers[0].pieceColor)}} />
      <div className="hc-body2" style={{background: color_string_to_background(gameState?.otherPlayers[1].pieceColor)}} />
      <div className="hc-body3" style={{background: color_string_to_background(gameState?.otherPlayers[2].pieceColor)}} />
      <div className="hc-deckTip" style={{'zIndex': '200', position: 'absolute', left: '33.73vw', top: '54vh'}}>{gameState?.otherPlayers[0].name}</div>
      <div className="hc-deckTip" style={{'zIndex': '200', position: 'absolute', left: '48.3vw', top: '48vh'}}>{gameState?.otherPlayers[1].name}</div>
      <div className="hc-deckTip" style={{'zIndex': '200', position: 'absolute', left: '62.4%', top: '54vh'}}>{gameState?.otherPlayers[2].name}</div>

      {/* table */}
      <div className="hc-tableTop" />
      <div className="hc-tableLeg" />
      <div className="hc-tableBase" />

      <img src={warpedBoard} style={{'zIndex': '200', position: 'absolute', 'width': '250px', height: 'auto', left: '43%', top: '58vh'}} />

      {/* added the switch view here; I assume this is button we want it on */}
      <button
      type="button"
      className={`hc-tableButton ${isTableHovered ? "isDeckHovered" : ""}`}
      onMouseEnter={() => setIsTableHovered(true)}
      onMouseLeave={() => setIsTableHovered(false)}
      onClick = {viewChanger}
      />

      {cardDrawn && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '260px',
          height: '420px',
          background: 'linear-gradient(155deg, #1c1c1c, #2e2e2e)',
          border: '2px solid #3e3e3e',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.95)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          animation: 'panelIn 0.25s ease'
        }}>
          <div style={{fontFamily: 'Impact', fontSize: '22px', color: '#fff', letterSpacing: '2px'}}>HUES & CUES</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 20px', width: '100%', boxSizing: 'border-box' as const}}>
            {['#e74c3c','#f1c40f','#2ecc71','#3498db'].map(color => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  height: '80px',
                  borderRadius: '10px',
                  background: color,
                  boxShadow: selectedColor === color ? `0 0 0 3px #fff, 0 4px 16px rgba(0,0,0,0.6)` : '0 4px 16px rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  transform: selectedColor === color ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter yourrr cue!"
            value={cueText}
            onChange={e => setCueText(e.target.value)}
            style={{
              width: 'calc(100% - 40px)',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#fff',
              fontFamily: 'Courier New, monospace',
              fontSize: '11px',
              outline: 'none',
              letterSpacing: '0.5px'
            }}
          />
          <button
            onClick={() => {
              showAnnouncement(`Jackson's hint is ${cueText}`);
              setCardDrawn(false);
            }}
            style={{
              padding: '8px 24px',
              background: 'rgba(255,216,74,0.12)',
              border: '1px solid rgba(255,216,74,0.45)',
              borderRadius: '6px',
              color: '#ffd84a',
              fontFamily: 'Courier New, monospace',
              fontSize: '11px',
              letterSpacing: '1.5px',
              cursor: 'pointer',
            }}
          >Submit Cue</button>
        </div>
      )}

      {/* deck */}
      <button
        type="button"
        className={`hc-deckButton ${isDeckHovered ? "isDeckHovered" : ""}`}
        onMouseEnter={() => setIsDeckHovered(true)}
        onMouseLeave={() => setIsDeckHovered(false)}
        onClick={() => setCardDrawn(prev => !prev)}
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

      {/* announcement banner */}
      {announcement && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(10,10,14,0.94)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '14px 28px',
          color: '#fff',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          letterSpacing: '1px',
          zIndex: 400,
          whiteSpace: 'nowrap' as const,
          animation: 'panelIn 0.2s ease'
        }}>
          {announcement}
        </div>
      )}

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
                {generateLeaderboard(gameState).map((p, i) => (
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
