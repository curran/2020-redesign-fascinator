export { version } from '../package.json';

// The images generated are ${size}px by ${size}px;
export const size = 70;

// Give 1 extra pixel for the stroke (so it doesn't get cut off at the edges).
export const radius = size / 2 - 2;

export const hoveredRadius = radius * 2;
export const hoveredSize = size * 2;

// Set this to true to build for production, false during development.
export const isProd = true;
