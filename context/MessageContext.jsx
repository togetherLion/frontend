import React, { createContext, useReducer, useContext } from 'react'

// 메시지 상태 관리용 Context 생성
const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

// 메시지 상태 관리용 리듀서 함수
const messageReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        [action.roomId]: [...(state[action.roomId] || []), action.message],
      }
    case 'SET_MESSAGES':
      return { ...state, [action.roomId]: action.messages }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

// 메시지 상태를 제공하는 Provider 컴포넌트
export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, {})

  return (
    <MessageStateContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageStateContext.Provider>
  )
}

// 메시지 상태를 사용하는 커스텀 훅
export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)