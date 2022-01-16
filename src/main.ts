import Game, { Screen } from './entity/game.js'
import Helicopter from './entity/helicopter.js'
import MouseListener from './mouseListener.js'

const canvas = document.getElementById('game') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const screen: Screen = {
  width: 700,
  height: 300,
}

const game = new Game(canvas, ctx, screen, new Helicopter(screen))

const mouseListener = new MouseListener()
document.addEventListener('mousedown', (e) => mouseListener.notifyAll(e))
document.addEventListener('mouseup', (e) => mouseListener.notifyAll(e))
mouseListener.subscribe((e) => game.onClick(e))
