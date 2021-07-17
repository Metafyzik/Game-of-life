
// canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const tileSize = 15;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;


// drawing functionality
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}


function drawGrid() {
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                "white",
                tileSize * i,
                tileSize * j,
                tileSize - 1,
                tileSize - 1
            );
        }
    }
}

// drawing black background in size of the canvas 
rectangle("black", 0, 0, canvas.width, canvas.height); 
// white squares in to black canvas to create grid 
drawGrid();

// array containing life cells
let lifeCells = []; 

function initNullGen () {
        // cursor coordinates
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

            if (lifeCells.length > 0) { // for case of empty lifeCells //#! if this special condition is nedeed

                lifeCells.forEach(square => { 
                    if (square[0] == coordinatesSquare[0] && square[1] == coordinatesSquare[1]) {
                        isInlifeCells = true;
                    }   
                })
            }
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

        // draw new cell or redraw poped cell back to white 
        this.drawRedrawCell = function (isInlifeCells, coordinatesSquare) {
            let color;
            if (isInlifeCells == false) {
                color = "rgb(0,255,0)"
            } else {
                color = "white"
            }
            rectangle(color, coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); 
        }

        // clicking into canvas
        this.mouseClick = function (canvas, e) {
            let coordinatesClick = this.getCursorPosition(canvas, e);
            let coordinatesSquare = this.clickedSquare(coordinatesClick);
        
            let isInlifeCells = this.checkCLick(coordinatesSquare);
            this.pushPopCell(isInlifeCells, coordinatesSquare);
            this.drawRedrawCell(isInlifeCells, coordinatesSquare);
            
        }

        // pressing enter to start the game
        this.pressEnter = function (e) {
            if (e.keyCode === 13) {
                console.log( "eneter has been pressed")  
            }
        }    
}



function appRules () {

    //for every cells count coordinates of moore neighborhood 
    this.mooreNeighborhood = function (square) { //! terminology
        let neighborSquares = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]; //#! 

        neighborSquares.forEach(neighborSquare => { 
            neighborSquare = [square[0] + neighborSquare[0],square[1] + neighborSquare[1]]
        })
        console.log("neighborSquares = ",neighborSquares)
        return neighborSquares
    }    
}





let initialize = new initNullGen;

let testappRules = new appRules;

testappRules.mooreNeighborhood([9,9])

// listeners
document.addEventListener("keydown", initialize.pressEnter) 

canvas.addEventListener('mousedown',function (e) {
    initialize.mouseClick(canvas, e); 
})    




