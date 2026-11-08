const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

const input = prompt('Enter a positive integer:');

if (input === null || input.trim() === '') {
  show('No number was entered');
} else {
  const number = Number(input);

  if (!Number.isInteger(number) || number <= 0) {
    show('Please enter a positive integer');
  } else {
    let sum = 0;

    for (let i = 1; i <= number; i++) {
      sum += i;
    }

    show(`The sum of natural numbers from 1 to ${number} is ${sum}`);
  }
}
