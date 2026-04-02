import "./BoardScreen.css";
import { useState, useEffect } from 'react';
import logo from "./assets/logo.png";
import redPiece from "./assets/pieces/red_piece.png";
import yellowPiece from "./assets/pieces/yellow_piece.png";
import greenPiece from "./assets/pieces/green_piece.png";
import bluePiece from "./assets/pieces/blue_piece.png";
import backButton from "./assets/back_button.png";
import submitButton from "./assets/submit_button.png";
import submitButtonGray from "./assets/submit_button_gray.png";
import transPiece from "./assets/pieces/transparent_piece.png";
import submitted from "./assets/submitted.png";
import { rcs } from "./ColorPalettes";
import { Socket } from "socket.io-client";
import type { GameState } from "./types";

//heres what we are inheriting from the app.tsx file
interface Props {
  socket: Socket| null;
  gameState: GameState | undefined;
  switchView: (v:"board" | "game") => void;
  connectionNumber: number | null;
}

//Creates two rows of grayscale rectangles representing score in the top left
function ScoreRows(){

  const frColors = ["#000000", "#414141", "#424443", "#464646", "#474948", "#4a4c4b", "#4d4d4d", "#4f4f4f", "#525453", "#545655", "#575757", "#595b5a", "#5d5d5d", "#5e605f", "#606261", "#636363", "#676765", "#696969", "#6b6d6c", "#6f6f6f", "#707271", "#737574", "#767676", "#797979", "#7b7d7c", "#7e807f"];
  const frNums = ["", "", "", "", "", "5", "", "", "", "", "10", "", "", "", "", "15", "", "", "", "", "20", "", "", "", "", "25"];
  const firstRow = [];

  const srColors = ["#000000", "#bdbdbd", "#bababa", "#b9b9b9", "#b5b5b5", "#b3b3b3", "#b0b2b1", "#aeaeae", "#acacac", "#a8aaa9", "#a6a6a4", "#a3a3a3", "#a1a19f", "#9ea09f", "#9c9c9c", "#9a9a9a", "#979795", "#959595", "#929290", "#919191", "#8e8e8e", "#8c8c8c", "#878988", "#858786", "#838584", "#808281"];
  const srNums = ["", "50", "", "", "", "", "45", "", "", "", "", "40", "", "", "", "", "35", "", "", "", "", "30", "", "", "", ""];
  const secondRow = [];

  for (let i = 0; i < 26; i++){
    firstRow.push(<div className="hcscorediv" style={{background: frColors[i]}}>{frNums[i]}</div>);
    secondRow.push(<div className="hcscorediv" style={{background: srColors[i], color: '#000000'}}>{srNums[i]}</div>)
  }

  return (
    <>
      <div className="hcboard-row">
        {firstRow}
      </div>
      <div className="hcboard-row">
        {secondRow}
      </div>
    </>
  );
}

//Converts String versions of color from gameState into image addresses of that color of piece
function colorStringToPiece(colorString){
  if (colorString == "RED"){
    return redPiece;
  } else if (colorString == "YELLOW"){
    return yellowPiece;
  } else if (colorString == "GREEN"){
    return greenPiece;
  } else {
    return bluePiece;
  }
}

//Generates layout of pieces from gameState
function createImages(gameState){
  let images = [];
  if (gameState.players[0].yourTurn && !gameState.players[0].isClueGiver){
    images = Array(480).fill(null);
  } else {
    images = Array(480).fill(transPiece);
  }
  for (let i = 0; i < 4; i++){
    if (gameState.players[i].piece != null){
      images[gameState.players[i].piece.y * 30 + gameState.players[i].piece.x] = colorStringToPiece(gameState.players[i].pieceColor);
    }
    if (gameState.players[i].secondPiece != null){
      images[gameState.players[i].secondPiece.y * 30 + gameState.players[i].secondPiece.x] = colorStringToPiece(gameState.players[i].pieceColor);
    }
  }
  return images;
}

//Creates top and bottom borders of game board with corresponding number indices.
//Line Height passed in as parameter to allow for numbers to be closer to board than otherwise
function TopRow({ lh }){

  const items = [];

  for (let i = 1; i < 31; i++) {
    items.push(<div className="hcsquarediv" style={{background: '#000000', lineHeight: lh}}>{i}</div>);
  }

  return (
    <>
      <div className="hcsquarediv" style={{background: '#000000'}}></div>
      {items}
      <div className="hcsquarediv" style={{background: '#000000'}}></div>
    </>
  );
}

//Creates a normal row of the game board
//row_colors is an array of the 30 color values, left->right, that will be present in the row
//letter is the row index as a letter between A and P, which appears on the left and right side of the main board
//row_num is the index of the row as a number, with 0 being the topmost and 15 being the bottom-most
//images is an array representing whether each space is occupied by a game piece and if so, which color it is
  //Functionally, each element in the array is an image url that is assigned to the source field of an otherwise empty image object over each space
