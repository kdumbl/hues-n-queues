import { generateLeaderboard } from "../GameScreen.tsx";
import type { GameState } from "../types.ts";
import { useState } from "react";

interface TopRightMenusProps {
    gameState: GameState;
    activePanel;
    setActivePanel: Function;
    buttonBorderWidth: number;
    setButtonBorderWidth: Function;

}

const rankClass = (i: number) =>
  i === 0 ? "hc-lbRow isFirst"
  : i === 1 ? "hc-lbRow isSecond"
  : i === 2 ? "hc-lbRow isThird"
  : "hc-lbRow";

export default function TopRightMenus({ gameState, activePanel, setActivePanel, buttonBorderWidth, setButtonBorderWidth }: TopRightMenusProps){

    const toggle = (panel: Panel) =>
        setActivePanel(prev => (prev === panel ? null : panel));

    return (
        <>
            {/* nav top-right */}
            <div className="hc-topNav" style={{ marginTop: '30px' }}>
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
                <div className="hc-panel" style={{ marginTop: '30px' }}>
                <div className="hc-panelHeader">Settings</div>
                <div className="hc-panelBody">
                    <div className="hc-settingRow">
                    <span className="hc-settingLabel">Grid line thickness</span>
                        <div>
                        <input type="range" min="0" max="0.5" step="0.05" value={buttonBorderWidth} className="slider" id="myRange" onChange={
                            (e) => setButtonBorderWidth(Number(e.target.value))}/>
                        </div>
                    </div>
                </div>
                </div>
                )}

                {/* leaderboard display */}
                {activePanel === "leaderboard" && (
                <div className="hc-panel" style={{ marginTop: '30px' }}>
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
            </>
        )
    }