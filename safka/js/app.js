// safka is a student restaurant menus based on Metropolia API
// All in one file, because why not!

// Metropolia API
const API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";
// My avatars
const AVATAR_URL = "https://media2.edu.metropolia.fi/restaurant/uploads/";

// The weekly menu always starts from Monday. We use our own weekday names,
// because the API gives wrong English dates for Sodexo restaurants!!!
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Colours of the dots on the map
const COLORS = {
  restaurant: "#d9480f",
  nearest: "#2b8a3e",
  favourite: "#d6336c",
  user: "#1c7ed6",
};

// ----- Elements on the page -----
const searchInput = document.querySelector("#search");
const companySelect = document.querySelector("#company");
const citySelect = document.querySelector("#city");
const restaurantList = document.querySelector("#restaurant-list");
const resultCount = document.querySelector("#result-count");
const noSelection = document.querySelector("#no-selection");
const details = document.querySelector("#details");
const favouriteButton = document.querySelector("#favourite-button");
const dailyTab = document.querySelector("#daily-tab");
const weeklyTab = document.querySelector("#weekly-tab");
const dailyMenu = document.querySelector("#daily-menu");
const weeklyMenu = document.querySelector("#weekly-menu");
const loginButton = document.querySelector("#login-button");
const profileButton = document.querySelector("#profile-button");
const authDialog = document.querySelector("#auth-dialog");
const loginTab = document.querySelector("#login-tab");
const signupTab = document.querySelector("#signup-tab");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const profileDialog = document.querySelector("#profile-dialog");
const profileForm = document.querySelector("#profile-form");
const toast = document.querySelector("#toast");

// Simple app state
let restaurants = []; // all restaurants from the API
let visibleRestaurants = []; // the ones that match the search and filters
let selectedRestaurant = null; // the one whose menu is shown
let nearestRestaurant = null; // the one closest to the user
let currentUser = null; // the logged in user, or null

// Some helpers

