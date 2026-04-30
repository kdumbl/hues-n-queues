import { useState, useEffect, useRef } from 'react';
import "./GameScreen.css";
import "./components/BoardScreen.css";
import "./components/BoardScreen.tsx"
import { Socket } from 'socket.io-client';
import type { GameState } from "./types";
import warpedBoard from "./assets/warped_board.png";
import LeaderboardSort from './LeaderboardSort';
import { rcs } from './ColorPalettes';
import validateClue from './ValidateClue';
import { HCRow } from "./GridPrep.tsx";
import { colorStringToPiece, createScoreImages, createImages } from "./ImagePrep.tsx";
import TopRightMenus from './components/TopRightMenus.tsx';
import BoardScreen from './components/BoardScreen.tsx';

function masterToIndividualGameState(masterGameState, connectionOrder){
  console.log(connectionOrder);
  if (connectionOrder == 0){
    console.log("Assigned as if connOrder was 0");
    return masterGameState;
  } else if (connectionOrder == 1){
    let indGameState: GameState = {
      players: [masterGameState.players[1], masterGameState.players[2], masterGameState.players[3], masterGameState.players[0]]
    };
    console.log("Assigned as if connOrder was 1");
    return indGameState;
  } else if (connectionOrder == 2){
    let indGameState: GameState = {
      players: [masterGameState.players[2], masterGameState.players[3], masterGameState.players[0], masterGameState.players[1]]
    };
    console.log("Assigned as if connOrder was 2");
    return indGameState;
  } else if (connectionOrder == 3){
    let indGameState: GameState = {
      players: [masterGameState.players[3], masterGameState.players[0], masterGameState.players[1], masterGameState.players[2]]
    };
    console.log("Assigned as if connOrder was 3");
    return indGameState;
  }
}

