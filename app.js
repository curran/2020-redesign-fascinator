export const app = ({ selection, data, width, height }) => {
  selection.style('background', data ? 'green' : 'red');

  const svg = selection
    .selectAll('svg')
    .data([1])
    .join(
      (enter) => enter.append('svg'),
      (update) => update
    )
    .attr('width', width)
    .attr('height', height);
};
