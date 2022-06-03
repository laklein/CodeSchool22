// Used in setInterval for moving through the grid areas
const ONE_SECOND = 1000;
const FIVE_SECONDS = 5000;
const TEN_SECONDS = 10000;

let indexHeader = document.getElementById("picture-index");
let positionHeader = document.getElementById("picture-position");

// Query the picture container so we can manipulate its style and what divs and images are loaded into it.
let pictureContainer = document.getElementById("picture-container");

// Get the screen dimensions which are used to grab appropriate pixel resolutions for the images.
let screen_width = parseInt(document.documentElement.clientWidth);
let screen_height = parseInt(document.documentElement.clientHeight);
let screen_metric = 0; // we use the smaller of screen_width and screen_height to base our pixels off of since we are going for a square container.
let row_col_metric = 0; // likewise, if we choose width for our metric, we will focus on rows for setting the pixels per cell (and height if not).
let pixels_per_cell = 200; // sane default, it will get overwritten in the "chooseAGoodPixelResolution" function if one of screen_width or screen_height looks good.

// Used for adding ?random=[num] to the end of the URL to get distinct random images even if two pictures of the same resolution are requested.
let pictureNumber = 1;

// For navigating through all of the gridArea layouts
let currentGridIndex = 0;

// This is a list of dictionaries - with each dictionary containing all
// of the information needed to generate whichever grid layout we want.
let allGridAreas =
[
    // This list starts with the top left picture, or position (0, 0) with x going to the right and y down,
    // and then the grid pictures are ordered from left to right, top to bottom.
    {
        // picture grid index 00
        pos: "(0, 0)",
        rows: 6,
        cols: 6,
        gridAreas: [
        //   rs   cs   re   ce  (row start, col start, row end, col end)
            ['1', '1', '3', '3'],
            ['1', '3', '3', '7'],
            ['3', '1', '5', '5'],
            ['3', '5', '5', '7'],
            ['5', '1', '7', '3'],
            ['5', '3', '7', '7'],
        ]
        // The above arrays inside of gridAreas will be used to set rows/columns later on with javascript.
        // An example of the resulting css from the first array would be:
        // ['1', '1', '3', '3'] => "grid-area: 1 / 1 / 3 / 3"
    },
    {   // picture grid index 01
        pos: "(0, 1)",
        rows: 6,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '3'],
            ['1', '3', '5', '5'],
            ['1', '5', '3', '7'],
            ['3', '1', '7', '3'],
            ['5', '3', '7', '5'],
            ['3', '5', '7', '7'],
        ]
    },
    {   // picture grid index 02
        pos: "(0, 2)",
        rows: 6,
        cols: 6,
        gridAreas: [
            ['1', '1', '5', '5'],
            ['1', '5', '3', '7'],
            ['3', '5', '5', '7'],
            ['5', '1', '7', '3'],
            ['5', '3', '7', '5'],
            ['5', '5', '7', '7'],
        ]
    },
    {   // picture grid index 03
        pos: "(0, 3)",
        rows: 4,
        cols: 5,
        gridAreas: [
            ['1', '1', '2', '3'],
            ['1', '3', '2', '4'],
            ['1', '4', '2', '6'],
            ['2', '1', '3', '2'],
            ['2', '2', '4', '5'],
            ['2', '5', '3', '6'],
            ['3', '1', '4', '2'],
            ['3', '5', '4', '6'],
            ['4', '1', '5', '3'],
            ['4', '3', '5', '4'],
            ['4', '4', '5', '6'],
        ]
    },
    {   // picture grid index 04
        pos: "(0, 4)",
        rows: 6,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '3'],
            ['1', '3', '3', '7'],
            ['3', '1', '5', '3'],
            ['3', '3', '4', '4'],
            ['3', '4', '4', '5'],
            ['4', '3', '5', '4'],
            ['4', '4', '5', '5'],
            ['3', '5', '5', '7'],
            ['5', '1', '7', '5'],
            ['5', '5', '7', '7'],
        ]
    },
    {   // picture grid index 05
        pos: "(1, 0)",
        rows: 4,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '7'],
            ['3', '1', '4', '2'],
            ['3', '2', '4', '3'],
            ['3', '3', '5', '5'],
            ['3', '5', '5', '7'],
            ['4', '1', '5', '3'],
        ]
    },
    {   // picture grid index 06
        pos: "(1, 1)",
        rows: 4,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '5'],
            ['1', '5', '2', '7'],
            ['2', '5', '3', '7'],
            ['3', '1', '4', '3'],
            ['4', '1', '5', '3'],
            ['3', '3', '5', '7'],
        ]
    },
    {   // picture grid index 07
        pos: "(1, 2)",
        rows: 4,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '7'],
            ['3', '1', '4', '3'],
            ['3', '3', '5', '5'],
            ['3', '5', '4', '7'],
            ['4', '5', '5', '7'],
            ['4', '1', '5', '3'],
        ]
    },
    {   // picture grid index 08
        pos: "(1, 3)",
        rows: 5,
        cols: 6,
        gridAreas: [
            ['1', '1', '4', '3'],
            ['1', '3', '2', '4'],
            ['1', '4', '2', '5'],
            ['1', '5', '2', '6'],
            ['4', '1', '5', '2'],
            ['4', '2', '5', '3'],
            ['2', '3', '5', '6'],
            ['5', '1', '7', '3'],
            ['5', '3', '7', '5'],
            ['5', '5', '6', '6'],
            ['6', '5', '7', '6'],
        ]
    },
    {   // picture grid index 09
        pos: "(1, 4)",
        rows: 6,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '4'],
            ['1', '4', '2', '5'],
            ['1', '5', '3', '7'],
            ['2', '4', '3', '5'],
            ['3', '1', '5', '3'],
            ['3', '3', '4', '4'],
            ['3', '4', '5', '7'],
            ['4', '3', '5', '4'],
            ['5', '1', '7', '4'],
            ['5', '4', '6', '5'],
            ['6', '4', '7', '5'],
            ['5', '5', '7', '7'],
        ]
    },
    {   // picture grid index 10
        pos: "(2, 0)",
        rows: 5,
        cols: 5,
        gridAreas: [
            ['1', '1', '5', '6'],
            ['5', '1', '6', '2'],
            ['5', '2', '6', '3'],
            ['5', '3', '6', '4'],
            ['5', '4', '6', '5'],
            ['5', '5', '6', '6'],
        ]
    },
    {   // picture grid index 11
        pos: "(2, 1)",
        rows: 5,
        cols: 5,
        gridAreas: [
            ['1', '1', '6', '2'],
            ['1', '2', '6', '3'],
            ['1', '3', '6', '4'],
            ['1', '4', '6', '5'],
            ['1', '5', '6', '6'],
        ]
    },
    {   // picture grid index 12
        pos: "(2, 2)",
        rows: 5,
        cols: 5,
        gridAreas: [
            ['1', '1', '2', '6'],
            ['2', '1', '3', '6'],
            ['3', '1', '4', '6'],
            ['4', '1', '5', '6'],
            ['5', '1', '6', '6'],
        ]
    },
    {   // picture grid index 13
        pos: "(2, 3)",
        rows: 6,
        cols: 8,
        gridAreas: [
            ['1', '1', '2', '3'],
            ['1', '3', '2', '5'],
            ['1', '5', '4', '7'],
            ['1', '7', '2', '9'],
            ['2', '1', '4', '5'],
            ['2', '7', '3', '9'],
            ['3', '7', '4', '9'],
            ['4', '1', '7', '3'],
            ['4', '3', '5', '5'],
            ['5', '3', '6', '5'],
            ['6', '3', '7', '5'],
            ['4', '5', '7', '9'],
        ]
    },
    {   // picture grid index 14
        pos: "(2, 4)",
        rows: 4,
        cols: 12,
        gridAreas: [
            ['1', '1', '2', '5'],
            ['1', '5', '2', '9'],
            ['1', '9', '2', '13'],
            ['2', '1', '3', '4'],
            ['2', '4', '3', '7'],
            ['2', '7', '3', '10'],
            ['2', '10', '3', '13'],
            ['3', '1', '4', '5'],
            ['3', '5', '4', '9'],
            ['3', '9', '4', '13'],
            ['4', '1', '5', '4'],
            ['4', '4', '5', '7'],
            ['4', '7', '5', '10'],
            ['4', '10', '5', '13'],
        ]
    },
    {   // picture grid index 15
        pos: "(3, 0)",
        rows: 6,
        cols: 8,
        gridAreas: [
            ['1', '1', '3', '9'],
            ['3', '1', '5', '9'],
            ['5', '1', '7', '3'],
            ['5', '3', '6', '5'],
            ['6', '3', '7', '5'],
            ['5', '5', '7', '7'],
            ['5', '7', '6', '9'],
            ['6', '7', '7', '9'],
        ]
    },
    {   // picture grid index 16
        pos: "(3, 1)",
        rows: 4,
        cols: 4,
        gridAreas: [
            ['1', '1', '5', '3'],
            ['1', '3', '2', '5'],
            ['2', '3', '3', '3'],
            ['2', '4', '3', '5'],
            ['3', '3', '4', '5'],
            ['4', '3', '5', '4'],
            ['4', '4', '5', '5'],
        ]
    },
    {   // picture grid index 17
        pos: "(3, 2)",
        rows: 6,
        cols: 6,
        gridAreas: [
            ['1', '1', '3', '3'],
            ['1', '3', '4', '5'],
            ['1', '5', '3', '7'],
            ['3', '1', '5', '3'],
            ['4', '3', '7', '5'],
            ['3', '5', '5', '7'],
            ['5', '1', '7', '3'],
            ['5', '5', '7', '7'],
        ]
    },
    {   // picture grid index 18
        pos: "(3, 3)",
        rows: 6,
        cols: 6,
        gridAreas: [
            ['1', '1', '5', '5'],
            ['1', '5', '3', '7'],
            ['3', '5', '4', '6'],
            ['3', '6', '4', '7'],
            ['4', '5', '5', '6'],
            ['4', '6', '5', '7'],
            ['5', '1', '7', '3'],
            ['5', '3', '6', '5'],
            ['5', '4', '6', '6'],
            ['6', '3', '7', '5'],
            ['6', '4', '7', '6'],
            ['5', '5', '7', '7'],
        ]
    },
    {   // picture grid index 19
        pos: "(3, 4)",
        rows: 6,
        cols: 8,
        gridAreas: [
            ['1', '1', '3', '3'],
            ['1', '3', '3', '5'],
            ['1', '5', '3', '7'],
            ['1', '7', '3', '9'],
            ['3', '1', '5', '3'],
            ['3', '3', '5', '5'],
            ['3', '5', '5', '7'],
            ['3', '7', '5', '9'],
            ['5', '1', '7', '3'],
            ['5', '3', '7', '5'],
            ['5', '5', '7', '7'],
            ['5', '7', '7', '9'],
        ]
    }
];

