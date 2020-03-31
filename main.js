customElements.define('cellular-automata', class extends HTMLElement {
  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.onresize = this.reset.bind(this);
    this.paused = true;
    this.scale = 4;
  }

  connectedCallback() {
    addEventListener('resize', this.onresize, { passive: true });
    this.append(this.canvas);
    this.start();
  }

  disconnectedCallback() {
    removeEventListener('resize', this.onresize, { passive: true });
    this.innerHTML = '';
  }

  cellAlive(x, y) {
    x = (x + this.width) % this.width;
    y = (y + this.height) % this.height;
    return this.cells[y][x];
  }

  cellAliveNeighbourCount(x, y) {
    return [
      this.cellAlive(x - 1, y - 1),
      this.cellAlive(x + 0, y - 1),
      this.cellAlive(x + 1, y - 1),
      this.cellAlive(x - 1, y + 0),
      this.cellAlive(x + 1, y + 0),
      this.cellAlive(x - 1, y + 1),
      this.cellAlive(x + 0, y + 1),
      this.cellAlive(x + 1, y + 1),
    ].reduce((count, alive) => count + Number(alive), 0);
  }

  iterate() {
    requestAnimationFrame(() => this.iterate());
    if (this.paused) return;

    const nextCells = [];
    for (let y = 0; y < this.height; y++) {
      nextCells[y] = [];

      for (let x = 0; x < this.width; x++) {
        const neighbours = this.cellAliveNeighbourCount(x, y);

        if (this.cells[y][x]) {
          nextCells[y][x] = neighbours >= 2 && neighbours <= 3;
        } else {
          nextCells[y][x] = neighbours === 3;
        }
      }
    }

    this.cells = nextCells;
    this.render();
  }

  render() {
    const image = this.context.createImageData(this.width, this.height);
    const { data } = image;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = 4 * (y * this.width + x);
        if (this.cells[y][x]) {
          data[i + 0] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
        }
      }
    }
    this.context.putImageData(image, 0, 0);
  }

  reset() {
    this.cells = [];
    this.width = this.context.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.context.canvas.height = Math.ceil(window.innerHeight / this.scale);

    for (var y = 0; y < this.height; y++) {
      this.cells[y] = [];
      for (var x = 0; x < this.width; x++) {
        this.cells[y][x] = Math.floor(16 * Math.random()) === 0;
      }
    }

    this.render();
  }

  start() {
    this.paused = false;
    this.reset();
    requestAnimationFrame(() => this.iterate());
  }
});
