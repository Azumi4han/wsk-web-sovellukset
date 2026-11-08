const API_BASE = "https://media2.edu.metropolia.fi/restaurant/api/v1";

const state = {
  restaurants: [],
  filtered: [],
  selectedId: null,
  activeMenu: "daily",
  menuRequestId: 0,
};

const dom = {
  searchInput: document.querySelector("#search-input"),
  cityFilter: document.querySelector("#city-filter"),
  providerFilter: document.querySelector("#provider-filter"),
  filterButton: document.querySelector("#filter-button"),
  cards: document.querySelector("#restaurant-cards"),
  count: document.querySelector("#restaurant-count"),
  dataStatus: document.querySelector("#restaurant-data-status"),
  detailTitle: document.querySelector("#detail-title"),
  detailAddress: document.querySelector("#detail-address"),
  detailCompany: document.querySelector("#detail-company"),
  detailPhone: document.querySelector("#detail-phone"),
  detailDistance: document.querySelector("#detail-distance"),
  detailMeta: document.querySelector("#detail-meta"),
  menuTabs: [...document.querySelectorAll("[data-menu-tab]")],
  menuPanel: document.querySelector("#menu-panel"),
};

init();

function init() {
  bindEvents();
  loadRestaurants();
}

function bindEvents() {
  let searchTimer;

  dom.searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(applyFilters, 200);
  });

  dom.cityFilter.addEventListener("change", applyFilters);
  dom.providerFilter.addEventListener("change", applyFilters);
  dom.filterButton.addEventListener("click", applyFilters);

  dom.menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (!state.selectedId) {
        return;
      }

      state.activeMenu = tab.dataset.menuTab;
      updateMenuTabs();
      loadMenu(tab.dataset.menuTab);
    });
  });
}

async function loadRestaurants() {
  dom.cards.replaceChildren();
  dom.count.textContent = "Loading…";
  dom.dataStatus.hidden = false;
  dom.dataStatus.textContent = "Loading restaurants…";
  resetDetail();

  try {
    const restaurants = await fetchJson("/restaurants");

    state.restaurants = [...restaurants].sort((first, second) =>
      first.name.localeCompare(second.name, "fi"),
    );

    populateFilters();
    applyFilters();
    dom.dataStatus.hidden = true;

    if (state.filtered.length > 0) {
      selectRestaurant(state.filtered[0]._id);
    }
  } catch (error) {
    console.error("Restaurant API error:", error);
    dom.count.textContent = "0 results";
    dom.cards.replaceChildren();
    dom.dataStatus.hidden = false;
    dom.dataStatus.textContent =
      "API is not available. Check your Metropolia VPN!!!!";
    resetDetail();
  }
}

function resetDetail() {
  state.selectedId = null;
  state.activeMenu = "daily";
  state.menuRequestId += 1;

  dom.detailTitle.textContent = "Select a restaurant";
  dom.detailAddress.textContent =
    "Choose a restaurant from the list to view its menu";
  dom.detailCompany.textContent = "";
  dom.detailPhone.textContent = "";
  dom.detailDistance.hidden = true;
  dom.detailMeta.hidden = true;
  dom.menuPanel.replaceChildren(
    createMenuPlaceholder("Select a restaurant to view its menu."),
  );
  updateMenuTabs();
}

function createMenuPlaceholder(message) {
  const placeholder = document.createElement("p");
  placeholder.className = "data-status";
  placeholder.textContent = message;
  return placeholder;
}

function populateFilters() {
  const cities = [...new Set(state.restaurants.map((item) => item.city))]
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second, "fi"));
  const providers = [...new Set(state.restaurants.map((item) => item.company))]
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second, "fi"));

  fillSelect(dom.cityFilter, "All cities", cities);
  fillSelect(dom.providerFilter, "All providers", providers);
}

function fillSelect(select, placeholder, values) {
  const currentValue = select.value;
  select.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  select.append(defaultOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });

  select.value = values.includes(currentValue) ? currentValue : "";
}

function applyFilters() {
  const search = dom.searchInput.value.trim().toLowerCase();
  const city = dom.cityFilter.value;
  const provider = dom.providerFilter.value;

  state.filtered = state.restaurants.filter((restaurant) => {
    const searchText = [
      restaurant.name,
      restaurant.address,
      restaurant.postalCode,
      restaurant.city,
      restaurant.company,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!search || searchText.includes(search)) &&
      (!city || restaurant.city === city) &&
      (!provider || restaurant.company === provider)
    );
  });

  renderRestaurants();

  const count = state.filtered.length;
  dom.count.textContent = count === 1 ? "1 result" : `${count} results`;
}

function renderRestaurants() {
  dom.cards.replaceChildren();

  if (state.filtered.length === 0) {
    const message = document.createElement("p");
    message.className = "data-status";
    message.textContent = "No results. Try another search.";
    dom.cards.append(message);
    return;
  }

  state.filtered.forEach((restaurant) => {
    dom.cards.append(createRestaurantCard(restaurant));
  });
}

