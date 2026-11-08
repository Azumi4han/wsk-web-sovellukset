const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

const fruits = ['apple', 'banana', 'orange', 'grape', 'kiwi'];

console.log('Fruits:', fruits);
console.log('Length of Fruits:', fruits.length);
console.log('Element at Index 2:', fruits[2]);
console.log('Last Element of Fruits:', fruits[fruits.length - 1]);

show(`Fruits: ${fruits.join(', ')}`);
show(`Length of Fruits: ${fruits.length}`);
show(`Element at Index 2: ${fruits[2]}`);
show(`Last Element of Fruits: ${fruits[fruits.length - 1]}`);

const vegetables = [];
const vegetable1 = prompt('Enter vegetable 1:');
const vegetable2 = prompt('Enter vegetable 2:');
const vegetable3 = prompt('Enter vegetable 3:');

if (
  [vegetable1, vegetable2, vegetable3].some(
    (vegetable) => vegetable === null || vegetable.trim() === ''
  )
) {
  show('All three vegetables are required');
} else {
  vegetables.push(vegetable1.trim(), vegetable2.trim(), vegetable3.trim());

  console.log('Vegetables:', vegetables);
  console.log('Length of Vegetables:', vegetables.length);

  show(`Vegetables: ${vegetables.join(', ')}`);
  show(`Length of Vegetables: ${vegetables.length}`);
}
