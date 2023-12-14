import React, {Component} from 'react';
import {
  AppRegistry,
  BackHandler,
  Alert,
  StyleSheet,
  View,
  StatusBar,
  Text,
    ToastAndroid,
    BackAndroid
} from 'react-native';
import Main from './src/main';

import SplashScreen from 'react-native-splash-screen';


class App extends Component {
  componentDidMount(){
    SplashScreen.hide();
    backAction=()=>{
      Alert.alert("stop","Are you sure you want to exit app?",[
        {
          text:'Cancel',
          onPress:()=>null,
          style:'cancel'
        },
        {
          text:"YES",
          onPress:()=>BackHandler.exitApp()
        }
      ])
      return true
    }
   const backHandler=BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )
  }
  
 
  render() {
    return <Main/>
  }
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b3078',
  },
});

AppRegistry.registerComponent('App', () => App);
