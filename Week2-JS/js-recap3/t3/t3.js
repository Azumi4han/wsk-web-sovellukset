const target = document.querySelector('#target');

function addParagraph(text) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  target.appendChild(paragraph);
}

function getPlatformFromUserAgent(userAgent) {
  if (/Windows/i.test(userAgent)) {
    return 'Windows';
  }

  if (/Android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  }

  if (/Mac/i.test(userAgent)) {
    return 'macOS';
  }

  if (/Linux/i.test(userAgent)) {
    return 'Linux';
  }

  return 'Unknown';
}

function getBrowserInfo() {
  const userAgentData = navigator.userAgentData;

  if (userAgentData) {
    const brands = userAgentData.brands || [];
    const primaryBrand =
      brands.find((brand) => brand.brand === 'Google Chrome') ||
      brands[0] ||
      {brand: 'Unknown', version: 'Unknown'};

    return {
      name: primaryBrand.brand,
      version: primaryBrand.version,
      platform:
        userAgentData.platform ||
        getPlatformFromUserAgent(navigator.userAgent),
      brands,
    };
  }

  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  if (userAgent.includes('Firefox/')) {
    name = 'Firefox';
    version = userAgent.split('Firefox/')[1].split(' ')[0];
  } else if (userAgent.includes('Edg/')) {
    name = 'Microsoft Edge';
    version = userAgent.split('Edg/')[1].split(' ')[0];
  } else if (userAgent.includes('Chrome/')) {
    name = 'Google Chrome';
    version = userAgent.split('Chrome/')[1].split(' ')[0];
  } else if (userAgent.includes('Safari/')) {
    name = 'Safari';
    version = userAgent.split('Version/')[1]?.split(' ')[0] || 'Unknown';
  }

  return {
    name,
    version,
    platform: getPlatformFromUserAgent(userAgent),
    brands: [],
  };
}

const browser = getBrowserInfo();
const now = new Date();
const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

addParagraph(`Browser: ${browser.name} ${browser.version}`);
addParagraph(`Operating system: ${browser.platform}`);

if (browser.brands.length > 0) {
  addParagraph(
    `Browser brands: ${browser.brands
      .map((brand) => `${brand.brand} ${brand.version}`)
      .join(', ')}`
  );
}

addParagraph(`Screen size: ${screen.width} x ${screen.height}`);
addParagraph(
  `Available browser space: ${window.innerWidth} x ${window.innerHeight}`
);
addParagraph(
  `Current date and time: ${now.toLocaleTimeString('fi-FI', dateOptions)}`
);
