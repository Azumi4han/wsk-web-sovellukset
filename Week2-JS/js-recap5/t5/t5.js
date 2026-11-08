const RESTAURANTS_URL =
  'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';

const statusElement = document.querySelector('#status');
const tableBody = document.querySelector('tbody');
const dialog = document.querySelector('#restaurant-dialog');
const dialogContent = document.querySelector('#dialog-content');

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function createDetailParagraph(label, value) {
  const paragraph = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = `${label}: `;
  paragraph.append(strong, document.createTextNode(value));
  return paragraph;
}

function createCloseButton() {
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => dialog.close());
  return closeButton;
}

async function openRestaurant(restaurant) {
  dialogContent.replaceChildren();

  const heading = document.createElement('h2');
  heading.textContent = restaurant.name;

  const menuHeading = document.createElement('h3');
  menuHeading.textContent = "Today's menu";

  const menuContainer = document.createElement('div');
  menuContainer.textContent = 'Loading menu...';

  dialogContent.append(
    heading,
    createDetailParagraph(
      'Address',
      `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`
    ),
    createDetailParagraph('Phone', restaurant.phone || 'Not available'),
    createDetailParagraph('Company', restaurant.company || 'Not available'),
    menuHeading,
    menuContainer,
    createCloseButton()
  );

  dialog.showModal();

  try {
    const menuData = await fetchData(
      `${RESTAURANTS_URL}/daily/${restaurant._id}/fi`
    );
    const courses = menuData.courses || [];

    menuContainer.replaceChildren();

    if (courses.length === 0) {
      const noMenu = document.createElement('p');
      noMenu.textContent = 'No menu is available for today';
      menuContainer.appendChild(noMenu);
      return;
    }

    const menuList = document.createElement('ul');
    menuList.className = 'menu-list';

    courses.forEach((course) => {
      const item = document.createElement('li');
      item.textContent = `${course.name} - ${course.price || '-'}`;
      menuList.appendChild(item);
    });

    menuContainer.appendChild(menuList);
  } catch (error) {
    console.error('Could not load the menu:', error);

    const errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.textContent =
      'Could not load the menu. Check your network connection';
    menuContainer.replaceChildren(errorMessage);
  }
}

function renderRestaurants(restaurants) {
  const sortedRestaurants = [...restaurants].sort((first, second) =>
    first.name.localeCompare(second.name, 'fi')
  );

  tableBody.replaceChildren();

  sortedRestaurants.forEach((restaurant) => {
    const row = document.createElement('tr');
    row.classList.add('restaurant-row');

    const nameCell = document.createElement('td');
    nameCell.textContent = restaurant.name;

    const addressCell = document.createElement('td');
    addressCell.textContent = restaurant.address;

    row.append(nameCell, addressCell);

    row.addEventListener('click', () => {
      document
        .querySelectorAll('.restaurant-row')
        .forEach((restaurantRow) =>
          restaurantRow.classList.remove('highlight')
        );

      row.classList.add('highlight');
      openRestaurant(restaurant);
    });

    tableBody.appendChild(row);
  });

  statusElement.textContent = `Restaurants loaded: ${sortedRestaurants.length}`;
}

async function loadRestaurants() {
  try {
    const restaurants = await fetchData(RESTAURANTS_URL);
    renderRestaurants(restaurants);
  } catch (error) {
    console.error('Could not load restaurants:', error);
    statusElement.className = 'error';
    statusElement.textContent =
      'Could not load restaurants. Check that you are connected to the Metropolia network or VPN';
  }
}

loadRestaurants();
