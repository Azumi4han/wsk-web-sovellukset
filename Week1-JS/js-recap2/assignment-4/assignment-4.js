const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

function sortArray(numbers) {
  return [...numbers].sort((a, b) => a - b);
}

const originalArray = [5, 2, 8, 1, 9];
const sortedArray = sortArray(originalArray);

console.log('Original array:', originalArray);
console.log('Sorted array:', sortedArray);

show(`Original array: [${originalArray.join(', ')}]`);
show(`Sorted array: [${sortedArray.join(', ')}]`);
