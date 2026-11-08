const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

const numbers = [];

while (true) {
  const input = prompt("Enter a number (or 'done' to finish):");

  if (input === null) {
    break;
  }

  const value = input.trim();

  if (value.toLowerCase() === 'done') {
    break;
  }

  const number = Number(value);

  if (value === '' || !Number.isFinite(number)) {
    show(`"${value}" is not a valid number`);
    continue;
  }

  numbers.push(number);
}

const evenNumbers = [];

for (const number of numbers) {
  if (number % 2 === 0) {
    evenNumbers.push(number);
  }
}

show(`Numbers entered: ${numbers.join(', ')}`);
show(
  `Even Numbers: ${evenNumbers.length > 0 ? evenNumbers.join(', ') : 'None'}`
);
show('Program finished');
