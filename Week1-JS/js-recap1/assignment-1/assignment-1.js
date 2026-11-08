const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

const input = prompt('Enter a temperature in Celsius:');

if (input === null || input.trim() === '') {
  show('No temperature was entered');
} else {
  const celsius = Number(input);

  if (!Number.isFinite(celsius)) {
    show('Please enter a valid number');
  } else {
    const fahrenheit = (celsius * 9) / 5 + 32;
    const kelvin = celsius + 273.15;

    show(`Temperature: ${celsius} °C`);
    show(`Fahrenheit: ${fahrenheit.toFixed(2)} °F`);
    show(`Kelvin: ${kelvin.toFixed(2)} K`);
  }
}
