import fs from 'fs';
import fetch from 'node-fetch';

const wordpressListingURL = 'https://stamenstaging.wpengine.com/wp-json/viz/v1/post';

const fetchWordpressListing = async () => {
  const response = await fetch(wordpressListingURL);
  console.log(await response.json());
};

const main = async () => {
  const wordpressListing = await fetchWordpressListing();
};

main();
