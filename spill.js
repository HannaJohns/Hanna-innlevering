// canvas setup
const canvas = document.getElementById("canvas1")
if (canvas == null) {
    console.error("CANVAS ER NULL!!!!")
}
const ctx = canvas.getContext('2d')
canvas.width = 900
canvas.height = 600

let score = 0
let highscoreEl = document.getElementById("highscore")
let gameFrame = 0
ctx.font = '50px Georgia'
let gameSpeed = 1
let gameOver = false

// highscore
if (!localStorage.highscore) {
    localStorage.highscore=0
}
highscoreEl.innerHTML = `Din highscore: ${localStorage.highscore}`


// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect()

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}
canvas.addEventListener('mousedown', function (event) {
    mouse.click = true
    mouse.x = event.x - canvasPosition.left
    mouse.y = event.y - canvasPosition.top
    //console.log(mouse.x, mouse.y)
})
canvas.addEventListener('mouseup', function () {
    mouse.click = false
})

// Spiller
const playerLeft = new Image()
playerLeft.src = 'bilder/fish_swim_left.png'
const playerRight = new Image()
playerRight.src = 'bilder/fish_swim_right.png'
class Player {
    constructor() {
        this.x = canvas.width
        this.y = canvas.height / 2
        this.radius = 50
        this.angle = 0
        this.frameX = 0
        this.frameY = 0
        this.frame = 0
        this.spriteWidth = 498
        this.spriteHeight = 327
    }
    update() {
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        let theta = Math.atan2(dy, dx)
        this.angle = theta
        if (mouse.x != this.x) {
            this.x -= dx / 30
        }
        if (mouse.y != this.y) {
            this.y -= dy / 30
        }
        if (gameFrame % 5 == 0) {
            this.frame++
            if (this.frame >= 12) this.frame = 0
            if (this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0
            } else {
                this.frameX++
            }
            if (this.frame < 3) this.frameY = 0
            else if (this.frame < 7) this.frameY = 1
            else if (this.frame < 11) this.frameY = 2
            else this.frameY = 0
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            //ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
        }

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
                this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4,
                this.spriteHeight / 4)
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
                this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4,
                this.spriteHeight/4)
        }
        ctx.restore()

    }
}
const player = new Player()


// Bobler
const bubblesArray = []
const bubbleImage = new Image()
bubbleImage.src = 'bilder/bubble_pop_frame_01.png'
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 100 + Math.random() * canvas.height
        this.radius = 50
        this.speed = Math.random() * 5 + 1
        this.distance
        this.counted = false
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'
    }
    update() {
        this.y -= this.speed
        const dx = this.x - player.x
        const dy = this.y - player.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
    }
    draw() {
        ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 2.6, this.radius *2.6)
    }
}

const bubblePop1 = document.createElement('audio')
bubblePop1.src = 'lyd/boble.mp3'
const bubblePop2 = document.createElement('audio')
bubblePop2.src = 'lyd/bubbles-single1.wav'

function handleBubbles() {
    if (gameFrame % 100 == 0) {
        // Hver 50ende frame så pusher vi inn en ny bobble
        bubblesArray.push(new Bubble())
        console.log(bubblesArray.length)
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update()
        bubblesArray[i].draw()
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
            bubblesArray.splice(i, 1)
            i--
        } else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
            if (!bubblesArray[i].counted) {
                if (bubblesArray[i].sound == 'sound1') {
                    bubblePop1.play()
                } else {
                    bubblePop2.play()
                }
                score++
                bubblesArray[i].counted = true
                bubblesArray.splice(i, 1)
                i--
                if (score>localStorage.highscore) {
                    localStorage.highscore=score
                }
            }
        }
    }
}

// Repeterende backgrounds
const background = new Image()
background.src = 'bilder/background1.png'

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground(){
    BG.x1-= gameSpeed
    if (BG.x1 < -BG.width) {BG.x1 = BG.width}
    BG.x2-= gameSpeed
    if (BG.x2 < -BG.width) {BG.x2 = BG.width}
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height)
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height)
}

// Fiender
const enemyImage = new Image()
enemyImage.src = 'bilder/enemy1.png'

class Enemy{
    constructor(){
        this.x = canvas.width + 200
        this.y = Math.random() * (canvas.height - 150) + 90
        this.radius = 60
        this.speed = Math.random() * 2 + 2
        this.frame = 0
        this.frameX = 0
        this.frameY = 0
        this.spriteWidth = 418
        this.spriteHeight = 397
    }
    draw (){
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, 
            this.spriteHeight, this.x - 60, this.y - 70, this.spriteWidth / 3, this.spriteHeight / 3)
    }
    update(){
        this.x -= this.speed
        if(this.x < 0 - this.radius * 2){
            this.x = canvas.width + 200
            this.y = Math.random() * (canvas.height - 150) + 90
            this.speed = Math.random() * 2 + 2
        }
        if (gameFrame % 5 == 0) {
            this.frame++
            if (this.frame >= 12) this.frame = 0
            if (this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0
            } else {
                this.frameX++
            }
            if (this.frame < 3) this.frameY = 0
            else if (this.frame < 7) this.frameY = 1
            else if (this.frame < 11) this.frameY = 2
            else this.frameY = 0
        }
        // kollisjon med spiller
        const dx = this.x - player.x
        const dy = this.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.radius + player.radius){
            handleGameOver()
        }
    }
}
const enemy1 = new Enemy()

const enemies = [];
const maxEnemiesOnScreen = 3

function handleEnemies() {
    if (enemies.length < maxEnemiesOnScreen && gameFrame % 50 == 0) {
        enemies.push(new Enemy())
    }
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw()
        enemies[i].update()
        if (enemies[i].x < 0 - enemies[i].radius * 2) {
            enemies.splice(i, 1)
            i--;
        }
    }
}


function handleGameOver(){
    ctx.fillStyle = 'white'
    ctx.fillText('GAME OVER, du nådde scoren ' + score, 100, 250)
    ctx.fillText('Press ENTER for å spille igjen', 140, 350)
    gameOver = true

    highscoreEl.innerHTML = `Din highscore: ${localStorage.highscore}`

    const playAgainButton = document.createElement('button')
    playAgainButton.classList.add('play-again-button')
    playAgainButton.innerHTML = '<i class="fas fa-play"></i> Play Again'
    canvas.parentNode.appendChild(playAgainButton)

    playAgainButton.addEventListener('click', function(){
        if (gameOver) {
            location.reload()
        }
    })
}

// animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleBackground()
    handleBubbles()
    player.update()
    player.draw()
    handleEnemies()
    ctx.fillStyle = 'black'
    ctx.fillText('score: ' + score, 10, 50)
    gameFrame += 1
    // console.log(gameFrame)
    if (!gameOver) requestAnimationFrame(animate)
}
animate()

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect()
})

window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && gameOver) {
        location.reload()
    }
})