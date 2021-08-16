// drawing functionality
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGrid(color) {
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                color,
                tileSize * i,
                tileSize * j,
                tileSize - 1,
                tileSize - 1
            );
        }
    }
}

const initNullGen = {
    getCursorPosition : function  (canvas, event) {
        const rect = canvas.getBoundingClientRect() //#! how does it work?
        const x = event.clientX - rect.left; //#! how does it work?
        const y = event.clientY - rect.top; //#! how does it work?

        return [x,y]
    },
    // coordinates of sqaure that is clicked into
    clickedSquare : function (coordinates) {
        row = Math.floor( coordinates[0] / tileSize );
        column = Math.floor( coordinates[1]  / tileSize );
        
        return [row ,column]
    },
    // check if clicked square is in lifeCells
    checkCLick : function (coordinatesSquare) { 
        let isInlifeCells = false

        lifeCells.forEach(square => { 
            if (JSON.stringify(square) == JSON.stringify(coordinatesSquare)) {
                isInlifeCells = true;
            }   
        })
        return isInlifeCells;
    },
    // push or pop cell from lifeCells
    pushPopCell : function (isInlifeCells, coordinatesSquare) {           
        if (isInlifeCells == false) {
            lifeCells.push(coordinatesSquare)
        } else {
            lifeCells.pop(coordinatesSquare)
        }
    },
    // draw new cell or redraw poped cell back to canvas color 
    drawRedrawCell : function (isInlifeCells, coordinatesSquare) {
        let color;
        if (isInlifeCells == false) {
            color = colorCell
        } else {
            color = colorCanvas
        }

        rectangle(color, coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); 
    },
    // clicking into canvas
    addLiveCells : function (canvas, e) { //#! Name is bad because doesnt express that it also poping and I alread have pushPopCell as a method so I need to make more sophisticated changes
        let coordinatesClick = this.getCursorPosition(canvas, e);
        let coordinatesSquare = this.clickedSquare(coordinatesClick);
    
        let isInlifeCells = this.checkCLick(coordinatesSquare);
        this.pushPopCell(isInlifeCells, coordinatesSquare);
        this.drawRedrawCell(isInlifeCells, coordinatesSquare);
    },
}

const appRules = {
    alldeadllsNeighbors : [],
    // for every cells count coordinates of moore neighborhood 
    mooreNeighborhood : function(square) { //! terminology
        let neighborSquares = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]; //#! 

        for (neighborSquare of neighborSquares) {
            neighborSquare[0] += square[0];
            neighborSquare[1] += square[1];
        }
        
        return neighborSquares    
    },
    // count how many cells in moore neighborhood of (particular cells) and lifeCells are equal
    // add all dead cell from moore neighborhood of a live cells 
    lifeCellsAround : function (lifeCells,neighborSquares) { //#! try to change name of method to refcted the ectended functionalit fo that method
        
        let surrondingLifecells = 0;// amount of live cells surronding live cell #! better name
            
        for (neighorSquare of neighborSquares) { // time complexity n*m
            isInlifeCells = false
            for (lifeCell of lifeCells) {
                if (JSON.stringify(lifeCell) == JSON.stringify(neighorSquare)) {
                    surrondingLifecells += 1;
                    isInlifeCells = true;           
                }
            }
            if (isInlifeCells==false){
                // adding dead cell from moore neighborhood of a live cell
                this.alldeadllsNeighbors.push(neighorSquare); 
            }
        }
        return surrondingLifecells
    },

    PopOrStay : function (surrondingLifecells) { // #! suboptimal name
        return surrondingLifecells >= 2 && surrondingLifecells <= 3;
    },

    popDeadCells : function (square) {
        
        let neighborSquares = appRules.mooreNeighborhood(square);
        let surrondingLifecells = appRules.lifeCellsAround(lifeCells,neighborSquares);

        return appRules.PopOrStay(surrondingLifecells)

    },
    newBornCells : function () {
        let newBornCells = [];
        let inArray = 0;
        let a = null;
        this.alldeadllsNeighbors.sort();

        for (deadCell of this.alldeadllsNeighbors) {
            if (a == null) {
              a = deadCell;
            } else if (JSON.stringify(a) == JSON.stringify(deadCell)) {
              inArray += 1;
              a = deadCell; 
            } else {
              if (inArray == 2) {newBornCells.push(a);}                
              a = deadCell; 
              inArray = 0;   
            }
        }
        // end of loop
        if (inArray == 2) {newBornCells.push(deadCell)}
        this.alldeadllsNeighbors = []; //empty for next generation
        return newBornCells
    }               
}

const Game = {
    surviveCells : [], 
    NewBornCells : [], //!
    interval : 1000,

    gameLoop : function () {
        if (true) { // enter press -> start generation cycle
            // prevent clicking new cell after start
            canvas.removeEventListener('mousedown',ClickCanvas)
            
            setInterval(function run() {
                //redraw previous generaton
                for (cell of lifeCells) {
                    rectangle(colorCanvas, cell[0]*tileSize, cell[1]*tileSize, tileSize - 1, tileSize - 1); 
                }

                this.surviveCells = lifeCells.filter(appRules.popDeadCells);
                this.newBornCells = appRules.newBornCells();
                lifeCells = surviveCells.concat(newBornCells);
                
                // draw new generation
                for (cell of lifeCells) {
                    rectangle(colorCell, cell[0]*tileSize, cell[1]*tileSize, tileSize - 1, tileSize - 1); 
                }
            }, this.interval);
            
        }
    }
}

// Get the modal
var modal = document.getElementById("myModal");
// When the user clicks on <span> (x), close the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


//#! make global variables out of color so that changing it need only one variable
// canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const tileSize = 15;
const tileCountX = canvas.width = window.innerWidth;
const tileCountY = canvas.height = window.innerHeight;

const colorCanvas = "rgb(0,0,0)"
const colorCell = "rgb(0,255,0)"
// drawing green background in size of the canvas 
rectangle(colorCell, 0, 0, canvas.width, canvas.height); 
// white squares in to black canvas to create grid 
drawGrid(colorCanvas);
// array containing life cells
let lifeCells = []; //#! Why not use object {x:number,y: number}, rename to liveCells

//! name and place of creating instances,
/* let initialize = new initNullGen;
let testappRules = new appRules; 
let game = new Game; */

// event listeners
canvas.addEventListener('mousedown',ClickCanvas);

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) { Game.gameLoop()}
})

function ClickCanvas(e) {
    initNullGen.addLiveCells(canvas, e);     
}


//if (e.keyCode === 13)




