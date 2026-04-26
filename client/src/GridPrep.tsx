
//Creates two rows of grayscale rectangles representing score in the top left
export function ScoreRows(scoreImages){

  let lefts = ["-0.8vw", "1.6vw", "3.6vw", "5.6vw", "7.6vw", "9.6vw", "11.6vw", "13.5vw", "15.5vw", "17.5vw", "19.4vw", "21.5vw", "23.4vw", "25.4vw", "27.4vw", "29.3vw", "31.3vw", "33.3vw", "35.2vw", "37.2vw", "39.2vw", "41.2vw", "43.2vw", "45.2vw", "47.1vw", "49.1vw"];

  const frColors = ["#000000", "#414141", "#424443", "#464646", "#474948", "#4a4c4b", "#4d4d4d", "#4f4f4f", "#525453", "#545655", "#575757", "#595b5a", "#5d5d5d", "#5e605f", "#606261", "#636363", "#676765", "#696969", "#6b6d6c", "#6f6f6f", "#707271", "#737574", "#767676", "#797979", "#7b7d7c", "#7e807f"];
  const frNums = ["", "", "", "", "", "5", "", "", "", "", "10", "", "", "", "", "15", "", "", "", "", "20", "", "", "", "", "25"];
  const firstRow = [];

  const srColors = ["#000000", "#bdbdbd", "#bababa", "#b9b9b9", "#b5b5b5", "#b3b3b3", "#b0b2b1", "#aeaeae", "#acacac", "#a8aaa9", "#a6a6a4", "#a3a3a3", "#a1a19f", "#9ea09f", "#9c9c9c", "#9a9a9a", "#979795", "#959595", "#929290", "#919191", "#8e8e8e", "#8c8c8c", "#878988", "#858786", "#838584", "#808281"];
  const srNums = ["", "50", "", "", "", "", "45", "", "", "", "", "40", "", "", "", "", "35", "", "", "", "", "30", "", "", "", ""];
  const secondRow = [];

  for (let i = 0; i < 26; i++){
    firstRow.push(
      <>
        <div className="hcscorediv" style={{background: frColors[i]}} key={`fr-${i}`}>{frNums[i]}</div>
        <img src={scoreImages.scoreImages[0][i]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "16vh"}}></img>
        <img src={scoreImages.scoreImages[1][i]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "13.8vh"}}></img>
        <img src={scoreImages.scoreImages[2][i]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "11.55vh"}}></img>
        <img src={scoreImages.scoreImages[3][i]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "9.3vh"}}></img>
      </>);
    secondRow.push(
      <>
        <div className="hcscorediv" style={{background: srColors[i], color: '#000000'}} key={`sr-${i}`}>{srNums[i]}</div>
        <img src={scoreImages.scoreImages[0][i + 26]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "6.5vh"}}></img>
        <img src={scoreImages.scoreImages[1][i + 26]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "4.3vh"}}></img>
        <img src={scoreImages.scoreImages[2][i + 26]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "2.05vh"}}></img>
        <img src={scoreImages.scoreImages[3][i + 26]} style={{width: "2.5vw", height: "5.5vh", zIndex: "200", position: "absolute", left: lefts[i], bottom: "-0.2vh"}}></img>
      </>);
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

//Creates top and bottom borders of game board with corresponding number indices.
//Line Height passed in as parameter to allow for numbers to be closer to board than otherwise
export function TopRow({ lh }){

  const items = [];

  for (let i = 1; i < 31; i++) {
    items.push(<div className="hcsquarediv" style={{background: '#000000', lineHeight: lh}} key={`top-${i}`}>{i}</div>);
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
export function HCRow({rowColors, letter, rowNum, images, addPiece, buttonBorderWidth}){

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
            <button onClick={() => addPiece(base + i)} className="hcsquarebutt" style={{background: rowColors[i], border: buttonBorderWidth + 'vw solid #000' }}></button>
            <img src={images[base + i]} style={{width: "2.5vw", height: "auto", zIndex: "200", position: "absolute", left: lefts[i], bottom: "-4vh"}}></img>
          </div>
        </>
      );
    } else {
      items.push(
        <>
          <div style={{position: "relative"}}>
            <button onClick={() => addPiece(base + i)} className="hcsquarebutt" style={{background: rowColors[i], border: buttonBorderWidth + 'vw solid #000'}}></button>
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