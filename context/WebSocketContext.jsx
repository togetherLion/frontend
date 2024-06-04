import React, { createContext, useReducer, useContext } from 'react'
import WebSocketManager from '../WebSocketManager'

const WebSocketStateContext = createContext()
const WebSocketDispatchContext = createContext()

const websocketReducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      WebSocketManager.connect(action.payload)
      return { ...state, connected: true }
    case 'DISCONNECT':
      WebSocketManager.disconnect()
      return { ...state, connected: false }
    case 'SEND':
      WebSocketManager.send(action.payload)
      return state
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

export const WebSocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(websocketReducer, { connected: false })

  return (
    <WebSocketStateContext.Provider value={state}>
      <WebSocketDispatchContext.Provider value={dispatch}>
        {children}
      </WebSocketDispatchContext.Provider>
    </WebSocketStateContext.Provider>
  )
}

export const useWebSocketState = () => useContext(WebSocketStateContext)
export const useWebSocketDispatch = () => useContext(WebSocketDispatchContext)
