import redPiece from "./assets/pieces/red_piece.png";
import yellowPiece from "./assets/pieces/yellow_piece.png";
import greenPiece from "./assets/pieces/green_piece.png";
import bluePiece from "./assets/pieces/blue_piece.png";
import transPiece from "./assets/pieces/transparent_piece.png";


function scoreToIndex(score){
  if (score <= 25){
    return score;
  } else {
    return Math.round(77 - score);
  }
}

export function colorStringToPiece(colorString){
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

export function createScoreImages(gameState){
  let images = []
  let redImages = Array(52).fill(transPiece);
  let yellowImages = Array(52).fill(transPiece);
  let greenImages = Array(52).fill(transPiece);
  let blueImages = Array(52).fill(transPiece);

  for (let i = 0; i < 4; i++){
    if (gameState.players[i].pieceColor == "RED"){
      redImages[scoreToIndex(gameState.players[i].score)] = redPiece;
    }
    if (gameState.players[i].pieceColor == "YELLOW"){
      yellowImages[scoreToIndex(gameState.players[i].score)] = yellowPiece;
    }
    if (gameState.players[i].pieceColor == "GREEN"){
      greenImages[scoreToIndex(gameState.players[i].score)] = greenPiece;
    }
    if (gameState.players[i].pieceColor == "BLUE"){
      blueImages[scoreToIndex(gameState.players[i].score)] = bluePiece;
    }
  }

  images = [redImages, yellowImages, greenImages, blueImages]

  return images;
}

//Generates layout of pieces from gameState
export function createImages(gameState){
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