
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


function Clicking () {

    // cursor coordinates
    this.getCursorPosition = function  (canvas, event) {
        const rect = canvas.getBoundingClientRect() //#! how does it work?
        const x = event.clientX - rect.left; //#! how does it work?
        const y = event.clientY - rect.top; //#! how does it work?

        //console.log("x: " + x + " y: " + y); //#! clean after

        return [x,y]
       // clickedSquare(x,y)
    }

    // coordinates of sqaure that is clicked into
    this.clickedSquare = function (coordinates) {
        row = Math.floor( coordinates[0] / tileSize );
        column = Math.floor( coordinates[1]  / tileSize );
       
        // console.log(" column " + row + " row = " + column  );  //#! clean after
        
        return [row ,column]
        //drawXO(row * tileSize,column* tileSize)
    }
}

// array containing life cells
let lifeCells = []; 


canvas.addEventListener('mousedown', function(e) { // #! how function(e) actually works
    let coordinatesClick = testClicking.getCursorPosition(canvas, e);
    let coordinatesSquare = testClicking.clickedSquare(coordinatesClick);

    // add or discard from lifeCells and draw
    let isIn = false

    lifeCells.forEach(square => {

        if ((square[0] == coordinatesSquare[0] && square[1] == coordinatesSquare[1])) {
            isIn = true
            console.log("in forEach")
        }  
        console.log(lifeCells)   
    })

    if (isIn == false) {
        lifeCells.push(coordinatesSquare)
        rectangle("rgb(0,255,0)", coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); 
    } else {
        console.log("else")
        lifeCells.pop(coordinatesSquare)
        rectangle("white", coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); 
    }



    //rectangle("rgb(0,255,0)", coordinatesSquare[0]*tileSize, coordinatesSquare[1]*tileSize, tileSize - 1, tileSize - 1); // draw cell
    
})




let testClicking = new Clicking;