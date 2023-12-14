import React, {Component, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class Sidebar extends Component {
  state = {
    
  };
 
  render() {

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#EBEBEB'
        }}>
        <ScrollView>
         
        </ScrollView>
      </SafeAreaView>
    );
  }
}


export default Sidebar;

const styles = StyleSheet.create({
  halfcir: {
    alignSelf: 'center',
    backgroundColor: '#1d1d1b',
    borderRadius: 200,
    transform: [{scaleX: 2}],
    height: hp('30%'),
    width: wp('40%'),
    marginTop: hp('-15%'),
  },
  dp: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('-8%'),
  },
  userdetails: {marginTop: hp('1%')},
  username: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('4%'),
    paddingTop: hp('0.5%'),
    textTransform: 'capitalize',
  },
  usertype: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('3.5%'),
    // paddingTop: hp('0.5%'),
    textTransform: 'uppercase',
  },
  bodycontainr: {marginHorizontal: wp('10%'), marginTop: hp('2%')},
  bodyview: {flexDirection: 'row', marginVertical: hp('1%')},
  icontext: {
    fontFamily: 'Montserrat-Bold',
  },
  txtview: {
    left: 12,
  },
  txt: {
    fontFamily: 'Montserrat-Medium',
  },
});




