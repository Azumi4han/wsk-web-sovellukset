/**
 * Fetches data from a given URL using the Fetch API.
 *
 * @async
 * @param {string} url - the url to fetch data from
 * @param {object} options - fetch options
 * @return {Promise<object>} - the fetched data as a JS object
 */
const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    if (json.message) {
      throw new Error(json.message);
    }
    throw new Error(`Error ${response.status} occured`);
  }
  return json;
};

export {fetchData};
