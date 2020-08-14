import fs from 'fs';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';
import { size, radius, isProd } from '../src/constants';

// The file to write out to.
const outputFile = 'data/fascinatorData.json';

// The source to fetch from.
const wordpressListingURL =
  'https://stamenstaging.wpengine.com/wp-json/viz/v1/post';

// Fetches and parses the listing from the WordPress API endpoint.
const fetchWordpressListing = async () => {
  const response = await fetch(wordpressListingURL);
  const rawData = await response.json();
  return rawData.filter((d) => d.post_status !== 'draft');
};

// Fetches all images, resizes them, encodes them to JSON, and write the output.
const main = async () => {
  let wordpressListing = await fetchWordpressListing();

  // In development, it's convenient to only run the code over 2 entries.
  if (!isProd) {
    wordpressListing = wordpressListing.slice(0, 2);
  }

  const data = await wordpressListing.reduce(
    async (accumulatorPromise, d) => {
      const accumulator = await accumulatorPromise;
      const {
        ID,
        post_title,
        go_live_date,
        thumbnail_image,
        post_name,
        work_types,
        industries,
        subject_matter,
        technologies,
      } = d;
      // Load the image over the network.
      // Docs:
      // https://github.com/Automattic/node-canvas#loadimage

      if (!thumbnail_image) {
        console.log(
          'Ignoring entry with missing thumbnail: ' +
            post_name
        );
        return accumulator;
      }

      const image = await loadImage(thumbnail_image);

      console.log(
        `scraped image ${accumulator.length + 1} of ${
          wordpressListing.length
        }.`
      );

      // Scale down the image to fill a square,
      // centered at the center of the original image.
      // Draws from:
      // https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
      const { width, height } = image;
      const scale = Math.max(size / width, size / height);
      const dx = radius - (width / 2) * scale;
      const dy = radius - (height / 2) * scale;
      const dWidth = width * scale;
      const dHeight = height * scale;

      // Create a Canvas and draw the image to it.
      // Docs:
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      ctx.save();

      // Mask the image with a circle.
      // Draws from http://jsfiddle.net/jimrhoskins/dDUC3/1/
      ctx.beginPath();
      ctx.arc(
        size / 2,
        size / 2,
        radius,
        0,
        Math.PI * 2,
        false
      );
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(image, dx, dy, dWidth, dHeight);

      ctx.restore();

      // Base64-encode the image.
      // Docs:
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
      const thumbnailDataURL = canvas.toDataURL(
        'image/png',
        0.8
      );

      return [
        ...accumulator,
        {
          ID,
          post_title,
          go_live_date,
          post_name,
          thumbnailDataURL,
          work_types,
          industries,
          subject_matter,
          technologies,
        },
      ];
    },
    Promise.resolve([])
  );

  const json = JSON.stringify(data);
  fs.writeFileSync(outputFile, json);

  console.log(`Wrote output to ${outputFile}`);
};

main();
