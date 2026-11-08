const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

function sortArray(numbers, order) {
  const sorted = [...numbers];

  if (order === 'asc') {
    return sorted.sort((a, b) => a - b);
  }

  if (order === 'desc') {
    return sorted.sort((a, b) => b - a);
  }

  throw new Error('Order must be either "asc" or "desc"');
}

const numbers = [5, 2, 8, 1, 9];
const extraNumbers = [42, 7, 19, 3];

console.log('Original numbers:', numbers);
console.log('Ascending:', sortArray(numbers, 'asc'));
console.log('Descending:', sortArray(numbers, 'desc'));
console.log('Extra ascending:', sortArray(extraNumbers, 'asc'));
console.log('Extra descending:', sortArray(extraNumbers, 'desc'));

show(`Original array: [${numbers.join(', ')}]`);
show(`Ascending: [${sortArray(numbers, 'asc').join(', ')}]`);
show(`Descending: [${sortArray(numbers, 'desc').join(', ')}]`);
show(`Original array after sorting: [${numbers.join(', ')}]`);
show(`Second array ascending: [${sortArray(extraNumbers, 'asc').join(', ')}]`);
show(`Second array descending: [${sortArray(extraNumbers, 'desc').join(', ')}]`);
