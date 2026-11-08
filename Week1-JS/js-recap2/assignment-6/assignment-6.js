const output = document.querySelector('#output');

function show(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  output.appendChild(paragraph);
}

function askText(message) {
  const input = prompt(message);

  if (input === null || input.trim() === '') {
    return null;
  }

  return input.trim();
}

function askRating(message) {
  const input = prompt(message);

  if (input === null || input.trim() === '') {
    return null;
  }

  const rating = Number(input);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
}

const countInput = prompt('How many movies do you want to rate?');

if (countInput === null || countInput.trim() === '') {
  show('No number of movies was entered');
} else {
  const count = Number(countInput);

  if (!Number.isInteger(count) || count <= 0) {
    show('Please enter a positive integer');
  } else {
    const movies = [];

    for (let i = 1; i <= count; i++) {
      const title = askText(`Enter the title of movie ${i}:`);

      if (title === null) {
        show(`Movie ${i} was not entered`);
        break;
      }

      const rating = askRating(`Enter the rating for "${title}" (1-5):`);

      if (rating === null) {
        show(`A rating from 1 to 5 is required for "${title}"`);
        break;
      }

      movies.push({title, rating});
    }

    if (movies.length === 0) {
      show('No movies were rated');
    } else {
      movies.sort((a, b) => b.rating - a.rating);

      const highestRated = movies[0];

      show('Movies sorted by rating:');

      const list = document.createElement('ol');

      for (const movie of movies) {
        const item = document.createElement('li');
        item.textContent = `${movie.title} - ${movie.rating}/5`;
        list.appendChild(item);
      }

      output.appendChild(list);
      show(
        `Highest-rated movie: ${highestRated.title} (${highestRated.rating}/5)`
      );
    }
  }
}
