
// canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const tileSize = 15;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;


// drawing background
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


rectangle("black", 0, 0, canvas.width, canvas.height);  
drawGrid();

// array containing life cells
let lifeCells = []; 

function initNullGen () {
        // cursor coordinates
        this.getCursorPosition = function  (canvas, event) {
            const rect = canvas.getBoundingClientRect() //#! how does it work?
            const x = event.clientX - rect.left; //#! how does it work?
            const y = event.clientY - rect.top; //#! how does it work?
    
            //console.log("x: " + x + " y: " + y); //#! clean after
    
            return [x,y]
        }
    
        // coordinates of sqaure that is clicked into
        this.clickedSquare = function (coordinates) {
            row = Math.floor( coordinates[0] / tileSize );
            column = Math.floor( coordinates[1]  / tileSize );
           
            // console.log(" column " + row + " row = " + column  );  //#! clean after
            
            return [row ,column]

        }

        this.checkCLick = function (coordinatesSquare) { 
            // 1. check if it is in coordinates is in lifeCells
            // 2. add or discard from lifeCells 
            // 3. draw green redraw white   

            // check if clicked square is in lifeCells
            let isInlifeCells = false

            lifeCells.forEach(square => { 
                if ((square[0] == coordinatesSquare[0] && square[1] == coordinatesSquare[1])) {
                    isInlifeCells = true;
                }   
            })
            
            // push and draw green or pop and redraw white
            if (isInlifeCells == false) {
                lifeCells.push(coordinatesSquare)
                rectangle("rgb(0,255,0)", coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); // #! shouldnt be here 
            } else {
                lifeCells.pop(coordinatesSquare)
                rectangle("white", coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); // #! shouldnt be here 
            }
        }

        // clicking into canvas
        this.mouseClick = function (canvas, e) {
            let coordinatesClick = this.getCursorPosition(canvas, e);
            let coordinatesSquare = this.clickedSquare(coordinatesClick);
        
            this.checkCLick(coordinatesSquare);
        }

}

let initialize = new initNullGen;

canvas.addEventListener('mousedown',function (e) {
    initialize.mouseClick(canvas, e); 
})    




