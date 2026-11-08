const output = document.querySelector('#output');

async function fetchData(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'x-api-key': 'reqres-free-v1',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function createUser() {
  const url = 'https://reqres.in/api/users';
  const user = {
    name: 'John Doe',
    job: 'Developer',
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };

  try {
    const userData = await fetchData(url, options);
    console.log(userData);
    output.textContent = JSON.stringify(userData, null, 2);
  } catch (error) {
    console.error('An error occurred:', error);
    output.textContent = `An error occurred: ${error.message}`;
  }
}

createUser();
