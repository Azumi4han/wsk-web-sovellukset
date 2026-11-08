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
  const size = Number(input);

  if (!Number.isInteger(size) || size <= 0) {
    show('Please enter a positive integer');
  } else {
    show(`Multiplication table up to ${size}:`);

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = `Products from 1 to ${size}`;
    table.appendChild(caption);

    const tbody = document.createElement('tbody');

    for (let row = 1; row <= size; row++) {
      const tableRow = document.createElement('tr');

      for (let column = 1; column <= size; column++) {
        const cell = document.createElement('td');
        cell.textContent = String(row * column);
        tableRow.appendChild(cell);
      }

      tbody.appendChild(tableRow);
    }

    table.appendChild(tbody);
    output.appendChild(table);
  }
}
