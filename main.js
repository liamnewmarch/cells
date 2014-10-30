(function(global) {
    'use strict';

    var cells, context, frameRequest, height, width;

    function CellularAutomata(canvas) {

        var x, y;

        if (this === global) {
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

        var x, y, image, imageData, i, width, height;

        width = context.canvas.width;
        height = context.canvas.height;
        image = context.createImageData(width, height);
		imageData = image.data;

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                i = 4 * (y * width + x);
                if (cells[y][x]) {
                    imageData[i + 0] = 255;
                    imageData[i + 1] = 255;
                    imageData[i + 2] = 255;
                    imageData[i + 3] = 255;
                }
            }
        }

        context.putImageData(image, 0, 0);
    };

    CellularAutomata.prototype.checkCell = function(x, y) {
        if (x < 0 || y < 0 || y > cells.length - 1 || x > cells[y].length - 1) {
            return 0;
        }
        return cells[y][x] ? 1 : 0;
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

                if (cells[y][x]) {
                    nextCells[y][x] = sum >= 2 && sum <= 3;
                } else {
                    nextCells[y][x] = sum === 3;
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
                cells[y][x] = Math.floor(20 * Math.random()) === 0;
            }
        }
        this.paintToCanvas();
    };

    document.addEventListener('DOMContentLoaded', function() {
        var canvas = document.querySelector('canvas');
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        global.ca = new CellularAutomata(canvas);
    }, false);

}(window));

var domready = new Promise(function(resolve, reject) {
    var now = new Date();
    if (document.readyState === 'complete') {
        resolve(now);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            resolve(now);
        }, false);
    }
});

domready.then(function() {
    var canvas = document.querySelector('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    global.ca = new CellularAutomata(canvas);
});
