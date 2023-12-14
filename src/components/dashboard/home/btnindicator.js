import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

let numberOfButtons=[]
for(let i=1;i<=21;i++){
  numberOfButtons.push(i)
}
class Numindicator extends Component {
  render() {
    const {highlightedButton} = this.props;
    return (
      <View style={styles.container}>
        {numberOfButtons.map((style, index) => (
          <View style={{flexDirection: 'row'}} key={index}>
            {highlightedButton === index + 1 ? (
              <Text
                style={{
                  color: '#068fc8',
                  fontWeight: 'bold',
                  top: -5,
                  right: 10,
                }}>
                {highlightedButton}
              </Text>
            ) : (
              <Text></Text>
            )}
            <View
              key={index}
              style={[
                styles.button,
                {
                  backgroundColor:
                    highlightedButton === index + 1
                      ? '#068fc8'
                      : index + 1 < highlightedButton
                      ? 'yellow'
                      : 'orange',
                  right: highlightedButton === index + 1 ? 8 : highlightedButton>9? -8:0,
                },
              ]}></View>
          </View>
        ))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: hp('2.3%'),
  },
  button: {
    width: wp('7%'),
    height: hp('1.3%'),
    //marginBottom: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default Numindicator;