// Ask the API for something. Returns the answer as an object,
// or throws an error with the message from the API.
async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  if (token) {
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(API_URL + path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// fetch options for sending data as JSON
function sendJson(method, data) {
  return {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

// Make text from the API safe to put inside HTML:
// the browser turns characters like < and > into harmless codes.
function escapeHtml(text) {
  const element = document.createElement("div");
  element.textContent = text || "";
  return element.innerHTML;
}

// Show a short message at the bottom of the screen for 3 seconds
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

// openStreet map, the one HSL is using
// Check this out https://wiki.openstreetmap.org/wiki/Helsinki_Region_Transport
const map = L.map("map").setView([64.5, 26], 5); // start by showing all of Finland
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
const markers = L.layerGroup().addTo(map); // all restaurant dots are in this group

// The API gives coordinates as [longitude, latitude],
// but Leaflet wants them as [latitude, longitude].
function getLatLng(restaurant) {
  const [longitude, latitude] = restaurant.location.coordinates;
  return [latitude, longitude];
}

function showMarkers() {
  markers.clearLayers();
  for (const restaurant of visibleRestaurants) {
    let color = COLORS.restaurant;
    if (restaurant === nearestRestaurant) color = COLORS.nearest;
    if (isFavourite(restaurant)) color = COLORS.favourite;

    const marker = L.circleMarker(getLatLng(restaurant), {
      radius: restaurant === selectedRestaurant ? 11 : 7, // the selected one is bigger
      color: "white",
      weight: 2,
      fillColor: color,
      fillOpacity: 1,
    });
    marker.bindTooltip(escapeHtml(restaurant.name));
    marker.on("click", () => selectRestaurant(restaurant));
    marker.addTo(markers);
  }
}

// Zoom the map so that all visible restaurants fit on it
function zoomToVisibleRestaurants() {
  if (visibleRestaurants.length > 0) {
    map.fitBounds(visibleRestaurants.map(getLatLng), {
      padding: [30, 30],
      maxZoom: 14,
    });
  }
}

// The actual restoraunt list
function showRestaurants() {
  const search = searchInput.value.trim().toLowerCase();

  visibleRestaurants = restaurants.filter((restaurant) => {
    const text =
      `${restaurant.name} ${restaurant.address} ${restaurant.city}`.toLowerCase();
    const companyMatches =
      companySelect.value === "" || restaurant.company === companySelect.value;
    const cityMatches =
      citySelect.value === "" || restaurant.city === citySelect.value;
    return text.includes(search) && companyMatches && cityMatches;
  });

  resultCount.textContent = visibleRestaurants.length;
  restaurantList.innerHTML = "";
  if (visibleRestaurants.length === 0) {
    restaurantList.innerHTML =
      '<li class="status">No restaurants match your search.</li>';
  }

  for (const restaurant of visibleRestaurants) {
    const item = document.createElement("li");
    item.dataset.id = restaurant._id;
    if (restaurant === selectedRestaurant) item.classList.add("selected");
    if (restaurant === nearestRestaurant) item.classList.add("nearest");
    if (isFavourite(restaurant)) item.classList.add("favourite");

    let distance = "";
    if (restaurant.distance !== undefined)
      distance = `· ${restaurant.distance.toFixed(1)} km`;

    item.innerHTML = `
      <button type="button">
        <b>${escapeHtml(restaurant.name)}</b>
        ${escapeHtml(restaurant.address)}, ${escapeHtml(restaurant.city)}
        <small>${escapeHtml(restaurant.company)} ${distance}</small>
      </button>`;

    item.querySelector("button").addEventListener("click", () => {
      selectRestaurant(restaurant);
      // on phones the menu is below the list, so scroll down to it
      if (window.innerWidth < 860) {
        document.querySelector("aside").scrollIntoView({ behavior: "smooth" });
      }
    });
    restaurantList.append(item);
  }

  showMarkers();
}

function selectRestaurant(restaurant) {
  selectedRestaurant = restaurant;

  // highlight it in the list (and remove the highlight from the others)
  for (const item of restaurantList.children) {
    item.classList.toggle("selected", item.dataset.id === restaurant._id);
  }
  showMarkers();
  map.setView(getLatLng(restaurant), 14);

  // fill in the restaurant details
  noSelection.hidden = true;
  details.hidden = false;
  document.querySelector("#details-name").textContent = restaurant.name;
  document.querySelector("#details-address").textContent =
    `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;

  const info = [restaurant.company];
  if (restaurant.phone && restaurant.phone !== "-") info.push(restaurant.phone);
  if (restaurant.distance !== undefined)
    info.push(`${restaurant.distance.toFixed(1)} km away`);
  document.querySelector("#details-info").textContent = info.join(" · ");

  updateFavouriteButton();
  loadMenus(restaurant);
}

async function loadMenus(restaurant) {
  dailyMenu.innerHTML = '<p class="status">Loading menu…</p>';
  weeklyMenu.innerHTML = '<p class="status">Loading menu…</p>';

  const daily = await getMenu("daily", restaurant);
  const weekly = await getMenu("weekly", restaurant);

  // the user may have clicked another restaurant while we were waiting
  if (restaurant !== selectedRestaurant) return;

  if (daily === null) {
    dailyMenu.innerHTML = '<p class="status">Could not load the menu.</p>';
  } else {
    dailyMenu.innerHTML =
      `<h3>${todayTitle()}</h3>` + coursesHtml(daily.courses);
  }

  if (weekly === null || weekly.days.length === 0) {
    weeklyMenu.innerHTML = '<p class="status">No weekly menu available.</p>';
  } else {
    let html = "";
    weekly.days.forEach((day, index) => {
      html += `<h3>${WEEKDAYS[index]}</h3>` + coursesHtml(day.courses);
    });
    weeklyMenu.innerHTML = html;
  }
}

// Get the daily or weekly menu, or null if it can't be loaded
async function getMenu(type, restaurant) {
  try {
    return await api(`/restaurants/${type}/${restaurant._id}/en`);
  } catch {
    return null;
  }
}

// HTML list of the dishes of one day
function coursesHtml(courses) {
  if (!courses || courses.length === 0) {
    return '<p class="status">No menu for this day.</p>';
  }
  let html = "<ul>";
  for (const course of courses) {
    // Compass gives the diets as a list ["G", "L"], Sodexo as text "G, L"
    const diets = Array.isArray(course.diets)
      ? course.diets.join(", ")
      : course.diets;
    html += `<li>${escapeHtml(course.name)} <small>${escapeHtml(diets)}</small> <b>${escapeHtml(course.price)}</b></li>`;
  }
  html += "</ul>";
  return html;
}

// On Saturday and Sunday the API already gives Monday's menu
function todayTitle() {
  const weekday = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  if (weekday === 0 || weekday === 6) return "Monday";
  return "Today";
}

// "Today" / "This week" tabs
dailyTab.addEventListener("click", () => showMenuTab("daily"));
weeklyTab.addEventListener("click", () => showMenuTab("weekly"));

function showMenuTab(tab) {
  dailyMenu.hidden = tab !== "daily";
  weeklyMenu.hidden = tab !== "weekly";
  dailyTab.classList.toggle("active", tab === "daily");
  weeklyTab.classList.toggle("active", tab === "weekly");
}

// Search and filters
for (const input of [searchInput, companySelect, citySelect]) {
  input.addEventListener("input", () => {
    showRestaurants();
    zoomToVisibleRestaurants();
  });
}

// Ask the browser where the user is, then sort the restaurants by distance
function findUserLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((position) => {
    const userLatLng = [position.coords.latitude, position.coords.longitude];
    L.circleMarker(userLatLng, {
      radius: 7,
      color: "white",
      weight: 2,
      fillColor: COLORS.user,
      fillOpacity: 1,
    })
      .bindTooltip("You are here")
      .addTo(map);

    for (const restaurant of restaurants) {
      // map.distance() gives the distance between two points in metres
      restaurant.distance =
        map.distance(userLatLng, getLatLng(restaurant)) / 1000;
    }
    restaurants.sort((a, b) => a.distance - b.distance); // closest first
    nearestRestaurant = restaurants[0];
    showRestaurants();

    // if nothing is selected yet, show the menu of the nearest restaurant
    if (selectedRestaurant === null) selectRestaurant(nearestRestaurant);
  });
}

// User account
function isFavourite(restaurant) {
  return (
    currentUser !== null && currentUser.favouriteRestaurant === restaurant._id
  );
}

// Update the page after logging in (user is an object) or out (user is null)
function setUser(user) {
  currentUser = user;
  loginButton.hidden = user !== null;
  profileButton.hidden = user === null;
  if (user !== null) {
    document.querySelector("#username").textContent = user.username;
    document.querySelector("#avatar").src = user.avatar
      ? AVATAR_URL + user.avatar
      : "assets/cat.webp";
  }
  showRestaurants(); // the favourite is marked in the list and on the map
  updateFavouriteButton();
}

function updateFavouriteButton() {
  if (selectedRestaurant === null) return;
  if (isFavourite(selectedRestaurant)) {
    favouriteButton.textContent = "♥ Your favourite";
    favouriteButton.classList.add("active");
  } else {
    favouriteButton.textContent = "♡ Make favourite";
    favouriteButton.classList.remove("active");
  }
}

async function login(username, password) {
  const result = await api(
    "/auth/login",
    sendJson("POST", { username, password }),
  );
  localStorage.setItem("token", result.token); // so the user stays logged in after a reload
  setUser(result.data);
  authDialog.close();
  showToast(`Welcome, ${result.data.username}!`);
}

function logout() {
  localStorage.removeItem("token");
  setUser(null);
  profileDialog.close();
}

// Favourite button: save the selected restaurant as the user's favourite
favouriteButton.addEventListener("click", async () => {
  if (currentUser === null) {
    authDialog.showModal(); // you need an account to save a favourite
    return;
  }
  try {
    const result = await api(
      "/users",
      sendJson("PUT", { favouriteRestaurant: selectedRestaurant._id }),
    );
    setUser(result.data);
    showToast(`♥ ${selectedRestaurant.name} is your favourite now`);
  } catch (error) {
    showToast(error.message);
  }
});

// ----- Log in / sign up window -----
loginButton.addEventListener("click", () => authDialog.showModal());
loginTab.addEventListener("click", () => showAuthForm("login"));
signupTab.addEventListener("click", () => showAuthForm("signup"));

function showAuthForm(form) {
  loginForm.hidden = form !== "login";
  signupForm.hidden = form !== "signup";
  loginTab.classList.toggle("active", form === "login");
  signupTab.classList.toggle("active", form === "signup");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // don't reload the page
  const message = document.querySelector("#login-message");
  message.textContent = "";
  try {
    await login(loginForm.username.value, loginForm.password.value);
    loginForm.reset();
  } catch (error) {
    message.textContent = error.message;
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.querySelector("#signup-message");
  message.textContent = "";
  const newUser = {
    username: signupForm.username.value,
    email: signupForm.email.value,
    password: signupForm.password.value,
  };
  try {
    await api("/users", sendJson("POST", newUser));
    await login(newUser.username, newUser.password); // log in right away
    signupForm.reset();
  } catch (error) {
    message.textContent = error.message;
  }
});

// Tell the user right away if the username is already taken
signupForm.username.addEventListener("change", async () => {
  const result = await api(
    `/users/available/${encodeURIComponent(signupForm.username.value)}`,
  );
  document.querySelector("#signup-message").textContent = result.available
    ? ""
    : "That username is already taken.";
});

// ----- Profile window -----
profileButton.addEventListener("click", () => {
  profileForm.reset();
  profileForm.username.value = currentUser.username;
  profileForm.email.value = currentUser.email;
  document.querySelector("#profile-avatar").src =
    document.querySelector("#avatar").src;
  document.querySelector("#profile-message").textContent = "";

  const favourite = restaurants.find((restaurant) => isFavourite(restaurant));
  document.querySelector("#favourite-name").textContent = favourite
    ? favourite.name
    : "none yet";

  profileDialog.showModal();
});

// Show the chosen picture right away, before Save
profileForm.avatar.addEventListener("change", () => {
  const file = profileForm.avatar.files[0];
  if (!file) return; // the user closed the file picker without choosing
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    document.querySelector("#profile-avatar").src = event.target.result;
  };
  fileReader.readAsDataURL(file);
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.querySelector("#profile-message");
  message.textContent = "";
  try {
    // send only the things that changed
    const changes = {};
    if (profileForm.username.value !== currentUser.username)
      changes.username = profileForm.username.value;
    if (profileForm.email.value !== currentUser.email)
      changes.email = profileForm.email.value;
    if (profileForm.password.value !== "")
      changes.password = profileForm.password.value;
    if (Object.keys(changes).length > 0) {
      await api("/users", sendJson("PUT", changes));
    }

    // upload the new avatar picture, if one was chosen
    const file = profileForm.avatar.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await api("/users/avatar", { method: "POST", body: formData });
    }

    setUser(await api("/users/token")); // load the updated user
    profileDialog.close();
    showToast("Profile saved");
  } catch (error) {
    message.textContent = error.message;
  }
});

document.querySelector("#logout-button").addEventListener("click", () => {
  logout();
  showToast("Logged out");
});

document.querySelector("#delete-button").addEventListener("click", async () => {
  if (!confirm("Delete your account for good?")) return;
  try {
    await api("/users", { method: "DELETE" });
    logout();
    showToast("Account deleted");
  } catch (error) {
    document.querySelector("#profile-message").textContent = error.message;
  }
});

// ----- Start the app -----
async function start() {
  try {
    restaurants = await api("/restaurants");
  } catch {
    restaurantList.innerHTML =
      '<li class="status">Could not load restaurants. Connect to the Metropolia network or VPN.</li>';
    return;
  }
  restaurants.sort((a, b) => a.name.localeCompare(b.name, "fi")); // alphabetical order

  // fill the city filter, every city only once
  const cities = [...new Set(restaurants.map((restaurant) => restaurant.city))];
  cities.sort((a, b) => a.localeCompare(b, "fi"));
  for (const city of cities) {
    citySelect.append(new Option(city));
  }

  // stay logged in after a reload: the token from the last visit is in localStorage
  if (localStorage.getItem("token")) {
    try {
      setUser(await api("/users/token"));
    } catch {
      localStorage.removeItem("token"); // the token does not work any more
    }
  }

  showRestaurants();

  // show the user's favourite restaurant first
  const favourite = restaurants.find((restaurant) => isFavourite(restaurant));
  if (favourite) selectRestaurant(favourite);

  findUserLocation();
}

start();
