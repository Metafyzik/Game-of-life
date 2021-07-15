
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
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

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

canvas.addEventListener('mousedown', function(e) {
    let coordinatesClick = testClicking.getCursorPosition(canvas, e);
    let coordinatesSquare = testClicking.clickedSquare(coordinatesClick);
})


let testClicking = new Clicking;