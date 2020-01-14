export const drawWithStyle = (ctx, style, path) => {
  const { lineWidth, fillStyle, strokeStyle } = style;

  ctx.save();
  ctx.lineWidth = lineWidth;

  fillStyle &&
    (Array.isArray(fillStyle) ? fillStyle : [fillStyle]).forEach(element => {
      ctx.fillStyle = element;
      ctx.fill(path);
    });

  strokeStyle &&
    (Array.isArray(strokeStyle) ? strokeStyle : [strokeStyle]).forEach(
      element => {
        ctx.strokeStyle = element;
        ctx.stroke(path);
      }
    );
  ctx.restore();
};
