import logo from "../assets/logo.png";
import backButton from "../assets/back_button.png";
import submitButton from "../assets/submit_button.png";
import submitButtonGray from "../assets/submit_button_gray.png";
import type { GameState } from "../types";
import { ScoreRows, TopRow } from "../GridPrep";

interface BoardScreenProps {
    gameState: GameState;
    lastPlaced: number | null;
    setLastPlaced: Function;
    lastPlacedSecondRound: number | null;
    setLastPlacedSecondRound: Function;
    socket;
    connectionNumber: number | null;
    viewChanger;
    scoreImages;
    items;
}

export default function BoardScreen({ gameState, lastPlaced, setLastPlaced, lastPlacedSecondRound, setLastPlacedSecondRound, socket, connectionNumber, viewChanger, scoreImages, items } : BoardScreenProps ){

    function submit(){
        if (gameState.players[0].secondClue == ""){
            socket?.emit("guess submitted", lastPlaced, connectionNumber);
            setLastPlaced(null); // Reset placement so button grays out on next turn
        } else {
            socket?.emit("guess submitted", lastPlacedSecondRound, connectionNumber);
            setLastPlacedSecondRound(null); // Reset placement so button grays out on next turn
        }
    }

    return (
        <>
            <div className="back-button">
            <button style={{width: '11vw', height: '8.3vh', zIndex: '201', left: '2vw', top: '1.5vw', position: 'absolute', backgroundColor: 'transparent'}} onClick = {viewChanger} />
            <img src={backButton} style={{width: '11vw', height: '8.3vh', zIndex: '200', left: '2vw', top: '1.5vw', position: 'absolute'}}/>
            </div>
            <div className="top-section">
            <div className="score-row" style={{position: 'absolute', top: '5.5vh'}}>
                <ScoreRows scoreImages = {scoreImages} />
            </div>
                <img src={logo} style={{position: 'absolute', width: '11vw', height: '19vh', right: '21vw', top: '5.7vh'}}/>
            </div>

            <div className="hcboard" style={{position: 'absolute', top: '5vh'}}>
            <div className="hcboard-row">
                <TopRow lh={'1.3vh'}/>
            </div>
                {items}
            <div className="hcboard-row">
                <TopRow lh="2.5vh" />
            </div>
            </div>

            {gameState?.players[0].yourTurn && !gameState.players[0].isClueGiver && 
            ((gameState?.players[0].secondClue == "" && lastPlaced != null) || 
            (gameState?.players[0].secondClue != "" && lastPlacedSecondRound != null)) && (
            <div className="submit-button">
                <button style={{width: '14vw', height: '6vh', 'zIndex': '201', 'left': '40.7vw', top: '92.6vh', position: 'absolute', 'backgroundColor': 'transparent'}} onClick = {submit} />
                <img src={submitButton} style={{width: '14vw', height: '6vh', 'zIndex': '200', 'left': '40.7vw', top: '92.6vh', position: 'absolute'}}/>
            </div>
            )}

            {(!gameState?.players[0].yourTurn || 
            (gameState?.players[0].yourTurn && !gameState.players[0].isClueGiver && 
            ((gameState?.players[0].secondClue == "" && lastPlaced == null) || 
            (gameState?.players[0].secondClue != "" && lastPlacedSecondRound == null)))) && (
                <img src={submitButtonGray} style={{width: '14vw', height: '6vh', zIndex: '202', left: '40.7vw', top: '92.6vh', position: 'absolute'}} />
            )}
            {gameState?.players[0].clue != "" && (
            <div className="hc-lastClue" style={{position: 'absolute', right: '8vw', top: '40vh'}}>Your clue is: <br /> {gameState?.players[0].clue} </div>
            )}
            {gameState?.players[0].secondClue != "" && (
            <div className="hc-lastClue" style={{position: 'absolute', right: '2.9vw', top: '55vh'}}>Your second clue is: <br /> {gameState?.players[0].secondClue} </div>
            )}
        </>
    );
}