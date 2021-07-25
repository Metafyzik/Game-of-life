
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
let NewBornCells = []; 

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
    alldeadllsNeighbors = [] // duplicite values

    // for every cells count coordinates of moore neighborhood 
    this.mooreNeighborhood = function (square) { //! terminology
        let neighborSquares = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]; //#! 

        for (let i = 0; i < neighborSquares.length; i++) {
            neighborSquares[i][0] += square[0];
            neighborSquares[i][1] += square[1];
        }
        
        return neighborSquares    
    }
    // count how many cells in moore neighborhood of (particular cells) and lifeCells are equal
    // add all dead cell from moore neighborhood of a live cells 
    this.lifeCellsAround = function (lifeCells,neighborSquares) {
        
        let surrondingLifecells = 0;// amount of live cells surronding live cell #! better name
        
        for (let i = 0; i < neighborSquares.length; i++) { // time complexity n*m
            isInlifeCells = false
            for (let j = 0; j < lifeCells.length; j++) {
                if (lifeCells[j][0] == neighborSquares[i][0] && lifeCells[j][1] == neighborSquares[i][1]) {
                    surrondingLifecells += 1;
                    isInlifeCells = true           
                }
            }
            if (isInlifeCells==false){
                // adding dead cell from moore neighborhood of a live cell
                alldeadllsNeighbors.push(neighborSquares[i]) 
            }

        }
        return surrondingLifecells
    }

    this.PopOrStay = function (surrondingLifecells) { // #! suboptimal name
        //nsole.log(surrondingLifecells)
       //onsole.log((surrondingLifecells >= 2 && surrondingLifecells <= 3))
        return surrondingLifecells >= 2 && surrondingLifecells <= 3
    }

    this.popDeadCells = function (square) {
        //console.log(square)
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
                    //console.log("numberTimesInArra",numberTimesInArray)
                }
            }
            if (numberTimesInArray == 3) { // check three live neighbors
                // check if cell is not already in NewBornCells
                let isInNewBornCells = false
                for (cell of newBornCells) {
                    if ( JSON.stringify(alldeadllsNeighbors[i]) == JSON.stringify(cell) ) {
                        isInNewBornCells = true
                    }
                }
                if (isInNewBornCells == false) {
                newBornCells.push(alldeadllsNeighbors[i])  
                }

            }
            numberTimesInArray = 0;
        } 
        return newBornCells
    }            
    
}



// testing initNullGen
let initialize = new initNullGen;

// testing appRules
let testappRules = new appRules;
lifeCells = [[9,8],[9,9],[9,10]]
lifeCells = lifeCells.filter(testappRules.popDeadCells)

newBornCells = testappRules.newBornCells()
console.log(newBornCells)
// listeners
document.addEventListener("keydown", initialize.pressEnter) 

canvas.addEventListener('mousedown',function (e) {
    initialize.mouseClick(canvas, e); 
})    




