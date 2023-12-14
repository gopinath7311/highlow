import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../../splash/splash';
import Register from '../../auth/register/register';
import Login from '../../auth/login/login';
import Home from '../../dashboard/home/home';
import History from '../../dashboard/history/history';

const Stack = createNativeStackNavigator();
class Authnavigator extends Component {
  state = {};
  render() {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="splash">
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name='login' component={Login}/>
        <Stack.Screen name='home' component={Home}/>
        <Stack.Screen name='history' component={History}/>
      </Stack.Navigator>
    );
  }
}

export default Authnavigator;
