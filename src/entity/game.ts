/* eslint-disable no-unused-vars */
import Obstacle from './obstacle.js'
import Helicopter from './helicopter.js'

export type Screen = {
  width: number
  height: number
}

enum GameState {
  RUNNING = 'running',
  PAUSED = 'paused',
  OVER = 'over',
}

export default class Game {
  private canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private player: Helicopter | undefined = undefined
  private score = 0
  private highScore = 0
  private obstacles: Obstacle[] = []
  private _screen: Screen
  private obstaclesInterval: number | undefined = undefined
  private collisionInterval: number | undefined = undefined
  private scoreInterval: number | undefined = undefined
  private status: GameState = GameState.PAUSED

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    screen: Screen,
    player: Helicopter
  ) {
    this.canvas = canvas
    this._ctx = ctx
    this._screen = screen
    this.player = player

    this.ctx.font = '18px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(
      'CLICK TO START',
      this.screen.width / 2,
      this.screen.height / 2 + 20
    )

    this.drawScore()
  }

  get ctx() {
    return this._ctx
  }

  get screen() {
    return this._screen
  }

  public onClick(event: MouseEvent): void {
    const { type } = event

    if (this.status === GameState.RUNNING) {
      this.player?.onClick(event)
      return
    }

    if (type === 'mousedown') {
      this.start()
    }
  }

  private start() {
    this.status = GameState.RUNNING

    if (this.score > this.highScore) {
      this.highScore = this.score
    }

    this.score = 0
    this.obstacles = []

    this.obstaclesInterval = setInterval(() => {
      this.addObstacle()
    }, 1200)

    this.collisionInterval = setInterval(() => {
      this.checkCollision()
    }, 10)

    this.scoreInterval = setInterval(() => {
      this.score += 1
    }, 1000)

    requestAnimationFrame(() => this.update())
  }

  private drawScore() {
    this.ctx.font = '18px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.textAlign = 'start'
    this.ctx.fillText(`Score: ${this.score}`, 10, 30)
    this.ctx.font = '12px Arial'
    this.ctx.fillText(`High Score: ${this.highScore}`, 10, 50)
  }

  private update() {
    this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.player?.draw(this._ctx)

    this.obstacles.forEach((obstacle) => {
      obstacle.draw()
    })

    this.drawScore()

    if (this.status === GameState.OVER) {
      this.ctx.font = '18px Arial'
      this.ctx.fillStyle = '#000'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(
        'GAME OVER',
        this.screen.width / 2,
        this.screen.height / 2
      )
      this.ctx.font = '12px Arial'
      this.ctx.fillText(
        'CLICK TO PLAY AGAIN',
        this.screen.width / 2,
        this.screen.height / 2 + 20
      )
    }

    if (this.status === GameState.RUNNING) {
      requestAnimationFrame(() => this.update())
    }
  }

  private addObstacle() {
    const obstacles = Obstacle.generate(this)
    this.obstacles.push(...obstacles)
  }

  public removeObstacle(obstacle: Obstacle) {
    this.obstacles = this.obstacles.filter((c) => c.id !== obstacle.id)
  }

  private checkCollision() {
    if (!this.player) {
      return
    }

    const x: number = this.player.posX
    const y: number = this.player.posY
    const width: number = this.player.width
    const height: number = this.player.height

    if (y <= 0) {
      this.gameOver()
      return
    }

    if (y >= this.screen.height - height) {
      this.gameOver()
      return
    }

    for (const obstacle of this.obstacles) {
      if (
        x < obstacle.posX + obstacle.width &&
        x + width > obstacle.posX &&
        y < obstacle.posY + obstacle.height &&
        y + height > obstacle.posY
      ) {
        this.gameOver()
        break
      }
    }
  }

  public gameOver() {
    this.status = GameState.OVER
    this.player?.reset()

    clearInterval(this.obstaclesInterval)
    clearInterval(this.collisionInterval)
    clearInterval(this.scoreInterval)
  }
}
