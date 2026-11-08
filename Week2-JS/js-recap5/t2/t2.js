const output = document.querySelector('#output');

async function createUser() {
  const url = 'https://reqres.in/api/users';
  const user = {
    name: 'John Doe',
    job: 'Developer',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
      body: JSON.stringify(user),
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

createUser();
