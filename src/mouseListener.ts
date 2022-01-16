export type Observer = (event: MouseEvent) => void

export default class MouseListener {
  private observers: Observer[] = []

  constructor() {
    this.observers = []
  }

  subscribe(observerFunction: Observer) {
    this.observers.push(observerFunction)
  }

  notifyAll(event: MouseEvent) {
    this.observers.forEach((observerFunction) => observerFunction(event))
  }
}
