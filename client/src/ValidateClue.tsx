export default function validateClue(cue: string, isSecondTime: boolean) {
    const lowerCue = cue.toLowerCase().trim();

    // Basic forbidden words (Common colors) [cite: 51]
    const forbiddenWords = [
      "red",
      "blue",
      "yellow",
      "green",
      "orange",
      "purple",
      "black",
      "white",
      "brown",
      "pink",
      "grey",
      "gray"

    ];

    if (forbiddenWords.some((word) => lowerCue.includes(word))) {
      return [false, "Cannot use color name in clue."];
    }

    if (lowerCue.length == 0){
      return [false, "Clue cannot be empty."]
    }

    const coordinateRegex = /^[a-pA-P]-?\d{1,2}$/;
    if (coordinateRegex.test(lowerCue)) {
      return [false, "Cannot refer to board position in clue."];
    }

    // Ensure it's strictly a 1-word or 2-word cue based on the phase [cite: 49, 57]
    const wordCount = lowerCue.split(/\s+/).length;
    if (!isSecondTime && wordCount !== 1) {
      return [false, "Clue must be one word."];
    } else if (isSecondTime && wordCount > 2) {
      return [false, "Clue must be two words or less."];
    }

    //this.currentClues.push(cue);
    return [true, ""];
  }