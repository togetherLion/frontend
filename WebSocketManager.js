// WebSocketManager.js
import { EventEmitter } from 'events'

class WebSocketManager extends EventEmitter {
  constructor() {
    super()
    this.ws = null
  }

  connect(url) {
    if (this.ws) return

    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket connection opened.')
      this.emit('open')
    }

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      this.emit('message', message)
    }

    this.ws.onclose = () => {
      console.log('WebSocket connection closed.')
      this.ws = null
      this.emit('close')
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    }
  }

  send(message) {
    if (this.ws) {
      this.ws.send(JSON.stringify(message))
    }
  }

  close() {
    if (this.ws) {
      this.ws.close()
    }
  }
}

export default new WebSocketManager()
