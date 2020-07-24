import fs from 'fs';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';

// The images generated are ${size}px by ${size}px;
const size = 50;

// The file to write out to.
const outputFile = 'data/fascinatorData.json';

// The source to fetch from.
const wordpressListingURL =
  'https://stamenstaging.wpengine.com/wp-json/viz/v1/post';

// In development, it's convenient to only run the code over 2 entries.
const isDev = false;

// Fetches and parses the listing from the WordPress API endpoint.
const fetchWordpressListing = async () => {
  const response = await fetch(wordpressListingURL);
  return await response.json();
};

// Fetches all images, resizes them, encodes them to JSON, and write the output.
const main = async () => {
  let wordpressListing = await fetchWordpressListing();

  if (isDev) {
    wordpressListing = wordpressListing.slice(0, 2);
  }

  // Count for reporting progress.
  let i = 1;

  const data = await Promise.all(
    wordpressListing.map(
      async ({ ID, post_title, go_live_date, thumbnail_image, post_name }) => {
        // Load the image over the network.
        // Docs:
        // https://github.com/Automattic/node-canvas#loadimage
        const image = await loadImage(thumbnail_image);

        console.log(`scraped image ${i++} of ${wordpressListing.length}.`);

        // Scale down the image to fill a squared,
        // centered at the center of the original image.
        // Draws from:
        // https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        const { width, height } = image;
        const scale = Math.max(size / width, size / height);
        const dx = size / 2 - (width / 2) * scale;
        const dy = size / 2 - (height / 2) * scale;
        const dWidth = width * scale;
        const dHeight = height * scale;

        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, dx, dy, dWidth, dHeight);

        // Base64-encode the image.
        // Docs:
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
        const thumbnailDataURL = canvas.toDataURL('image/jpeg', 0.8);

        return {
          ID,
          post_title,
          go_live_date,
          post_name,
          thumbnailDataURL,
        };
      }
    )
  );

  const json = JSON.stringify(data);
  fs.writeFileSync(outputFile, json);

  console.log(`Wrote output to ${outputFile}`);
};

main();
