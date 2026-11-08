const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

const input = prompt('Enter your score (0-100):');

if (input === null || input.trim() === '') {
  show('No score was entered');
} else {
  const score = Number(input);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    show('Please enter a score between 0 and 100');
  } else {
    let grade;

    if (score < 40) {
      grade = 0;
    } else if (score < 52) {
      grade = 1;
    } else if (score < 64) {
      grade = 2;
    } else if (score < 76) {
      grade = 3;
    } else if (score < 88) {
      grade = 4;
    } else {
      grade = 5;
    }

    show(`Score: ${score}`);
    show(`Grade: ${grade}`);
  }
}