export function generateLeaderboard(gameState){
  let LEADERBOARD = [];
  if (gameState != undefined){
    let general = [];
    for (let i = 0; i < 4; i++){
      general[i] = [gameState.players[i].score, gameState.players[i].name];
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

function indexToGrid(colorIndex){
  let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
  let gridPosition = letters[Math.floor(colorIndex / 30)];
  gridPosition += (1 + colorIndex % 30);
  return gridPosition;
}

interface Props {
  socket: Socket| null;
  gameState: GameState | undefined;
  connectionNumber: number | null;
}

export default function GameScreen({socket, gameState, connectionNumber}: Props) {
  const [onBoardScreen, setOnBoardScreen] = useState(false);
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [isTableHovered, setIsTableHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedColorIndex, setSelectedColorIndex] = useState<string>("");
  const [cueText, setCueText] = useState('');
  const [cardDrawn, setCardDrawn] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [possibleColors, setPossibleColors] = useState([["", ""], ["", ""], ["", ""], ["", ""]]);
  const [clueErrorMessage, setClueErrorMessage] = useState<string | boolean>("");
  const items = [];
  type Panel = "settings" | "leaderboard" | null;
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
  const [lastPlaced, setLastPlaced] = useState(null);
  const [lastPlacedSecondRound, setLastPlacedSecondRound] = useState(null);
  const [images, setImages] = useState(createImages(gameState));
  const [scoreImages, setScoreImages] = useState(createScoreImages(gameState));
  const [lastClueGiver, setLastClueGiver] = useState(0);
  const [buttonBorderWidth, setButtonBorderWidth] = useState(0.15);
  const prevScoreRef = useRef(gameState?.players[0]?.score || 0);
  const [scoreToast, setScoreToast] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>(null);

  useEffect(() => {
    const currentScore = gameState?.players[0]?.score || 0;
    if (currentScore > prevScoreRef.current) {
      const pointsGained = currentScore - prevScoreRef.current;
      setScoreToast(`+${pointsGained} Points!`);
      const timer = setTimeout(() => setScoreToast(null), 4000);
      prevScoreRef.current = currentScore;
      return () => clearTimeout(timer);
    } else if (currentScore < prevScoreRef.current) {
      prevScoreRef.current = currentScore;
    }
  }, [gameState?.players[0]?.score]);

  const getInstructions = () => {
    if (!gameState) return "Waiting for game state...";
    const me = gameState.players[0];

    if (me.isClueGiver) {
      if (me.yourTurn) {
         if (me.clue === "") return "You are the Clue Giver! Draw a card and give a 1-word clue (no color words).";
         if (me.clue !== "" && me.secondClue === "") return "You can give a 2nd clue of up to two words, or end the round.";
      }
      return "Clue submitted. Waiting for other players to guess...";
    } else {
      if (me.yourTurn) {
         if (!onBoardScreen) return "It's your turn! Click the board on the table to access the board screen and place your piece.";
         return "It's your turn! Place your piece on the grid and click Submit.";
      }
      if (!onBoardScreen) return "Waiting for your turn... You can click the board to watch the progress.";
      return "Waiting for your turn...";
    }
  };

  //Called when a game space is clicked
  function addPiece(i) {
    if (gameState.players[0].yourTurn){
      let tempImages = images.slice();
      if (gameState.players[0].secondClue == ""){
        if (lastPlaced != null){
          tempImages[lastPlaced] = null;
        }
        setLastPlaced(i);
      } else {
        if (lastPlacedSecondRound != null){
          tempImages[lastPlacedSecondRound] = null;
        }
        setLastPlacedSecondRound(i);
      }
      tempImages[i] = colorStringToPiece(gameState?.players[0].pieceColor);
      setImages(tempImages);
    }
  }

  socket?.on("gameState updated", (masterGameState) => {
    setImages(createImages(masterToIndividualGameState(masterGameState, connectionNumber)));
    setScoreImages(createScoreImages(masterToIndividualGameState(masterGameState, connectionNumber)));
    if (gameState.players[lastClueGiver].isClueGiver == false){
      for (let i = 0; i < 4; i++){
        if (gameState.players[i].isClueGiver == true){
          setLastClueGiver(i);
        }
      }
    }
  })

  const showAnnouncement = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 1000000);
  };

  const viewChanger = () =>{
    if (onBoardScreen){
      setOnBoardScreen(false);
    } else {
      setOnBoardScreen(true);
    }
    console.log("View Switched!");
  };

  function chooseCardColors(){
    if (possibleColors[0][0] == ""){
      let ind1 = Math.floor(Math.random() * 480);
      let ind2 = -1;
      let ind3 = -1;
      let ind4 = -1;
      while (ind2 == -1 || ind2 == ind1){
        ind2 = Math.floor(Math.random() * 480);
      }
      while (ind3 == -1 || ind3 == ind1 || ind3 == ind2){
        ind3 = Math.floor(Math.random() * 480);
      }
      while (ind4 == -1 || ind4 == ind1 || ind4 == ind2 || ind4 == ind3){
        ind4 = Math.floor(Math.random() * 480);
      }
      let knife: Array<Array<string>> = [[rcs[Math.floor(ind1 / 30) + 1][ind1 % 30], '' + ind1], [rcs[Math.floor(ind2 / 30) + 1][ind2 % 30], '' + ind2], [rcs[Math.floor(ind3 / 30) + 1][ind3 % 30], '' + ind3], [rcs[Math.floor(ind4 / 30) + 1][ind4 % 30], '' + ind4]];
      setPossibleColors(knife);
      return knife;
    }
    return possibleColors;
  }

  if (!gameState) return null;

  for (let i = 0; i < 16; i++) {
    items.push(
      <>
        <div className="hcboard-row">
          <HCRow rowColors={rcs[i + 1]} letter={letters[i]} rowNum={i} images = {images} addPiece = {addPiece} buttonBorderWidth = {buttonBorderWidth} />
        </div>
      </>
    );
  }

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', textAlign: 'center', padding: '10px', fontFamily: 'Courier New, monospace', fontSize: '16px', zIndex: 1000, borderBottom: '2px solid #444', pointerEvents: 'none'}}
      >
        {getInstructions()}
      </div>

      {scoreToast && (
        <div 
          style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2ecc71', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontFamily: 'Impact, sans-serif', fontSize: '24px', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.5)', letterSpacing: '2px'}}
        >
          {scoreToast}
        </div>
      )}
      <TopRightMenus gameState={gameState} activePanel={activePanel} setActivePanel={setActivePanel} buttonBorderWidth={buttonBorderWidth} setButtonBorderWidth={setButtonBorderWidth} />
      {!onBoardScreen && (
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

          {/* bodies */}
          <div className="hc-body" style={{background: color_string_to_background(gameState?.players[1].pieceColor)}} />
          <div className="hc-body2" style={{background: color_string_to_background(gameState?.players[2].pieceColor)}} />
          <div className="hc-body3" style={{background: color_string_to_background(gameState?.players[3].pieceColor)}} />

          {/* heads */}
          <div className="hc-head" style={{background: color_string_to_background(gameState?.players[1].pieceColor)}} />
          <img
            src={gameState.players[1].profileURL || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"}
            style={{position: 'absolute', borderRadius: '50%', width: '80px', height: '80px', right: '57%', transform: 'translate(-100%, -20%)', bottom: '55%', zIndex: 10}}
          />
          
          <div className="hc-head2" style={{background: color_string_to_background(gameState?.players[2].pieceColor)}} />
          <img
            src={gameState.players[2].profileURL || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"}
            style={{position: 'absolute', borderRadius: '50%', width: '80px', height: '80px', left: '50%', transform: 'translate(-50%, -20%)', bottom: '60%', zIndex: 10}}
          />

          <div className="hc-head3" style={{background: color_string_to_background(gameState?.players[3].pieceColor)}} />
          <img
            src={gameState.players[3].profileURL || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"}
            style={{position: 'absolute', borderRadius: '50%', width: '80px', height: '80px', left: '57%', transform: 'translate(100%, -20%)', bottom: '55%', zIndex: 10}}
          />

          {/* player name labels — all offset from true center */}
          <div className="hc-nameTip" style={{ zIndex: 200, position: 'absolute', right: '57%', transform: 'translateX(-50%)', top: '54vh' }}>
            {gameState?.players[1].name}
          </div>
          <div className="hc-nameTip" style={{ zIndex: 200, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '48vh' }}>
            {gameState?.players[2].name}
          </div>
          <div className="hc-nameTip" style={{ zIndex: 200, position: 'absolute', left: '57%', transform: 'translateX(50%)', top: '54vh' }}>
            {gameState?.players[3].name}
          </div>

          <div>
            <div className="hc-tableTop">
              <img src={warpedBoard} className="hc-tableBoard" alt="Game board"/>
              <button type="button" className={`hc-tableButton ${isTableHovered ? "isDeckHovered" : ""}`} onMouseEnter={() => setIsTableHovered(true)} onMouseLeave={() => setIsTableHovered(false)} onClick={viewChanger} aria-label="Open game board" />
            </div>
            <div className="hc-tableLeg" />
            <div className="hc-tableBase" />
          </div>

          {gameState.players[0].secondClue != "" && gameState.players[0].yourTurn && gameState.players[0].isClueGiver && (
            <div className="hc-cardBackground">
            <div style={{fontFamily: 'Impact', fontSize: '36px', color: '#fff', letterSpacing: '2px'}}>HUES & CUES</div>
              <button
                onClick={() => {
                  setAnnouncement(null);
                  setSelectedColor("");
                  setSelectedColorIndex("");
                  socket?.emit("score with 6", connectionNumber);
                }}
                className="hc-cardOption"
                style = {{fontFamily: 'Courier New, monospace'}}
              >End round here</button>
            </div>
          )}

          {gameState.players[0].clue != "" && gameState.players[0].secondClue == "" && gameState.players[0].yourTurn && gameState.players[0].isClueGiver && (
            <div className="hc-cardBackground">
            <div style={{fontFamily: 'Impact', fontSize: '36px', color: '#fff', letterSpacing: '2px'}}>HUES & CUES</div>
              <div style={{fontFamily: 'Courier New, monospace', fontSize: '12px', letterSpacing: '1.5px', color: '#ccc'}}>Your color is...</div>
              <div style={{ height: '80px', width: '100px', borderRadius: '10px', background: selectedColor, boxShadow: `0 0 0 2px #fff, 0 4px 16px rgba(0,0,0,0.6)`, transform: 'scale(1.05)', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '18px', textShadow: '0px 0px 4px rgba(0,0,0,0.8)'}}>
                {indexToGrid(selectedColorIndex)}
              </div>
              <button
                onClick={viewChanger}
                className="hc-cardOption"
                style = {{fontFamily: 'Courier New, monospace'}}
              >View board</button>
              <input type="text" placeholder="Enter your cue!" value={cueText} onChange={e => setCueText(e.target.value)} maxLength={16} minLength={1} className="hc-cardInput" style={{fontFamily: 'Courier New, monospace'}} />
              <button
                onClick={() => {
                  if (validateClue(cueText, true)[0]){
                    showAnnouncement(`${gameState?.players[0].name}'s second hint is ${cueText}`);
                    socket?.emit("second clue submitted", cueText, connectionNumber);
                    setCueText("");
                    setClueErrorMessage("");
                  } else {
                    setClueErrorMessage(validateClue(cueText, true)[1]);
                  }
                }}
                className="hc-cardOption"
                style = {{fontFamily: 'Courier New, monospace'}}
              >Give another clue</button>
              {clueErrorMessage != "" && (
                <div style={{fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '1.5px', color: '#ccc'}}>{clueErrorMessage}</div>
              )}
              <button
                onClick={() => {
                  setAnnouncement(null);
                  setSelectedColor("");
                  setSelectedColorIndex("");
                  socket?.emit("score with 3", connectionNumber);
                }}
                className="hc-cardOption"
                style = {{fontFamily: 'Courier New, monospace'}}
              >End round here</button>
            </div>
          )}

          {cardDrawn && (
            <div className="hc-cardBackground">
              <div style={{fontFamily: 'Impact', fontSize: '36px', color: '#fff', letterSpacing: '2px'}}>HUES & CUES</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 20px', width: '100%', boxSizing: 'border-box' as const}}>
                {chooseCardColors().map(color => (
                  <div
                    key={color[0]}
                    onClick={() => {
                      setSelectedColor(color[0]);
                      setSelectedColorIndex(color[1]);
                    }}
                    style={{ height: '80px', borderRadius: '10px', background: color[0], boxShadow: selectedColor === color[0] ? `0 0 0 3px #fff, 0 4px 16px rgba(0,0,0,0.6)` : '0 4px 16px rgba(0,0,0,0.6)', cursor: 'pointer', transform: selectedColor === color[0] ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Courier New, monospace', fontWeight: 'bold', fontSize: '18px', textShadow: '0px 0px 4px rgba(0,0,0,0.8)'}}
                  >
                    {indexToGrid(color[1])}
                  </div>
                ))}
              </div>
              <input type="text" placeholder="Enter your cue!" value={cueText} onChange={e => setCueText(e.target.value)} maxLength={16} minLength={1} className="hc-cardInput" style={{fontFamily: 'Courier New, monospace'}}/>
              <button
                onClick={() => {
                  if (validateClue(cueText, false)[0]){
                    showAnnouncement(`${gameState?.players[0].name}'s hint is ${cueText}`);
                    setCardDrawn(false);
                    setPossibleColors([["", ""], ["", ""], ["", ""], ["", ""]]);
                    socket?.emit("clue submitted", selectedColorIndex, cueText, connectionNumber);
                    setCueText("");
                    setClueErrorMessage("");
                  } else {
                    setClueErrorMessage(validateClue(cueText, false)[1]);
                  }
                }}
                className="hc-cardOption"
                style = {{fontFamily: 'Courier New, monospace'}}
              >Submit Cue</button>
              {clueErrorMessage != "" && (
                <div style={{fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '1.5px', color: '#ccc'}}>{clueErrorMessage}</div>
              )}
            </div>
          )}

          {/* deck */}
          {gameState.players[0].clue == "" && gameState.players[0].isClueGiver && gameState.players[0].yourTurn && (<button
            type="button"
            className={`hc-deckButton ${isDeckHovered ? "isDeckHovered" : ""}`}
            onMouseEnter={() => setIsDeckHovered(true)}
            onMouseLeave={() => setIsDeckHovered(false)}
            onClick={() => setCardDrawn(prev => !prev)}
            style={{zIndex: '200'}}
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
          </button> )}

          {/* announcement banner */}
          {announcement && (
            <div 
              style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(10,10,14,0.94)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 28px', color: '#fff', fontFamily: 'Courier New, monospace', fontSize: '14px', letterSpacing: '1px', zIndex: 400, whiteSpace: 'nowrap' as const, animation: 'panelIn 0.2s ease'}}
            >
              {announcement}
            </div>
          )}
        </div>
      )} 
      {onBoardScreen && (
        <BoardScreen gameState={gameState} lastPlaced={lastPlaced} setLastPlaced={setLastPlaced} lastPlacedSecondRound={lastPlacedSecondRound} setLastPlacedSecondRound={setLastPlacedSecondRound} viewChanger={viewChanger} socket={socket} connectionNumber={connectionNumber} scoreImages={scoreImages} items={items}/>
      )}
    </>
  );
}