import fs from 'fs';
import fetch from 'node-fetch';
import canvas from 'canvas';

const wordpressListingURL =
  'https://stamenstaging.wpengine.com/wp-json/viz/v1/post';

const fetchWordpressListing = async () => {
  const response = await fetch(wordpressListingURL);
  return await response.json();
};

const main = async () => {
  const wordpressListing = await fetchWordpressListing();
  wordpressListing.map((d) => {
    console.log(d);

    //ID, post_title, go_live_date, thumbnail_image,
  });
};

main();
