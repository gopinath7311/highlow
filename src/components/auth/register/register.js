import React, {Component} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showToast} from '../../../services/toastService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import authService from '../../../services/authService';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';

import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import Joi from 'joi-browser';

class Register extends Component {
  state = {
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    buttonDisabled: true,
    buttonshow: true,
    isLoading: false,
    isChecked: false,
    isModalVisible: false,
    passwordVisible: false,
    confirmpasswordVisible: false,
  };
  schema = Joi.object().keys({
    phone: Joi.string()
      .min(10)
      .max(10)
      .regex(/^[6789]\d{9}$/)
      .error(() => {
        return {
          message: 'Please Enter Valid Phone Number',
        };
      })
      .required(),
    name: Joi.string().min(3).max(30).required(),
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
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({language: {any: {allowOnly: 'Must Match Password'}}}),

    isChecked: Joi.boolean()
      .valid(true)
      .error(() => {
        return {
          message: 'Please Accept Terms & Conditions',
        };
      })
      .required(),
  });
  toggleModal = async () => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  onSubmit = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({buttonDisabled: true, buttonshow: false});

    const validata = Joi.validate(
      {
        name: this.state.name,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        phone: this.state.phone,
        isChecked: this.state.isChecked,
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
          name: this.state.name,
          password: this.state.password,
          phone: this.state.phone,
        };

        const data = await authService.register(obj);

        if (data) {
          Toast.show({
            type: 'success',
            text1: 'HI',
            text2: data,
          });
          setTimeout(() => {
            this.props.navigation.push('login');
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
          this.setState({loginbtn: false});
        }, 1000);
      }
    }
  };
  seepassword = pass => {
    if (pass == 'passowrd') {
      this.setState({passwordVisible: !this.state.passwordVisible});
    } else {
      this.setState({
        confirmpasswordVisible: !this.state.confirmpasswordVisible,
      });
    }
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
  name = async name => {
    if (
      name[0] === '0' ||
      /[`~0-9!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ§₼$៛₡✓•△¶∆\{\}\[\]\\\/]/.test(
        name,
      )
    ) {
      showToast('error', 'Please enter a correct name');
    } else if (name.includes(' ')) {
      showToast('error', 'spaces are not allowed in name');
    } else {
      await this.setState({name: name});
    }
  };

  render() {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#f2f2f2', '#e6ffff', '#ffebcc', '#500852']}
        style={{flex: 1}}>
        <View style={styles.circle}></View>
        <View style={styles.circle1}></View>
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
            REGISTRATION
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} style={{height:hp('40')}}>
            <View style={{marginBottom: 100}}>
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
                <TextInput
                  placeholder="Enter Your Name"
                  maxLength={20}
                  placeholderTextColor={'#ffffff'}
                  cursorColor={'#ffffff'}
                  style={styles.textinput}
                  value={this.state.name}
                  onChangeText={e => this.name(e)}
                />
              </View>
              <View style={styles.inputContianer}>
                <View style={styles.inputbox}>
                  <TextInput
                    placeholder="Set Your Password"
                    placeholderTextColor={'#ffffff'}
                    cursorColor={'#ffffff'}
                    maxLength={15}
                    style={[styles.textinput, {width: 240}]}
                    value={this.state.password}
                    secureTextEntry={this.state.passwordVisible ? false : true}
                    onChangeText={e => this.setState({password: e})}
                  />
                  {this.state.passwordVisible === false ? (
                    <TouchableOpacity
                      onPress={() => this.seepassword('passowrd')}>
                      <Image
                        style={styles.eye}
                        source={require('../../../assets/images/eyeclose.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.seepassword('passowrd')}>
                      <Image
                        style={styles.eye}
                        source={require('../../../assets/images/eyeopen.png')}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.inputContianer}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#7477ff',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                  }}>
                  <TextInput
                    placeholder="Confirm Your Password"
                    maxLength={15}
                    placeholderTextColor={'#ffffff'}
                    cursorColor={'#ffffff'}
                    style={[styles.textinput, {width: 240}]}
                    value={this.state.confirmPassword}
                    secureTextEntry={
                      this.state.confirmpasswordVisible ? false : true
                    }
                    onChangeText={e => this.setState({confirmPassword: e})}
                  />
                  {this.state.confirmpasswordVisible === false ? (
                    <TouchableOpacity onPress={() => this.seepassword()}>
                      <Image
                        style={styles.eye}
                        source={require('../../../assets/images/eyeclose.png')}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.seepassword()}>
                      <Image
                        style={styles.eye}
                        source={require('../../../assets/images/eyeopen.png')}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  textAlignVertical: 'center',
                  marginTop: 15,
                }}>
                <CheckBox
                  onClick={() => {
                    this.setState({
                      isChecked: !this.state.isChecked,
                    });
                  }}
                  isChecked={this.state.isChecked}
                  checkBoxColor={'#ff3385'}
                  style={{marginLeft: wp('3.5%'), marginRight: wp('1%')}}
                />
                <View>
                  <Text
                    style={{
                      fontSize: hp('1.7%'),
                      color: '#404040',
                    }}>
                    I am 18 years old and i have read and accept
                  </Text>
                  <TouchableOpacity onPress={() => this.toggleModal()}>
                    <Text
                      style={{
                        color: '#11526d',
                        textDecorationLine: 'underline',
                      }}>
                      {' '}
                      Terms and Conditions
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
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
            title="REGISTER"
            titleFontSize={hp('2.3%')}
            titleColor="white"
            onPress={this.onSubmit.bind(this)}
          />
        </View>
        <TouchableOpacity
          style={styles.logintext}
          onPress={() => this.props.navigation.navigate('login')}>
          <Text style={{color: '#e0e0eb'}}>
            Have an account?{' '}
            <Text
              style={{
                color: '#19afd1',
                textDecorationLine: 'underline',
              }}>
              Login
            </Text>
          </Text>
        </TouchableOpacity>
        <Toast />
        <Modal
          visible={this.state.isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={this.toggleModal}>
          <View>
            <View style={styles.bottomPopUp}>
              <ScrollView contentContainerStyle={styles.modalcontent}>
                <Text style={styles.header}>Terms and Conditions</Text>
                <View style={styles.content}>
                  <Text style={styles.paragraph}>
                    Before playing this game, you must confirm that you are at
                    least 18 years old. By continuing to play or access this
                    game, you acknowledge and agree to the following terms and
                    conditions:
                  </Text>
                  <Text style={styles.paragraph}>
                    1. <Text style={styles.bold}>Age Requirement:</Text> You
                    must be at least 18 years old to play this game. If you are
                    not 18 years old, you are prohibited from accessing or
                    playing the game.
                  </Text>
                  <Text style={styles.paragraph}>
                    2. <Text style={styles.bold}>Verification:</Text> We may use
                    various methods to verify your age. This may include but is
                    not limited to providing your date of birth,
                    government-issued identification, or other forms of age
                    verification.
                  </Text>
                  <Text style={styles.paragraph}>
                    3. <Text style={styles.bold}>Accuracy of Information:</Text>{' '}
                    You are responsible for providing accurate and truthful
                    information regarding your age. Providing false information
                    may result in immediate suspension or termination of your
                    access to the game.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.donebtn}
                  onPress={() => this.toggleModal()}>
                  <Text style={{fontWeight: 'bold', color: 'red'}}>CLOSE</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
}

export default Register;
const styles = StyleSheet.create({
  main: {
    flex: 1,
   
  },
  container: {
    width: wp('75%'),
    alignSelf: 'center',
    top: hp('22'),
  },
  textinput: {
    backgroundColor: '#7477ff',
    color: 'white',
    borderRadius: 10,
  },

  inputContianer: {
    marginTop: hp('2%'),
  },
  inputHeader: {
    color: '#bdc3ce',
    fontWeight: 'bold',
  },
  ButtonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('10%'),
  },
  bottomPopUp: {
    position: 'absolute',
    top: hp('20%'),
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: hp('70%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalcontent: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 16,
  },
  paragraph: {
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  eye: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 20,
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
    //zIndex: -1,
  },
  logintext: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: hp('5%'),
  },
  gamelogo: {
    alignSelf: 'center',
    top: hp('23%'),
  },
  gametext: {
    fontFamily: 'Lobster-Regular',
    fontSize: 40,
    color: '#cfc756',
  },
});