let numGridAreas = allGridAreas.length;

function nextGridIndex() {
    currentGridIndex++;

    if (currentGridIndex >= numGridAreas)
    {
        currentGridIndex = 0;
        pictureNumber = 1;
    }

    displayPictureGrid();
}

// This will call the changeGridArea function every five seconds.
setInterval(nextGridIndex, FIVE_SECONDS);

function displayPictureGrid() {
    // clear the previous picture grid.
    pictureContainer.innerHTML = "";

    // What is returned is a JS "object" (which is similar to a python dictionary)
    let currentGrid = allGridAreas[currentGridIndex];

    // Sets the headers off to the left.
    indexHeader.innerHTML = "Index: " + currentGridIndex;
    positionHeader.innerHTML = "Position: " + currentGrid.pos;

    let numRows = currentGrid.rows;
    let numCols = currentGrid.cols;

    setGridTemplateRowsAndCols(numRows, numCols);
    chooseAGoodPixelResolution(numRows, numCols);

    // gridAreaParameters is just a list of number characters (i.e. '1' instead of 1)
    // and ['1', '1', '3', '3'] would represent "1 / 1 / 3 / 3" which is what the grid-area: will get set to.
    currentGrid.gridAreas.forEach(gridAreaParameters => {
        if (gridAreaParameters.length != 4)
        {   // We need four arguments to use the numerical version of grid-area
            console.log("Invalid number of grid area parameters. Expected 4, but got: " + gridAreaParameters.length);
            return;
        }

        // Used for grid areas
        var rowStart = gridAreaParameters[0];
        var colStart = gridAreaParameters[1];
        var rowEnd = gridAreaParameters[2];
        var colEnd = gridAreaParameters[3];

        // Used for downloading an image with an appropriate aspect ratio
        var rowSpan = parseInt(rowEnd) - parseInt(rowStart);
        var colSpan = parseInt(colEnd) - parseInt(colStart);

        // As well as an appropriate pixel resolution for that aspect ratio
        var rowPixels = pixels_per_cell * rowSpan;
        var colPixels = pixels_per_cell * colSpan;

        // Our img element to hold our picture
        var newPicture = document.createElement("img");

        // We choose an image with the proper amount of pixels for our column and rows (which is based on our display resolution)
        newPicture.src = "https://picsum.photos/" + colPixels + '/' + rowPixels + "?random=" + pictureNumber;
        newPicture.alt = "A random picture.";

        pictureNumber++;

        // A div to hold out image
        var pictureDiv = document.createElement("div");
        pictureDiv.style.gridArea = rowStart + " / " + colStart + " / " + rowEnd + " / " + colEnd;

        // The picture gets put in the picture div
        pictureDiv.appendChild(newPicture);

        // and the picture div gets put in our grid of pictures
        pictureContainer.appendChild(pictureDiv);
    });
}

function chooseAGoodPixelResolution(numRows, numCols) {
    // if neither of these are true, we use a sane default of 200px for the pixels_per_cell.
    if (screen_width > 0 || screen_height > 0) {
        // we will use the smaller of the screen width and height
        screen_metric = Math.min(screen_width, screen_height);

        // if we choose the width, then we will device by the number of cols
        if (screen_metric == screen_width)
            row_col_metric = numCols;
        else // otherwise, the rows
            row_col_metric = numRows;

        pixels_per_cell = parseInt(screen_metric / row_col_metric);

        // try and get a round number so we aren't requesting something like a 623 by 371 image
        while (pixels_per_cell % 50 != 0)
            pixels_per_cell++;

        console.log(pixels_per_cell);
    }
}

function setGridTemplateRowsAndCols(numRows, numCols) {
    let setGridTemplateRows = "repeat(" + numRows + ", 1fr)";
    let setGridTemplateCols = "repeat(" + numCols + ", 1fr)";

    pictureContainer.style.gridTemplateRows = setGridTemplateRows;
    pictureContainer.style.gridTemplateColumns = setGridTemplateCols;
}

displayPictureGrid(currentGridIndex);