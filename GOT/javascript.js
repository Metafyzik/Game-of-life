
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