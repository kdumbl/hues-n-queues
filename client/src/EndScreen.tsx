import React, { useEffect, useRef } from 'react';
import './EndScreen.css';
import type { Player } from './types';
/*
interface Player {
  userId: string;
  username: string;
  score: number;
}
*/
interface EndScreenProps {
  players: Player[];
  currentUser: { token: string; userId: string; username: string } | null;
  onReturnToLobby: () => void;
}

export default function EndScreen({ players, currentUser, onReturnToLobby }: EndScreenProps) {
  const confettiRef = useRef<HTMLCanvasElement>(null);

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0] ?? null;
  const isWinner = winner?.name === currentUser?.username;

  /* ── lightweight confetti ── */
  useEffect(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#ffd84a', '#ff6b6b', '#6bffb8', '#6baeff', '#e06bff'];
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      r: Math.random() * 5 + 3,
      d: Math.random() * 2 + 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y += p.d;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const rankLabel = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '2';
    if (i === 2) return '3';
    if (i === 3) return '4';
    return `#${i + 1}`;
  };

  return (
    <div className="es-stage">
      <canvas className="es-confetti" ref={confettiRef} />

      <div className="es-wall" />
      <div className="es-floor" />
      <div className="es-floorLip" />
      <div className="es-spotlight" />

      <div className="es-lampCord" />
      <div className="es-lampShade" />
      <div className="es-lampRim" />
      <div className="es-lampBulb" />

      <div className="es-card">
        <div className="es-brand">HUES & CUES</div>
        <div className="es-subtitle">Game Over</div>

        {winner && (
          <div className="es-winnerBanner">
            <div className="es-winnerCrown">♛</div>
            <div className="es-winnerName">{winner.name}</div>
            <div className="es-winnerScore">{winner.score} pts</div>
            {isWinner && <div className="es-youWon">That's you!</div>}
          </div>
        )}

        <div className="es-divider"><span>Final Scores</span></div>

        <div className="es-scoreList">
          {sorted.map((player, i) => (
            <div
              key={player.name}
              className={`es-scoreRow ${player.name === currentUser?.username ? 'es-scoreRow--self' : ''} ${i === 0 ? 'es-scoreRow--first' : ''}`}
            >
              <span className="es-rank">{rankLabel(i)}</span>
              <span className="es-playerName">{player.name}</span>
              <span className="es-score">{player.score}</span>
            </div>
          ))}
        </div>

        <div className="es-actions">
          <button type="button" className="es-submit es-submit--primary" onClick={onReturnToLobby}>
            Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
