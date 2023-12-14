import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import authService from '../../services/authService';
import { ImageBackground } from 'react-native';
import update_auth from '../../redux/actions/authAction';
class Splash extends Component {
  state = {};

  async componentDidMount() {
    update_auth()
    setTimeout(async () => {
      const data = await authService.getCurrentUser();
      if (data && data.userid) {
        this.props.navigation.navigate('home');

      } else {
this.props.navigation.navigate('login');
      }
     
    }, 1000);
  }

  render() {
    return (
      <SafeAreaView>
        <ImageBackground source={require('../../assets/images/splash.png')}  style={styles.container}>
       
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    height: '100%',

  },
  gamelogo: {
    alignSelf: 'center',
    top:hp('20%')
   
  },
  gametext: {
    fontFamily: 'Lobster-Regular',
    fontSize: 50,
    color: '#cfc756',
  },
  text:{
    position:'absolute',
    color:"white",
    fontFamily:"YoungSerif-Regular",
    fontSize:40,
    top:hp('39%'),
    left:wp('30%'),
    
  },
  text1:{
    position:'absolute',
    color:"white",
    fontFamily:"YoungSerif-Regular",
    fontSize:39,
    top:hp('39%'),
    right:wp('30%'),
    
  }
});
