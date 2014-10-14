(function() {
    'use strict';

    var cells, context, frameRequest, height, width;

    function CellularAutomata(canvas) {

        var x, y;

        if (this === window) {
            return new CellularAutomata(canvas);
        }

        cells = [];

        width = Math.ceil(canvas.width);
        height = Math.ceil(canvas.height);

        context = canvas.getContext('2d');

        for (y = 0; y < height; y++) {
            cells.push([]);
            for (x = 0; x < width; x++) {
                cells[y].push(0);
            }
        }

        this.randomise();
        this.iterate();
    }

    CellularAutomata.prototype.paintToCanvas = function() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = 'white';
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (cells[y][x] === 1) {
                    context.fillRect(x, y, 1, 1);
                }
            }
        }
    };

    CellularAutomata.prototype.checkCell = function(x, y) {
        if (x < 0 || y < 0 || y > cells.length - 1 || x > cells[y].length - 1) {
            return 0;
        }
        return cells[y][x];
    };

    CellularAutomata.prototype.iterate = function() {
        var sum, nextCells = [], self = this;

        requestAnimationFrame(function() {
            self.iterate();
        });

        for (var y = 0; y < height; y++) {

            nextCells.push([]);

            for (var x = 0; x < width; x++) {

                sum = 0;
                sum += this.checkCell(x - 1, y - 1);
                sum += this.checkCell(x, y - 1);
                sum += this.checkCell(x + 1, y - 1);
                sum += this.checkCell(x - 1, y);
                sum += this.checkCell(x + 1, y);
                sum += this.checkCell(x - 1, y + 1);
                sum += this.checkCell(x, y + 1);
                sum += this.checkCell(x + 1, y + 1);

                if (cells[y][x] === 1) {
                    nextCells[y][x] = sum < 2 || sum > 3 ? 0 : 1;
                } else {
                    nextCells[y][x] = sum === 3 ? 1 : 0;
                }
            }
        }

        cells = nextCells;
        this.paintToCanvas();
    };

    CellularAutomata.prototype.randomise = function() {
        var i = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                cells[y][x] = !Math.floor(20 * Math.random()) ? 1 : 0;
            }
        }
        this.paintToCanvas();
    };

    document.addEventListener('DOMContentLoaded', function() {
        var canvas = document.querySelector('canvas');
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        window.ca = new CellularAutomata(canvas);
    }, false);

}());
