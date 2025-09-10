// import { EventEmitter } from 'events'

// class WebSocketManager extends EventEmitter {
//   constructor() {
//     super()
//     this.ws = null
//   }

//   connect(url) {
//     if (this.ws) return

//     this.ws = new WebSocket(url)

//     this.ws.onopen = () => {
//       console.log('WebSocket connection opened.')
//       this.emit('open')
//     }

//     this.ws.onmessage = (event) => {
//       const message = JSON.parse(event.data)
//       this.emit('message', message)
//     }

//     this.ws.onclose = () => {
//       console.log('WebSocket connection closed.')
//       this.ws = null
//       this.emit('close')
//     }

//     this.ws.onerror = (error) => {
//       console.error('WebSocket error:', error)
//       this.emit('error', error)
//     }
//   }

//   send(message) {
//     if (this.ws) {
//       this.ws.send(JSON.stringify(message))
//     }
//   }

//   close() {
//     if (this.ws) {
//       this.ws.close()
//     }
//   }
// }

// export default new WebSocketManager()


import { EventEmitter } from 'events'

class WebSocketManager extends EventEmitter {
  constructor() {
    super()
    this.ws = null
  }

  connect(url) {
    // 이미 연결 중이거나 연결되어 있으면 return
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket connection opened.')
      this.emit('open')
    }

    this.ws.onmessage = (event) => {
      let message
      try {
        message = JSON.parse(event.data)
      } catch (err) {
        console.error('WebSocket message parse error:', err)
        message = event.data
      }
      this.emit('message', message)
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed.')
      this.ws = null
      this.emit('close', event)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not open. Message not sent:', message)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export default new WebSocketManager()
