export const viz = ({ selection, width, height, data }) => {
  selection
    .selectAll('circle')
    .data(data)
    .join((enter) =>
      enter
        .append('circle')
        .attr('fill', '#ffff00')
        .attr('r', 30)
        .attr('cx', () => Math.random() * width)
        .attr('cy', () => Math.random() * height)
    );
};
