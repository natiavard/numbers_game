// Generate random 4-digit secret number
const secretNumber = Array.from({ length: 4 }, () =>
  Math.floor(Math.random() * 10)
).join("");
console.log("Secret:", secretNumber); // For debugging
const pastGuesses = [];

// Main game logic
function checkGuess() {
  const inputs = document.querySelectorAll(".digit-input");
  let guess = "";

  // Collect guess
  inputs.forEach((input) => {
    guess += input.value;
  });

  // Validate guess
  if (guess.length !== 4 || isNaN(guess)) {
    document.getElementById("result").textContent =
      "❌ Please enter a valid 4-digit number.";
    return;
  }

  // Check for duplicate
  if (pastGuesses.includes(guess)) {
    document.getElementById("result").textContent =
      "⚠️ You've already tried this number. Try a new one!";
    // Clear inputs
    inputs.forEach((input) => {
      input.value = "";
    });
    inputs[0].focus();
    return;
  }

  // Store guess
  pastGuesses.push(guess);

  // Clear inputs
  inputs.forEach((input) => {
    input.value = "";
  });

  // Count digits in correct position
  let correctCount = 0;
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secretNumber[i]) {
      correctCount++;
    }
  }

  // Create guess row
  const guessRow = document.createElement("div");
  guessRow.classList.add("guess-row");

  for (let i = 0; i < 4; i++) {
    const tile = document.createElement("div");
    tile.classList.add("row-tile");
    tile.textContent = guess[i];
    guessRow.appendChild(tile);
  }

  // Add result text next to the guess
  const feedback = document.createElement("span");

  if (correctCount === 0) {
    feedback.textContent = `😢 ${correctCount} correct`;
  } else {
    feedback.textContent = `🤗 ${correctCount} correct`;
  }

  feedback.style.marginLeft = "15px";
  feedback.style.fontWeight = "bold";
  feedback.style.alignSelf = "center";
  guessRow.appendChild(feedback);

  // Append row to board
  document.getElementById("guessBoard").appendChild(guessRow);

  // Final win message
  if (correctCount === 4) {
    document.getElementById(
      "result"
    ).textContent = `🎉 Correct! The number was ${secretNumber}`;
  } else {
    document.getElementById("result").textContent = "";
  }

  inputs[0].focus();
}

// Input behavior setup
const digitInputs = document.querySelectorAll(".digit-input");

digitInputs.forEach((input, index) => {
  // Typing a digit
  input.addEventListener("input", (e) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    // Move to next input
    if (index < digitInputs.length - 1) {
      digitInputs[index + 1].focus();
    }
  });

  // Backspace navigation
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      digitInputs[index - 1].focus();
    }
    if (e.key === "Enter") {
      checkGuess();
    }
  });

  // Pasting digits
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "");
    if (pasted.length === 0) return;

    for (let i = 0; i < 4 && i < pasted.length; i++) {
      digitInputs[i].value = pasted[i];
    }

    const nextIndex = Math.min(pasted.length, 3);
    digitInputs[nextIndex].focus();
  });
});
