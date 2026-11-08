const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

function askSide(label) {
  const input = prompt(`Enter the length of side ${label}:`);

  if (input === null || input.trim() === '') {
    return null;
  }

  const value = Number(input);
  return Number.isFinite(value) && value > 0 ? value : null;
}

const sideA = askSide('a');
const sideB = askSide('b');
const sideC = askSide('c');

if ([sideA, sideB, sideC].includes(null)) {
  show('All three sides must be positive numbers');
} else if (!(sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA)) {
  show('These side lengths do not form a triangle');
} else if (sideA === sideB && sideB === sideC) {
  show('The triangle is equilateral: all three sides are equal');
} else if (sideA === sideB || sideB === sideC || sideA === sideC) {
  show('The triangle is isosceles: exactly two sides are equal');
} else {
  show('The triangle is scalene: no sides are equal');
}
