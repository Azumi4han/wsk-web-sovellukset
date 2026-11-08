const output = document.querySelector('#output');

async function getUnknownResource() {
  const url = 'https://reqres.in/api/unknown/23';

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('An error occurred:', error);
    output.textContent = `An error occurred: ${error.message}`;
  }
}

getUnknownResource();
