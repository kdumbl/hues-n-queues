import "./BoardScreen.css";
import { useState, useEffect } from 'react';
import logo from "./assets/logo.png";
import red_piece from "./assets/pieces/red_piece.png";
import yellow_piece from "./assets/pieces/yellow_piece.png";
import green_piece from "./assets/pieces/green_piece.png";
import blue_piece from "./assets/pieces/blue_piece.png";
import back_button from "./assets/back_button.png";
import submit_button from "./assets/submit_button.png";
import trans_piece from "./assets/pieces/transparent_piece.png";
import submitted from "./assets/submitted.png";
import { Socket } from "socket.io-client";
import type { GameState } from "./types";

//heres what we are inheriting from the app.tsx file
interface Props {
  socket: Socket| null;
  gameState: GameState | undefined;
  switchView: (v:"board" | "game") => void;
  images,
  set_images,
}

//Creates two rows of grayscale rectangles representing score in the top left
function ScoreRows(){

  const fr_colors = ["#000000", "#414141", "#424443", "#464646", "#474948", "#4a4c4b", "#4d4d4d", "#4f4f4f", "#525453", "#545655", "#575757", "#595b5a", "#5d5d5d", "#5e605f", "#606261", "#636363", "#676765", "#696969", "#6b6d6c", "#6f6f6f", "#707271", "#737574", "#767676", "#797979", "#7b7d7c", "#7e807f"];
  const fr_nums = ["", "", "", "", "", "5", "", "", "", "", "10", "", "", "", "", "15", "", "", "", "", "20", "", "", "", "", "25"];
  const first_row = [];

  const sr_colors = ["#000000", "#bdbdbd", "#bababa", "#b9b9b9", "#b5b5b5", "#b3b3b3", "#b0b2b1", "#aeaeae", "#acacac", "#a8aaa9", "#a6a6a4", "#a3a3a3", "#a1a19f", "#9ea09f", "#9c9c9c", "#9a9a9a", "#979795", "#959595", "#929290", "#919191", "#8e8e8e", "#8c8c8c", "#878988", "#858786", "#838584", "#808281"];
  const sr_nums = ["", "50", "", "", "", "", "45", "", "", "", "", "40", "", "", "", "", "35", "", "", "", "", "30", "", "", "", ""];
  const second_row = [];

  for (let i = 0; i < 26; i++){
    first_row.push(<div className="hcscorediv" style={{background: fr_colors[i]}}>{fr_nums[i]}</div>);
    second_row.push(<div className="hcscorediv" style={{background: sr_colors[i], color: '#000000'}}>{sr_nums[i]}</div>)
  }

  return (
    <>
      <div className="hcboard-row">
        {first_row}
      </div>
      <div className="hcboard-row">
        {second_row}
      </div>
    </>
  );
}

