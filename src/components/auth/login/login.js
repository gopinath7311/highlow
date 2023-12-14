import React, {Component} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showToast} from '../../../services/toastService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import authService from '../../../services/authService';
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import Joi from 'joi-browser';
import update_auth from '../../../redux/actions/authAction';

class Login extends Component {
  state = {
    password: '',
    phone: '',
    buttonDisabled: true,
    buttonshow: true,
    isLoading: false,
    passwordVisible: false,
  };
  schema = Joi.object().keys({
    phone: Joi.string()
      .min(10)
      .max(10)
      .regex(/^[6789]\d{9}$/)
      .error(() => {
        return {
          message: 'Enter Correct Number',
        };
      })
      .required(),
    password: Joi.string()
      .min(8)
      .max(15)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/)
      .error(() => {
        return {
          message:
            'Password at least 8 characters and below 15 characters, atleast one number and atleast one capital letter and one special character',
        };
      })
      .required(),
  });
componentDidMount(){
  this.setState({password:"",phone:""})
}
  onSubmit = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({buttonDisabled: true, buttonshow: false});

    const validata = Joi.validate(
      {
        password: this.state.password,
        phone: this.state.phone,
      },
      this.schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;

        val = err.details[0].context.key;
        return reter;
      },
    );
    if (validata) {
      await this.setState({errors: validata});

      showToast('error', this.state.errors);
      this.loadingButton.showLoading(false);
      await this.setState({buttonDisabled: true, buttonshow: true});
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
      }, 2000);
    } else {
      await this.setState({errors: ''});
      try {
        const obj = {
          phone: this.state.phone,
          password: this.state.password,
        };

        const data = await authService.login(obj);

        if (data) {
          Toast.show({
            type: 'success',
            text1: 'Welcome',
            text2: data.message,
          });
          update_auth();
          setTimeout(() => {
            this.props.navigation.push('home');
          }, 1000);
          
          await this.setState({loginbtn: false});
          this.loadingButton.showLoading(false);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          showToast('error', ex.response.data);
          this.loadingButton.showLoading(false);
        }
        setTimeout(() => {
          this.loadingButton.showLoading(false);
          this.setState({loginbtn: false});
        }, 1000);
      }
    }
  };
  seepassword = () => {
    this.setState({passwordVisible: !this.state.passwordVisible});
  };
  phone = async phone => {
    if (
      phone[0] == 0 ||
      /[`~!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ§₼$៛₡✓•△¶∆\{\}\[\]\\\/]/.test(
        phone,
      )
    ) {

      showToast('error', 'please enter valid number');

    } else if (phone.includes(' ')) {
      showToast('error', 'spaces are not allowed in phone number');
    } else {
      await this.setState({phone: phone});
    }
  };
  render() {
    return (
      <View style={styles.main}>
        <View style={styles.circle}></View>
        <View style={styles.circle1}></View>
        <Toast />
        <View style={styles.gamelogo}>
          <Text style={styles.gametext}>HI</Text>
          <Text
            style={[
              styles.gametext,
              {marginLeft: 20, color: '#008000', marginTop: -20},
            ]}>
            LO
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={{fontFamily: 'YoungSerif-Regular', alignSelf: 'center'}}>
            LOGIN
          </Text>
          <View style={styles.inputContianer}>
            <TextInput
              placeholder="Enter Phone Number"
              placeholderTextColor={'#ffffff'}
              cursorColor={'#ffffff'}
              maxLength={10}
              style={styles.textinput}
              value={this.state.phone}
              keyboardType="numeric"
              onChangeText={e => this.phone(e)}
            />
          </View>
          <View style={styles.inputContianer}>
            <View style={styles.inputbox}>
              <TextInput
                placeholder="Enter Your Password"
                placeholderTextColor={'#ffffff'}
                cursorColor={'#ffffff'}
                maxLength={15}
                style={[styles.textinput, {width: wp('60')}]}
                value={this.state.password}
                secureTextEntry={this.state.passwordVisible ? false : true}
                onChangeText={e => this.setState({password: e})}
              />
              {this.state.passwordVisible === false ? (
                <TouchableOpacity onPress={() => this.seepassword('passowrd')}>
                  <Image
                    style={styles.eye}
                    source={require('../../../assets/images/eyeclose.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.seepassword('passowrd')}>
                  <Image
                    style={styles.eye}
                    source={require('../../../assets/images/eyeopen.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.ButtonWrapper}>
            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={wp('50%')}
              height={hp('7%')}
              backgroundColor="#19afd1"
              justifyContent="center"
              alignItems="center"
              borderRadius={10}
              titleFontFamily="Montserrat-SemiBold"
              title="LOGIN"
              titleFontSize={hp('2.3%')}
              titleColor="white"
              onPress={this.onSubmit.bind(this)}
            />
          </View>
          <TouchableOpacity
            style={{alignSelf: 'center', top: 20}}
            onPress={() => this.props.navigation.push('register')}>
            <Text style={{color: '#96969d'}}>
              Don't Have an account?{' '}
              <Text style={{color: '#0f6c8b', textDecorationLine: 'underline'}}>
                Register
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Login;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    
  },
  container: {
    width: wp('75%'),
    height: hp('50%'),
    top: hp('25%'),
    alignSelf: 'center',
  },
  textinput: {
    backgroundColor: '#7477ff',
    color: 'white',
    borderRadius: 10,
   
  },

  inputContianer: {
    marginTop: hp('4%'),
  },
  inputHeader: {
    color: '#bdc3ce',
    fontWeight: 'bold',
  },
  ButtonWrapper: {
    flexDirection: 'row',
    marginTop: hp('6%'),
    alignSelf: 'center',
  },
  eye: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 15,
  },
  inputbox: {
    flexDirection: 'row',
    backgroundColor: '#7477ff',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  circle: {
    //left: wp('40%'),
    backgroundColor: '#66baff',
    width: hp('30%'),
    height: hp('30%'),
    borderRadius: hp('30%'),
    position: 'absolute',
    top: hp('-17%'),
    // zIndex: 1,
  },
  circle1: {
    left: wp('40%'),
    backgroundColor: '#7477ff',
    width: hp('45%'),
    height: hp('45%'),
    borderRadius: hp('45%'),
    position: 'absolute',
    top: hp('-17%'),
    zIndex: -1,
  },
  gamelogo: {
    alignSelf: 'center',
    top: hp('24%'),
  },
  gametext: {
    fontFamily: 'Lobster-Regular',
    fontSize: 40,
    color: '#cfc756',
  },
});
