import fs from 'fs';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';

// The images generated are ${size}px by ${size}px;
const size = 50;

const wordpressListingURL =
  'https://stamenstaging.wpengine.com/wp-json/viz/v1/post';

const fetchWordpressListing = async () => {
  const response = await fetch(wordpressListingURL);
  return await response.json();
};

const main = async () => {
  let wordpressListing = await fetchWordpressListing();

  // In development, it's convenient to only run the code over 2 entries.
  const isDev = true;
  if (isDev) {
    wordpressListing = wordpressListing.slice(0, 2);
  }

  const data = await Promise.all(
    wordpressListing.map(
      async ({ ID, post_title, go_live_date, thumbnail_image, post_name }) => {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        const image = await loadImage(thumbnail_image);
        console.log(image.width, image.height);
        //ctx.drawImage(image, 50, 0, 70, 70)
      }
    )
  );
};

main();
