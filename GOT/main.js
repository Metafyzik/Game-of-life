
// drawing functionality
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGrid() {
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                "black",
                tileSize * i,
                tileSize * j,
                tileSize - 1,
                tileSize - 1
            );
        }
    }
}

function initNullGen () {
    this.getCursorPosition = function  (canvas, event) {
        const rect = canvas.getBoundingClientRect() //#! how does it work?
        const x = event.clientX - rect.left; //#! how does it work?
        const y = event.clientY - rect.top; //#! how does it work?

        return [x,y]
    }
    // coordinates of sqaure that is clicked into
    this.clickedSquare = function (coordinates) {
        row = Math.floor( coordinates[0] / tileSize );
        column = Math.floor( coordinates[1]  / tileSize );
        
        return [row ,column]
    }
    // check if clicked square is in lifeCells
    this.checkCLick = function (coordinatesSquare) { 
        let isInlifeCells = false

        lifeCells.forEach(square => { 
            if (JSON.stringify(square) == JSON.stringify(coordinatesSquare)) {
                isInlifeCells = true;
            }   
        })

        return isInlifeCells;
    }
    // push or pop cell from lifeCells
    this.pushPopCell = function (isInlifeCells, coordinatesSquare) {           
        if (isInlifeCells == false) {
            lifeCells.push(coordinatesSquare)
        } else {
            lifeCells.pop(coordinatesSquare)
        }
    }
    // draw new cell or redraw poped cell back to canvas color 
    this.drawRedrawCell = function (isInlifeCells, coordinatesSquare) {
        let color;
        if (isInlifeCells == false) {
            color = "rgb(0,255,0)"
        } else {
            color = "black"
        }

        rectangle(color, coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); 
    }
    // clicking into canvas
    this.addLiveCells = function (canvas, e) { //#! Name is bad because doesnt express that it also poping and I alread have pushPopCell as a method so I need to make more sophisticated changes
        let coordinatesClick = this.getCursorPosition(canvas, e);
        let coordinatesSquare = this.clickedSquare(coordinatesClick);
    
        let isInlifeCells = this.checkCLick(coordinatesSquare);
        this.pushPopCell(isInlifeCells, coordinatesSquare);
        this.drawRedrawCell(isInlifeCells, coordinatesSquare);
    }
}

function appRules () {
    alldeadllsNeighbors = []
    // for every cells count coordinates of moore neighborhood 
    this.mooreNeighborhood = function (square) { //! terminology
        let neighborSquares = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]; //#! 

        for (neighborSquare of neighborSquares) {
            neighborSquare[0] += square[0];
            neighborSquare[1] += square[1];
        }
        
        return neighborSquares    
    }
    // count how many cells in moore neighborhood of (particular cells) and lifeCells are equal
    // add all dead cell from moore neighborhood of a live cells 
    this.lifeCellsAround = function (lifeCells,neighborSquares) { //#! try to change name of method to refcted the ectended functionalit fo that method
        
        let surrondingLifecells = 0;// amount of live cells surronding live cell #! better name
            
        for (neighorSquare of neighborSquares) { // time complexity n*m
            isInlifeCells = false
            for (lifeCell of lifeCells) {
                if (JSON.stringify(lifeCell) == JSON.stringify(neighorSquare)) {
                    surrondingLifecells += 1;
                    isInlifeCells = true           
                }
            }
            if (isInlifeCells==false){
                // adding dead cell from moore neighborhood of a live cell
                alldeadllsNeighbors.push(neighorSquare) 
            }
        }
        return surrondingLifecells
    }

    this.PopOrStay = function (surrondingLifecells) { // #! suboptimal name
        return surrondingLifecells >= 2 && surrondingLifecells <= 3
    }

    this.popDeadCells = function (square) {
        let neighborSquares = testappRules.mooreNeighborhood(square)
        let surrondingLifecells = testappRules.lifeCellsAround(lifeCells,neighborSquares)

        return testappRules.PopOrStay(surrondingLifecells)

    }
    this.newBornCells = function () {
        let newBornCells = [];
        let numberTimesInArray = 0;

        for (let i = 0; i < alldeadllsNeighbors.length; i++) { //n*n
            for (let j = 0; j < alldeadllsNeighbors.length; j++) {
                if ( JSON.stringify(alldeadllsNeighbors[i]) == JSON.stringify(alldeadllsNeighbors[j]) ) {
                    numberTimesInArray += 1;
                }
            }
            if (numberTimesInArray == 3) { // check three live neighbors
                // check if cell is not already in NewBornCells
                let isInNewBornCells = false
                for (cell of newBornCells) {
                    if (JSON.stringify(alldeadllsNeighbors[i]) == JSON.stringify(cell)) {
                        isInNewBornCells = true
                    }
                }
                if (isInNewBornCells == false) {
                newBornCells.push(alldeadllsNeighbors[i])  
                }

            }
            numberTimesInArray = 0;
        }
        alldeadllsNeighbors = []; // empty for next generation 
        return newBornCells
    }            
    
}

function Game () {
        let liveCellColor = "rgb(0,255,0)";
        let canvasColor = "rgb(0,0,0)";
        let surviveCells = []; 
        let NewBornCells = [];
        let interval = 1000;

    this.gameLoop = e => {
        if (e.keyCode === 13) { // enter press -> start generation cycle
            // prevent clicking new cell after start
            canvas.removeEventListener('mousedown',ClickCanvas)
            
            setInterval(function run() {
                //redraw previous generaton
                for (cell of lifeCells) {
                    rectangle(canvasColor, cell[0]*tileSize, cell[1]*tileSize, tileSize - 1, tileSize - 1); 
                }

                surviveCells = lifeCells.filter(testappRules.popDeadCells); //#! change name to survive
                newBornCells = testappRules.newBornCells();
                lifeCells = surviveCells.concat(newBornCells);
                
                // draw new generation
                for (cell of lifeCells) {
                    rectangle(liveCellColor, cell[0]*tileSize, cell[1]*tileSize, tileSize - 1, tileSize - 1); 
                }
            }, interval);
            
        }
    }
}

//#! make global variables out of color so that changing it need only one variable
// canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const tileSize = 15;
const tileCountX = canvas.width = window.innerWidth;
const tileCountY = canvas.height = window.innerHeight;

// drawing green background in size of the canvas 
rectangle("green", 0, 0, canvas.width, canvas.height); 
// white squares in to black canvas to create grid 
drawGrid();
// array containing life cells
let lifeCells = []; //#! Why not use object {x:number,y: number}, rename to liveCells

//! name and place of creating instances
let initialize = new initNullGen;
let testappRules = new appRules; 
let game = new Game;

// event listeners
canvas.addEventListener('mousedown',ClickCanvas)

function ClickCanvas(e) {
    initialize.addLiveCells(canvas, e);     
}

document.addEventListener("keydown", game.gameLoop)








