import React, { Component } from 'react';
import { View, Text ,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Authnavigator from './components/navigations/authstack/authnavigator';


class Mian extends Component {
    state = {  } 
    render() { 
        return (
            <NavigationContainer>
            <Authnavigator/>
         </NavigationContainer>
       
        );
    }
}
 
export default Mian;