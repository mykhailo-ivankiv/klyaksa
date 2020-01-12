class Animation {
  subscriptions = [];
  animate = () => {
    this.subscriptions.forEach(fn => fn());
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  stop = () => cancelAnimationFrame(this.animationFrame);

  subscribe = fn => {
    this.subscriptions.push(fn);
    return () =>
      (this.subscriptions = this.subscriptions.filter(sub => sub !== fn));
  };
}

const animation = new Animation();
animation.animate();

export default animation;
