/* eslint-disable no-unused-vars */
import { Screen } from './game'

const image = new Image()
image.src = '/images/helicopter.png'

enum Direction {
  UP,
  DOWN,
}

export default class Helicopter {
  readonly height: number = 10
  readonly width: number = 40
  readonly posX: number = 20
  public posY: number
  private direction: Direction | null = null
  private screen: Screen

  constructor(screen: Screen) {
    this.screen = screen
    this.posY = this.screen.height / 2 - this.height

    this.move()
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#0095DD'
    ctx.drawImage(image, this.posX, this.posY)
  }

  public onClick(event: MouseEvent): void {
    const { type } = event

    if (type === 'mousedown') {
      this.direction = Direction.UP
      return
    }

    this.direction = Direction.DOWN
  }

  public reset(): void {
    this.posY = this.screen.height / 2 - this.height
    this.direction = null
  }

  private up(): void {
    if (this.posY <= 0) {
      return
    }

    this.posY -= this.height / 3
  }

  private down(): void {
    if (this.posY >= this.screen.height - this.height) {
      return
    }

    this.posY += this.height / 3
  }

  private move(): void {
    if (this.direction === Direction.UP) {
      this.up()
    } else if (this.direction === Direction.DOWN) {
      this.down()
    }

    setTimeout(() => this.move(), 20)
  }
}
