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

const number1 = askNumber('number 1');
const number2 = askNumber('number 2');
const number3 = askNumber('number 3');
const number4 = askNumber('number 4');
const number5 = askNumber('number 5');
const numbers = [];

if ([number1, number2, number3, number4, number5].includes(null)) {
  show('Please enter five valid numbers');
} else {
  numbers.push(number1, number2, number3, number4, number5);
  show(`Numbers: ${numbers.join(', ')}`);

  const searchInput = prompt('Enter a number to search:');

  if (searchInput === null || searchInput.trim() === '') {
    show('No search number was entered');
  } else {
    const searchNumber = Number(searchInput);

    if (!Number.isFinite(searchNumber)) {
      show('Please enter a valid number to search');
    } else {
      const found = numbers.includes(searchNumber);
      show(
        found
          ? `Number ${searchNumber} is found in the array`
          : `Number ${searchNumber} is not found in the array`
      );

      numbers.pop();
      show(`Updated Numbers: ${numbers.join(', ')}`);

      numbers.sort((a, b) => a - b);
      show(`Sorted Numbers: ${numbers.join(', ')}`);
    }
  }
}
