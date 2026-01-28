const display = document.getElementById("display");

let current = "0";
let previous = null;
let operator = null;
let shouldResetCurrent = false;
let operationHistory = ""; // To store the full operation

function updateDisplay() {
  display.textContent = operationHistory || current; // Show the operation history or the current value
}

function inputNumber(n) {
  if (shouldResetCurrent) {
    current = n;
    shouldResetCurrent = false;
  } else {
    current = current === "0" ? n : current + n;
  }
  operationHistory += n; // Append the number to the operation history
  updateDisplay();
}

function inputDot() {
  if (shouldResetCurrent) {
    current = "0.";
    shouldResetCurrent = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  operationHistory += "."; // Append the dot to the operation history
  updateDisplay();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  shouldResetCurrent = false;
  operationHistory = ""; // Clear the operation history
  updateDisplay();
}

function backspace() {
  if (shouldResetCurrent) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  operationHistory = operationHistory.slice(0, -1); // Remove the last character from the operation history
  updateDisplay();
}

function compute(a, op, b) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return "0";

  switch (op) {
    case "+": return String(x + y);
    case "-": return String(x - y);
    case "*": return String(x * y);
    case "/": return y === 0 ? "Error" : String(x / y);
    default: return String(y);
  }
}

function chooseOperator(op) {
  if (operator && previous !== null && !shouldResetCurrent) {
    current = compute(previous, operator, current);
    previous = current === "Error" ? null : current;
  } else {
    previous = current;
  }
  operator = op;
  shouldResetCurrent = true;
  operationHistory += ` ${op} `; // Append the operator to the operation history
  updateDisplay();
}

function equals() {
  if (operator === null || previous === null) return;
  current = compute(previous, operator, current);
  operationHistory += ` = ${current}`; // Append the result to the operation history
  operator = null;
  previous = null;
  shouldResetCurrent = true;
  updateDisplay();
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === "num") inputNumber(value);
  if (action === "dot") inputDot();
  if (action === "clear") clearAll();
  if (action === "back") backspace();
  if (action === "op") chooseOperator(value);
  if (action === "equals") equals();
});

updateDisplay();