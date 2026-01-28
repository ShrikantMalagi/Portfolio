import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import "./GameHud.css";

type GameHudProps = {
  aimMode: boolean;
};

function GameHud({ aimMode }: GameHudProps) {
  const [aimPoint, setAimPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setAimPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const handleMouseMove = (event: MouseEvent) => {
      setAimPoint({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Html fullscreen>
      <div className="game-hud">
        <div className="game-hud__legend">
          <div className="game-hud__title">Controls</div>
          <div className="game-hud__row">
            <span>WASD</span>
            <span>Turn</span>
          </div>
          <div className="game-hud__row">
            <span>Shift</span>
            <span>Move forward</span>
          </div>
          <div className="game-hud__row">
            <span>LMB</span>
            <span>Fire</span>
          </div>
          <div className="game-hud__row">
            <span>RMB</span>
            <span>Aim mode</span>
          </div>
        </div>
        {aimMode && (
          <div
            className="game-hud__crosshair"
            style={{ left: aimPoint.x, top: aimPoint.y }}
          >
            <span className="game-hud__crosshair-line game-hud__crosshair-line--top" />
            <span className="game-hud__crosshair-line game-hud__crosshair-line--right" />
            <span className="game-hud__crosshair-line game-hud__crosshair-line--bottom" />
            <span className="game-hud__crosshair-line game-hud__crosshair-line--left" />
            <span className="game-hud__crosshair-dot" />
            <div className="game-hud__crosshair-label">Aim mode</div>
          </div>
        )}
      </div>
    </Html>
  );
}

export default GameHud;
