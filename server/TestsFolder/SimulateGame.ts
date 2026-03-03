import { Player } from '../src/Models/Player';
import { GameManager } from '../src/Services/GameManager';
import { ScoringCalc } from '../src/Services/ScoringCalc';

"npx ts-node TestsFolder/simulateGame.ts"

function runSimulation() {
  console.log("=== STARTING HUES & CUES SIMULATION ===");

  // 1. Setup Players
  const p1 = new Player("Alice");
  const p2 = new Player("Bob");
  const p3 = new Player("Charlie");

  // 2. Initialize GameManager with players!
  const gameManager = new GameManager([p1, p2, p3]);

  // 3. Start the Game (This automatically calls startNewRound and creates the TurnManager)
  console.log("\n--- Phase: Game Setup ---");
  gameManager.startGame(); 

  const currentTurn = gameManager.currentTurnManager;
  if (!currentTurn) {
    console.error("Simulation Failed: TurnManager was not created.");
    return;
  }

  const clueGiver = currentTurn.clueGiver;
  console.log(`\nClue Giver for this round is: ${clueGiver.playerName}`);

  // 4. Clue Giver selects a target color
  console.log("\n--- Target Selection ---");
  currentTurn.setTarget(0); 
  console.log(`Target set to coordinate: ${currentTurn.targetOption?.gridCoordinates} (${currentTurn.targetOption?.hexCode})`);

  // 5. First Cue and Guesses
  console.log("\n--- First Cue ---");
  const firstCue = "Ocean";
  if (currentTurn.validateClue(firstCue)) {
    console.log(`${clueGiver.playerName} gives their first cue: "${firstCue}"`);
  }
  
  // Advance state to GUESS_ONE
  currentTurn.resolveRound(); 

  console.log("\n--- First Guesses ---");
  console.log(`${p2.playerName} guesses K-15`);
  currentTurn.receiveGuess(p2, "K-15");

  console.log(`${p3.playerName} guesses J-14`);
  currentTurn.receiveGuess(p3, "J-14");

  // Advance state to CLUE_TWO
  currentTurn.resolveRound(); 

  // 6. Second Cue and Guesses
  console.log("\n--- Second Cue ---");
  const secondCue = "Deep Water";
  if (currentTurn.validateClue(secondCue)) {
    console.log(`${clueGiver.playerName} gives their second cue: "${secondCue}"`);
  }

  // Advance state to GUESS_TWO
  currentTurn.resolveRound();

  console.log("\n--- Second Guesses ---");
  console.log(`${p2.playerName} guesses L-16`);
  currentTurn.receiveGuess(p2, "L-16");

  console.log(`${p3.playerName} guesses K-14`);
  currentTurn.receiveGuess(p3, "K-14");

  // Advance state to SCORING
  currentTurn.resolveRound();

// 7. Resolve the Round & Let TurnManager Calculate Scores
  console.log("\n--- Phase: Resolution & Scoring ---");
  const roundScores = currentTurn.resolveRound(); 
  
  if (roundScores) {
    gameManager.updateTotalScores(roundScores);
  }

  // 8. Print Final Scores
  console.log("\n=== ROUND OVER: SCOREBOARD ===");
  gameManager.players.forEach(player => {
    console.log(`${player.playerName}: ${player.score} points`);
  });
}

runSimulation();