//add_piece is the function that is called when a space is clicked, defined in HCBoard
function HCRow({rowColors, letter, rowNum, images, addPiece}){

  //Value for easier indexing of array
  let base = rowNum * 30;
  let lefts = ["1.7vw", "3.7vw", "5.7vw", "7.6vw", "9.6vw", "11.6vw", "13.5vw", "15.5vw", "17.5vw", "19.4vw", "21.5vw", "23.4vw", "25.4vw", "27.4vw", "29.3vw", "31.3vw", "33.3vw", "35.2vw", "37.2vw", "39.2vw", "41.2vw", "43.2vw", "45.2vw", "47.1vw", "49.1vw", "51.1vw", "53vw", "55vw", "57vw", "58.9vw"];

  const items = [];

  //For each column, defines a game space (hcsquarebutt class) whose color corresponds with the row_colors array
  //Additionally defines an image, initially null, that sits a layer above the space, to be filled in with a game piece if necessary
  for (let i = 0; i < 30; i++) {
    if (images[base + i] == null){
      items.push(
        <>
          <div style={{position: "relative"}}>
            <button onClick={() => addPiece(base + i)} className="hcsquarebutt" style={{background: rowColors[i]}}></button>
            <img src={images[base + i]} style={{width: "2.5vw", height: "auto", zIndex: "200", position: "absolute", left: lefts[i], bottom: "-4vh"}}></img>
          </div>
        </>
      );
    } else {
      items.push(
        <>
          <div style={{position: "relative"}}>
            <button onClick={() => addPiece(base + i)} className="hcsquarebutt" style={{background: rowColors[i]}}></button>
            <img src={images[base + i]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "-4vh"}}></img>
          </div>
        </>
      );
    }
  }
  
  return (
    <>
      <div className="hcsquarediv" style={{background: '#000000'}}>{letter}</div>
      {items}
      <div className="hcsquarediv" style={{background: '#000000'}}>{letter}</div>
    </>
  );
}


//notice that this now takes in parameters: These are the passed in props
export default function BoardScreen({socket, gameState, switchView, connectionNumber}: Props) {

  const items = [];
  const [submittedVis, setSubmittedVis] = useState(false);
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
  const [lastPlaced, setLastPlaced] = useState(null);
  const [images, setImages] = useState(createImages(gameState));

  //Called when a game space is clicked
  function addPiece(i) {
    let tempImages = images.slice();
    if (lastPlaced != null){
      tempImages[lastPlaced] = null;
    }
    setLastPlaced(i);
    tempImages[i] = colorStringToPiece(gameState?.players[0].pieceColor);
    setImages(tempImages);
  }

  function submit(){
    setSubmittedVis(true);
    socket?.emit("guess_submitted", lastPlaced, connectionNumber);
  }

  //add the switch view functionality
  const viewChanger = () =>{
    //this call that setView func defined in app.tsx
    switchView("game");
    console.log("Switch View!")
  }

  for (let i = 0; i < 16; i++) {
    items.push(
      <>
        <div className="hcboard-row">
          <HCRow rowColors={rcs[i + 1]} letter={letters[i]} rowNum={i} images = {images} addPiece = {addPiece} />
        </div>
      </>
    );
  }

  //Creates full screen by showing score rows, then logo in top right, then the game board, which is made up of 16 main rows sandwiched between graph indices
  return (
    <>
      <div className="back-button">
        <button style={{width: '11vw', height: '8.3vh', zIndex: '201', left: '2vw', top: '1.5vw', position: 'absolute', backgroundColor: 'transparent'}} onClick = {viewChanger} />
        <img src={backButton} style={{width: '11vw', height: '8.3vh', zIndex: '200', left: '2vw', top: '1.5vw', position: 'absolute'}}/>
      </div>
      <div className="top-section">
        <div className="score-row">
          <ScoreRows />
        </div>
        {/* added the switch view func to the logo*/}
        <img src={logo} style={{width: '11vw', height: '19vh', marginTop: '0.37vh', marginLeft: '0.1vw'}}/>
      </div>

      <div className="hcboard">
        <div className="hcboard-row">
          <TopRow lh={'1.3vh'}/>
        </div>
        {items}
        <div className="hcboard-row">
          <TopRow lh="2.5vh" />
        </div>
      </div>
      {gameState?.players[0].yourTurn && !gameState.players[0].isClueGiver && (
        <>
          <div className="submit-button">
            <button style={{width: '15vw', height: '6.4vh', 'zIndex': '201', 'left': '40.2vw', top: '92vh', position: 'absolute', 'backgroundColor': 'transparent'}} onClick = {submit} />
            <img src={submitButton} style={{width: '15vw', height: '6.4vh', 'zIndex': '200', 'left': '40.2vw', top: '92vh', position: 'absolute'}}/>
          </div>
        </>
      )}
      {submittedVis && (
          <img src={submitted} style={{width: '15vw', height: '6.4vh', zIndex: '203', left: '40.2vw', top: '92vh', position: 'absolute'}}/>
      )}
      {!gameState?.players[0].yourTurn && (
          <img src={submitButtonGray} style={{width: '15vw', height: '6.4vh', zIndex: '202', left: '40.2vw', top: '92vh', position: 'absolute'}} />
      )}
      {gameState?.players[0].clue != "" && (
        <div className="hc-lastClue" style={{position: 'absolute', right: '8vw', top: '40vh'}}>Your clue is: <br /> {gameState?.players[0].clue} </div>
      )}
    </>
  );
}