//Creates top and bottom borders of game board with corresponding number indices.
//Line Height passed in as parameter to allow for numbers to be closer to board than otherwise
function TopRow({ lh }){

  const items = [];

  for (let i = 1; i < 31; i++) {
    items.push(<div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>{i}</div>);
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
function HCRow({row_colors, letter, row_num, images, add_piece}){

  //Value for easier indexing of array
  let base = row_num * 30;
  let lefts = ["1.7vw", "3.7vw", "5.7vw", "7.6vw", "9.6vw", "11.6vw", "13.5vw", "15.5vw", "17.5vw", "19.4vw", "21.4vw", "23.4vw", "25.4vw", "27.3vw", "29.3vw", "31.3vw", "33.2vw", "35.2vw", "37.2vw", "39.2vw", "41.2vw", "43.1vw", "45.1vw", "47.1vw", "49vw", "51vw", "53vw", "55vw", "56.9vw", "58.9vw"];

  const items = [];

  //For each column, defines a game space (hcsquarebutt class) whose color corresponds with the row_colors array
  //Additionally defines an image, initially null, that sits a layer above the space, to be filled in with a game piece if necessary
  for (let i = 0; i < 30; i++) {
    items.push(
      <>
        <div style={{position: "relative"}}>
          <button onClick={() => add_piece(base + i)} className="hcsquarebutt" style={{background: row_colors[i]}}></button>
          <img src={images[base + i]} style={{width: "2.5vw", height: "auto", "z-index": "200", position: "absolute", left: lefts[i], bottom: "-4vh"}}></img>
        </div>
      </>
    );
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
export default function BoardScreen({socket, gameState, switchView, images, set_images}: Props) {

  const items = [];
  const [submit_vis, set_submit_vis] = useState(false);
  const [submitted_vis, set_submitted_vis] = useState(false);
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
  const [counter, set_counter] = useState(0);
  const [last_placed, set_last_placed] = useState(null);

  //Defines the colors of each space on the gameboard, as well as the top and bottom rows with the displayed number indices
  let rcs = [["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
             ["#612b0f", "#6b2710", "#752214", "#821f19", "#941e1e", "#9e1b20", "#af1e23", "#c62127", "#de1f26", "#eb1c24", "#ec1d23", "#ec1d25", "#ec1b2e", "#ed1a3b", "#ec1946", "#e91754", "#e51465", "#e21075", "#d80f83", "#d4148d", "#c82791", "#bb2d91", "#b33394", "#a83594", "#9f3894", "#933895", "#8c3d98", "#833d96", "#7d3e99", "#73419a"], 
             ["#884b1f", "#94441f", "#9c3f20", "#ad3f24", "#b93825", "#c62d27", "#d62827", "#e42024", "#eb2325", "#ec282a", "#ee2932", "#ee2932", "#ed2041", "#eb204d", "#ed1c5e", "#ec166e", "#ed0f7c", "#e90c8d", "#db2a92", "#cd3894", "#bf3e98", "#b43d97", "#a93c97", "#9e3e97", "#963d97", "#8d3d96", "#843e97", "#7d3e99", "#723d97", "#683b96"],
             ["#a66128", "#ac5b26", "#ba5a27", "#c24e27", "#cd4827", "#d64027", "#e23926", "#e83024", "#ee362c", "#ef3c40", "#ef3f4c", "#ee3b51", "#ee3a5d", "#ee3167", "#ee3078", "#ee2b87", "#eb3196", "#db4398", "#ca499b", "#bb4b9d", "#b4499b", "#a64799", "#9e4599", "#954398", "#8c4299", "#843e97", "#793d97", "#733c97", "#663996", "#5a3191"],
             ["#c9822a", "#d78228", "#dd7627", "#e87824", "#e66926", "#ea5d25", "#f1602b", "#ef5533", "#f04f3d", "#ef5651", "#f05d65", "#f05e6b", "#ee5871", "#f0537e", "#ef4f8b", "#f04f9d", "#df55a0", "#cd57a1", "#be5ea5", "#b658a2", "#a554a1", "#9b4e9e", "#944c9e", "#8d499e", "#82449a", "#7b4198", "#6f3e99", "#663795", "#583393", "#472e8a"],
             ["#e69c23", "#f1991e", "#f7921c", "#f68c1e", "#f68525", "#f4782e", "#f4773d", "#f36e45", "#f37052", "#f27767", "#f37674", "#f37781", "#f27789", "#f27094", "#f069a4", "#e76fac", "#d371ac", "#c771ae", "#bb71ae", "#ac67aa", "#9e5fa6", "#9359a5", "#8d54a3", "#8451a0", "#7a489d", "#6f459b", "#623e98", "#583393", "#492e8f", "#342b84"],
             ["#feb415", "#fcb122", "#faab2c", "#fbab3a", "#faa741", "#f9a34c", "#f69755", "#f58f5e", "#f48864", "#f58873", "#f58f83", "#f38f8f", "#f48e99", "#f48ca3", "#f287b5", "#e08dbb", "#d18bbd", "#c68cbe", "#b982b9", "#aa7ab6", "#9c74b3", "#9067ab", "#865ea7", "#7b59a6", "#7251a2", "#634a9e", "#5a429a", "#4c3293", "#392f8f", "#2c2978"],
             ["#fdc113", "#fdc029", "#fcb72c", "#fcb43b", "#fcb95e", "#f8ac56", "#faaa63", "#f9a26d", "#f7a279", "#f7a085", "#f69e94", "#f69d99", "#f59ea6", "#f69baa", "#f39dc2", "#e1a5cb", "#d0a6cc", "#cdadd2", "#b898c7", "#a88bc1", "#9a82bc", "#9a82bc", "#7f6eb2", "#7265ad", "#675ca8", "#5954a4", "#4f4ba0", "#44419a", "#313694", "#2b2f86"],
             ["#fcd017", "#fecd2a", "#ffc82f", "#fdc740", "#fec64b", "#fdbf58", "#fdbc60", "#fcb96b", "#fbb379", "#fab083", "#f9ae8e", "#f9b29e", "#f5b6ad", "#f3b6b5", "#ecb5c8", "#d8b7d6", "#cdb8d9", "#ccbddc", "#b4a9d3", "#a79fce", "#9794c9", "#8388c2", "#757dbc", "#6a75b7", "#5c6ab1", "#5161ae", "#4859a7", "#3e4fa1", "#2f449d", "#253a97"],
             ["#fce118", "#fcdc27", "#fcd933", "#fcd842", "#fcde4c", "#fed859", "#fddb60", "#fbd66b", "#f5db7c", "#f1e092", "#ecdc9e", "#e8e1b3", "#e1e0c2", "#dce1cb", "#d2e0d3", "#c6dde3", "#c1d9f1", "#c0d8f0", "#a7c8e9", "#99b9e0", "#8aaad9", "#7aa2d6", "#7093cb", "#6686c3", "#5679bb", "#4c6cb5", "#4262ad", "#3b5ba8", "#334fa2", "#27459d"],
             ["#f9ec24", "#f9eb2a", "#faeb36", "#f9ee46", "#f9f04d", "#f9f25c", "#f7f06b", "#efee82", "#e7eb8c", "#dee99d", "#d8e7ac", "#d3e8bf", "#d1e8cb", "#cde9d3", "#c7e6d6", "#bbe5e4", "#b3e2f2", "#b2e2f6", "#9edcf5", "#87d6f7", "#7dc7ee", "#71b5e4", "#65a8dc", "#5c97d1", "#518bca", "#4b7cbf", "#3f6eb6", "#3765b0", "#365bab", "#3050a3"],
             ["#f6ef3c", "#f6ef3f", "#f5ee46", "#f4ef4d", "#f1ec5a", "#ecec68", "#e6e87a", "#dfe784", "#d6e485", "#c8df8d", "#bedd97", "#b5dba2", "#b4dbaf", "#b0dab6", "#addbc1", "#aeddd7", "#aaddde", "#a8dde3", "#99d8e7", "#89d7ee", "#73d1f5", "#64cbf4", "#5aaadd", "#549dd4", "#4889c9", "#4889c9", "#3e7dc0", "#3b6fb8", "#3664af", "#335cab"],
             ["#f1ec21", "#f0eb2d", "#ebe932", "#e9e838", "#e5e643", "#dce453", "#d0df60", "#bfda67", "#b1d66d", "#a8d377", "#9fd07e", "#98d089", "#92ce98", "#8dcd9b", "#8ecfa7", "#8dcfb3", "#8ed1c0", "#8bd1c6", "#84cfcb", "#7acdd5", "#69cada", "#56c8e0", "#3bc6ef", "#38baec", "#3ca9e1", "#3b9ad4", "#4188c8", "#3879bd", "#3b6fb8", "#3465b1"],
             ["#e0e320", "#dbe127", "#d6e12f", "#cfdf37", "#c8db43", "#bad645", "#aed24c", "#9fcd51", "#90c958", "#85c65e", "#79c469", "#71c371", "#70c27a", "#6dc183", "#6dc183", "#70c493", "#70c59c", "#73c7a6", "#75c8ac", "#6bc6b4", "#60c6bb", "#54c4c5", "#47c3cf", "#30c2db", "#1bbae4", "#21aae1", "#289cd7", "#378ccc", "#317fc1", "#2c72b8"],
             ["#c2d82d", "#bdd630", "#b5d333", "#abcf39", "#a0cc39", "#94c93d", "#81c240", "#79c143", "#6dbc45", "#5db545", "#54b34b", "#4db254", "#46b859", "#49b869", "#50bb73", "#57bd7b", "#59bd7d", "#5cbf88", "#5fc08b", "#60c092", "#5bc09e", "#50c2ab", "#46c0b3", "#38bfc3", "#27bfcd", "#16b9d8", "#10aede", "#16a5dd", "#2395d3", "#2884c7"],
             ["#9ec439", "#9ac43c", "#94c23c", "#88bf40", "#7ebb42", "#6db343", "#63b144", "#54a846", "#4fa647", "#409e46", "#359d48", "#30a348", "#2aaa4b", "#2ab14b", "#31b454", "#37b65d", "#42b864", "#48b86e", "#48ba72", "#51bc76", "#52bd85", "#49bd90", "#45be9f", "#39bea9", "#2ebdb7", "#28bfc6", "#1bbdd2", "#0eb3d3", "#0ea8da", "#179fdb"],
             ["#7ba541", "#76a940", "#6fa744", "#65a243", "#59a445", "#4c9f45", "#439845", "#399645", "#299144", "#1e8943", "#198b43", "#149145", "#159a47", "#18a149", "#1bab4a", "#22b04c", "#2cb34c", "#33b555", "#3ab65e", "#3eb865", "#3fb970", "#39b97c", "#32ba8a", "#2cb996", "#21bba1", "#1cbaac", "#18bcbd", "#14bcc7", "#10b7d7", "#0fb1e2"],
             ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"]];

  //Called when a game space is clicked
    //Advances the counter variable (initially 0) and sets the space's index in the images array to the corresponding colored piece
    //Currently cycles between red, yellow, green, and blue in lieu of turn order being controlled by backend
  function add_piece(i) {

    let next_images = images.slice();

    if (last_placed == null){
      next_images[i] = red_piece;
      set_last_placed(i);
    } else {
      next_images[last_placed] = null;
      next_images[i] = red_piece;
      set_last_placed(i);
    }
    //const next_counter = counter + 1;

    /**
    set_counter(next_counter);
    if (next_counter == 1){
      next_images[i] = red_piece;
    }
    if (next_counter == 2){
      next_images[i] = yellow_piece;
    }
    if (next_counter == 3){
      next_images[i] = green_piece;
    }
    if (next_counter == 4){
      next_images[i] = blue_piece;
      set_counter(0);
    } **/

    set_submit_vis(true);
    
    set_images(next_images);
  }

  function submit(){
    const locked = images.slice();
    for (let i = 0; i < 480; i++){
      if (locked[i] == null){
        locked[i] = trans_piece;
      }
    }
    set_images(locked);
    set_submitted_vis(true);

    //note that because socket may be null we add the ?
    socket?.emit('update_piece', locked);
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
          <HCRow row_colors={rcs[i + 1]} letter={letters[i]} row_num={i} images = {images} add_piece = {add_piece} />
        </div>
      </>
    );
  }

  //Creates full screen by showing score rows, then logo in top right, then the game board, which is made up of 16 main rows sandwiched between graph indices
  return (
    <>
      <div className="back-button">
        <button style={{width: '11vw', height: '8.3vh', 'z-index': '201', 'left': '2vw', top: '1.5vw', position: 'absolute', 'background-color': 'transparent'}} onClick = {viewChanger} />
        <img src={back_button} style={{width: '11vw', height: '8.3vh', 'z-index': '200', 'left': '2vw', top: '1.5vw', position: 'absolute'}}/>
      </div>
      <div className="top-section">
        <div className="score-row">
          <ScoreRows />
        </div>
        {/* added the switch view func to the logo*/}
        <img src={logo} style={{width: '11vw', height: '19vh', 'margin-top': '0.37vh', 'margin-left': '0.1vw'}}/>
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
      {submit_vis && (
        <>
          <div className="submit-button">
            <button style={{width: '15vw', height: '6.4vh', 'z-index': '201', 'left': '40.2vw', top: '92vh', position: 'absolute', 'background-color': 'transparent'}} onClick = {submit} />
            <img src={submit_button} style={{width: '15vw', height: 'auto', 'z-index': '200', 'left': '40.2vw', top: '92vh', position: 'absolute'}}/>
          </div>
        </>
      )}
      {submitted_vis && (
        <img src={submitted} style={{width: '15vw', height: 'auto', 'z-index': '202', 'left': '40.2vw', top: '92vh', position: 'absolute'}}/>
      )}
    </>
  );
}
