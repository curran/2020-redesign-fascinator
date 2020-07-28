export const Axis = ({ height, xScale }) => {
  return (
    <g>
      {xScale.ticks().map((d) => {

        // Get exactly 1px wide lines that fall on the pixel exactly.
        const x = Math.round(xScale(d)) + 0.5;

        return <line key={d} x1={x} y1={0} x2={x} y2={height} stroke="white" />;
      })}
    </g>
  );
};
