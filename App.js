import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer, View, StatusBar } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LogBox } from 'react-native'

import SignupScreen from './Screens/SignupScreen.js'
import Place from './Screens/Place.js'
import Phone from './Screens/Phone.js'
import MyPage from './Screens/MyPage.js'
import Login from './Screens/Login.js'
import UserInform from './Screens/UserInform.js'
import EditAccount from './Screens/EditAccount.js'
import EditPhone from './Screens/EditPhone.js'
import EditName from './Screens/EditName.js'
import EditAddress from './Screens/EditAddress.js'
import Profile from './Screens/Profile.js'
import EditPassword from './Screens/EditPassword.js'
import Withdraw from './Screens/Withdraw.js'
import Complain from './Screens/Complain.js'
import Following from './Screens/Following.js'
import Follower from './Screens/Follower.js'
import PostListScreen from './Screens/PostListScreen.js'
import Alarmlist from './Screens/Alarmlist.js'
import PostCreateScreen from './Screens/PostCreateScreen.js'

import FirstScreen from './Screens/first'
import FindIdScreen from './Screens/findId'
import FindPwScreen from './Screens/findPw'
import CompleteIdScreen from './Screens/completeId'
import CompletePwScreen from './Screens/completePw'
import ProgressScreen from './Screens/progress'
import WaitingTableScreen from './Screens/waitingTable'
import ChatButtonScreen from './Screens/chatButton'
import ChatRoomScreen from './Screens/chatRoom'

import { WebSocketProvider } from './context/WebSocketContext'
import { MessageProvider } from './context/MessageContext'

const Stack = createStackNavigator()

export default function App() {
  if (__DEV__) {
    LogBox.ignoreAllLogs(true)
  }

  return (
    <WebSocketProvider>
      <MessageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="First"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Place" component={Place} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="Phone" component={Phone} />
            <Stack.Screen name="MyPage" component={MyPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="UserInform" component={UserInform} />
            <Stack.Screen name="EditAccount" component={EditAccount} />
            <Stack.Screen name="EditPhone" component={EditPhone} />
            <Stack.Screen name="EditName" component={EditName} />
            <Stack.Screen name="EditAddress" component={EditAddress} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditPassword" component={EditPassword} />
            <Stack.Screen name="Withdraw" component={Withdraw} />
            <Stack.Screen name="Complain" component={Complain} />
            <Stack.Screen name="Following" component={Following} />
            <Stack.Screen name="Follower" component={Follower} />
            <Stack.Screen name="PostListScreen" component={PostListScreen} />
            <Stack.Screen name="Alarmlist" component={Alarmlist} />
            <Stack.Screen
              name="PostCreateScreen"
              component={PostCreateScreen}
            />

            <Stack.Screen name="First" component={FirstScreen} />
            <Stack.Screen name="FindId" component={FindIdScreen} />
            <Stack.Screen name="FindPw" component={FindPwScreen} />
            <Stack.Screen name="CompleteId" component={CompleteIdScreen} />
            <Stack.Screen name="CompletePw" component={CompletePwScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="WaitingTable" component={WaitingTableScreen} />
            <Stack.Screen name="ChatButton" component={ChatButtonScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </MessageProvider>
    </WebSocketProvider>
  )
}
