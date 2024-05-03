// canvas setup
const canvas = document.getElementById("canvas1")
if (canvas == null) {
    console.error("CANVAS ER NULL!!!!")
}
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500

let score = 0
let gameFrame = 0
ctx.font = '50px Georgia'

// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect()

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.x = event.x - canvasPosition.left
    mouse.y = event.y - canvasPosition.top
    console.log(mouse.x, mouse.y)
})

// player
class Player {
    constructor(){
        this.x = canvas.width
        this.y = canvas.height/2
        this.radius = 50
        this.angle = 0
        this.frameX = 0
        this.frameY = 0
        this.frame = 0
        this.spriteWidth = 498
        this.spriteHeight = 327
    }
}

// bubbles
// animation loop