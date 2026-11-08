const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

function askNumber(label) {
  const input = prompt(`Enter ${label}:`);

  if (input === null || input.trim() === '') {
    return null;
  }

  const value = Number(input);
  return Number.isFinite(value) ? value : null;
}

const x1 = askNumber('x1');
const y1 = askNumber('y1');
const x2 = askNumber('x2');
const y2 = askNumber('y2');

if ([x1, y1, x2, y2].includes(null)) {
  show('All four coordinates must be valid numbers');
} else {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  show(`Point 1: (${x1}, ${y1})`);
  show(`Point 2: (${x2}, ${y2})`);
  show(`Distance between the points: ${distance.toFixed(2)}`);
}
