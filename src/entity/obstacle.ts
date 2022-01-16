/* eslint-disable no-unused-vars */
import Game from './game.js'

enum Position {
  UP,
  DOWN,
}

export default class Obstacle {
  private _id: string
  private _posX: number
  private _posY: number
  private _width: number = 100
  private _height: number = 100
  private game: Game

  constructor(game: Game, position: Position, height: number) {
    this.game = game
    this._id = new Date().getTime().toString()
    this._posX = this.game.screen.width - this._width
    this._height = height

    if (position === Position.UP) {
      this._posY = 0
    } else {
      this._posY = this.game.screen.height - this._height
    }

    this.move()
  }

  get id(): string {
    return this._id
  }

  get posX(): number {
    return this._posX
  }

  get posY(): number {
    return this._posY
  }

  get width(): number {
    return this._width
  }

  get height(): number {
    return this._height
  }

  public static generate(game: Game): [Obstacle, Obstacle] {
    const randomHeight = Math.random() * (game.screen.height - 100 - 0) + 0

    return [
      new Obstacle(game, Position.UP, randomHeight),
      new Obstacle(
        game,
        Position.DOWN,
        game.screen.height - randomHeight - 100
      ),
    ]
  }

  public draw(): void {
    this.game.ctx.fillStyle = '#0095DD'
    this.game.ctx.fillRect(this.posX, this.posY, this._width, this._height)
  }

  private move() {
    this._posX -= this._width / 20

    if (this._posX >= -this._width) {
      setTimeout(() => {
        this.move()
      }, 20)

      return
    }

    this.destroy()
  }

  private destroy() {
    this.game.removeObstacle(this)
  }
}