function createRestaurantCard(restaurant) {
  const card = document.createElement("a");
  card.className = "restaurant-card";
  card.href = "#menu";
  card.dataset.id = restaurant._id;

  if (restaurant._id === state.selectedId) {
    card.classList.add("is-selected");
  }

  const top = document.createElement("div");
  top.className = "restaurant-card-top";

  const information = document.createElement("div");

  const name = document.createElement("h3");
  name.textContent = restaurant.name;

  const address = document.createElement("p");
  address.textContent = formatAddress(restaurant);

  information.append(name, address);
  top.append(information);

  const tags = document.createElement("div");
  tags.className = "tag-row";

  if (restaurant.company) {
    const company = document.createElement("span");
    company.className = "tag";
    company.textContent = restaurant.company;
    tags.append(company);
  }

  card.append(top, tags);

  card.addEventListener("click", (event) => {
    event.preventDefault();
    selectRestaurant(restaurant._id);
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  return card;
}

function selectRestaurant(restaurantId) {
  const restaurant = state.restaurants.find(
    (item) => item._id === restaurantId,
  );

  if (!restaurant) {
    return;
  }

  state.selectedId = restaurant._id;
  state.activeMenu = "daily";

  dom.detailTitle.textContent = restaurant.name;
  dom.detailAddress.textContent = formatAddress(restaurant);
  dom.detailCompany.textContent = restaurant.company || "Not available";
  dom.detailPhone.textContent =
    restaurant.phone && restaurant.phone !== "-"
      ? restaurant.phone
      : "Not available";
  dom.detailDistance.hidden = true;
  dom.detailMeta.hidden = false;

  document.querySelectorAll(".restaurant-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.id === restaurantId);
  });

  updateMenuTabs();
  loadMenu("daily");
}

function updateMenuTabs() {
  dom.menuTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.menuTab === state.activeMenu);
  });
}

async function loadMenu(type) {
  if (!state.selectedId) {
    return;
  }

  const restaurantId = state.selectedId;
  const requestId = ++state.menuRequestId;

  showMenuStatus("Loading menu…");

  try {
    const path =
      type === "daily"
        ? `/restaurants/daily/${restaurantId}/en`
        : `/restaurants/weekly/${restaurantId}/en`;
    const data = await fetchJson(path);

    if (
      requestId !== state.menuRequestId ||
      state.selectedId !== restaurantId ||
      state.activeMenu !== type
    ) {
      return;
    }

    if (type === "daily") {
      renderDailyMenu(data);
    } else {
      renderWeeklyMenu(data);
    }
  } catch (error) {
    if (requestId !== state.menuRequestId) {
      return;
    }

    console.error("Menu API error:", error);
    showMenuStatus("Could not load the menu. Check your Metropolia VPN.");
  }
}

function renderDailyMenu(data) {
  const courses = Array.isArray(data.courses) ? data.courses : [];

  dom.menuPanel.replaceChildren();

  if (courses.length === 0) {
    appendMenuStatus("No menu for today.");
    return;
  }

  const heading = document.createElement("h3");
  heading.textContent = "Today";
  dom.menuPanel.append(heading, createMenuList(courses));
}

function renderWeeklyMenu(data) {
  const days = Array.isArray(data.days) ? data.days : [];

  dom.menuPanel.replaceChildren();

  if (days.length === 0) {
    appendMenuStatus("No weekly menu.");
    return;
  }

  days.forEach((day) => {
    const section = document.createElement("section");
    section.className = "menu-day";

    const heading = document.createElement("h3");
    heading.textContent = formatDate(day.date) || "Day";
    section.append(heading);

    const courses = Array.isArray(day.courses) ? day.courses : [];

    if (courses.length === 0) {
      const message = document.createElement("p");
      message.className = "data-status";
      message.textContent = "No dishes for this day.";
      section.append(message);
    } else {
      section.append(createMenuList(courses));
    }

    dom.menuPanel.append(section);
  });
}

function createMenuList(courses) {
  const list = document.createElement("ul");
  list.className = "menu-list";

  courses.forEach((course) => {
    const item = document.createElement("li");
    const information = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = course.name || "Untitled dish";
    information.append(name);

    const diets = formatDiets(course.diets);

    if (diets) {
      const dietText = document.createElement("span");
      dietText.textContent = diets;
      information.append(dietText);
    }

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatPrice(course.price);

    item.append(information, price);
    list.append(item);
  });

  return list;
}

function showMenuStatus(message) {
  dom.menuPanel.replaceChildren();
  appendMenuStatus(message);
}

function appendMenuStatus(message) {
  const status = document.createElement("p");
  status.className = "data-status";
  status.textContent = message;
  dom.menuPanel.append(status);
}

function formatAddress(restaurant) {
  const cityLine = [restaurant.postalCode, restaurant.city]
    .filter(Boolean)
    .join(" ");

  return [restaurant.address, cityLine].filter(Boolean).join(", ");
}

function formatDiets(diets) {
  if (Array.isArray(diets)) {
    return diets.filter(Boolean).join(", ");
  }

  return typeof diets === "string" ? diets : "";
}

function formatPrice(price) {
  if (!price) {
    return "Price not available";
  }

  const value = String(price).trim();
  const normalized = value.replace(/,(\d)/g, ".$1");

  return normalized.includes("€") ? normalized : `${normalized} €`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const value = String(dateString).trim();

  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const formatted = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
