import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import Joi from 'joi-browser';
import Toast from 'react-native-toast-message';
import {showToast} from '../../../services/toastService';
import ConfettiCannon from 'react-native-confetti-cannon';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
const bgm = require('../../../assets/music/night-city.mp3');
const btnclick = require('../../../assets/music/button.mp3');
const win = require('../../../assets/music/success.mp3');
const loss = require('../../../assets/music/loss2.mp3');
import {
  UIActivityIndicator,
  WaveIndicator,
  MaterialIndicator,
} from 'react-native-indicators';
import {NumericFormat} from 'react-number-format';
import gameservice from '../../../services/gameservice';
import {Icon} from 'react-native-elements';
import Numindicator from './btnindicator';
import authService from '../../../services/authService';
import ToggleSwitch from 'toggle-switch-react-native';
import admincontroService from '../../../services/admincontroService';
import { backEndCallObj } from '../../../services/allservices';
import { backEndCall } from '../../../services/allservices';

var whoosh = new Sound(bgm, error => {
  if (error) {
    return;
  } else {
    whoosh.setNumberOfLoops(-1);
    whoosh.setVolume(0.5);
  }
});
var btnplay = new Sound(btnclick, error => {
  if (error) {
    return;
  } else {
    btnplay.setPan(1);
  }
});
var victory = new Sound(win, error => {
  if (error) {
    return;
  } else {
    btnplay.setPan(1);
  }
});
var gameloss = new Sound(loss, error => {
  if (error) {
    return;
  } else {
    btnplay.setPan(1);
  }
});
class Home extends Component {
  state = {
    startingNum: '',
    previousNum: '',
    gameId: '',
    gameStatus: '',
    balance: '',
    isModalVisible: false,
    hiBtn: false,
    equalBtn: false,
    loBtn: false,
    toggle: true,
    value: 2,
    odds: '',
    totalwins: '',
    ticketview: true,
    gameRulesView: false,
    menubtn: false,
    infobtn: false,
    disableall: false,
    shuffledis: false,
    sound: false,
    debitedBal: '',
    soundbtn: false,
    costDisEnb: false,
  };
  schema = Joi.object().keys({
    value: Joi.number()
      .error(() => {
        return {
          message: 'Choose Ticket Cost',
        };
      })
      .required(),
    balance: Joi.number()
      .min(1)
      .error(() => {
        return {
          message: 'add balance',
        };
      })
      .required(),
      
  });
  async componentDidMount() {
    try {
      const data = await gameservice.startingnumber();
      this.setState({
        startingNum: data.number,
        gameId: data.gameId,
        balance: data.userBalance,
      });
      this.guessDisable(data.number);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        showToast('error', ex.response.data);
        this.setState({
          disableall: false,
          hiBtn: false,
          lobtn: false,
          equalBtn: false,
        });
      }
    }

    this.adminControls();
    if (this.state.sound) {
      whoosh.play();
    }
    this.disableGoingBack();
  }
  adminControls = async () => {
    try {
      const controls = await admincontroService.getadmincontrols();
      this.setState({odds: controls.odds});
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        showToast('error', ex.response.data);
      }
    }
  };
  callguessNum = async obj => {
    let debitedBal = this.state.balance - this.state.value;

    if (debitedBal < 1) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Insufficient balance.',
      //   autoHide: 'true',
      //   visibilityTime: 2000,
      // });
    } else {
      this.setState({
        balance: '',
        debitedBal: this.state.balance - this.state.value,
      });
      
    }
    try {
      const data = await gameservice.guessnum(obj);
      //const data = await callBackendObj('game/guess/',obj);

      this.setState({
      startingNum: data.Number,
      gameStatus: data.status,
      gameId: data.betid,
      });
      this.guessDisable(data.Number);
      this.gameResult();
      if (this.state.sound) {
        if (data.status == 'win'){
          //this.explosion && this.explosion.start();
      victory.play();
        }else{
          gameloss.play()
        }
      }
      
      } catch (ex) {
      if (ex.response && ex.response.status === 400) {
      showToast('error', ex.response.data);
      this.setState({
      disableall: false,
      hiBtn: false,
      loBtn: false,
      equalBtn: false,
      });
      }
      }
    
  };
  guessNum = async guess => {
    if (this.state.sound) {
      btnplay.play();
    }
    const validata = Joi.validate(
      {
        value: this.state.value,
        balance: this.state.balance,
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
      await this.setState({
        errors: validata,
        disableall: false,
        hiBtn: false,
        loBtn: false,
        equalBtn: false,
      });

      showToast('error', this.state.errors);
    } else {
      this.setState({
        previousNum: this.state.startingNum,
        startingNum: '',
        gameStatus: '',
        disableall: true,
      });
      const obj = {
        betAmount: this.state.value,
        gameId: this.state.gameId,
        userGuess: guess,
      };
      if (guess == 'high') {
        this.setState({loBtn: true, equalBtn: true});

        this.callguessNum(obj);
      } else if (guess == 'low') {
        this.callguessNum(obj);
        this.setState({hiBtn: true, equalBtn: true});
      } else {
        this.callguessNum(obj);
        this.setState({hiBtn: true, loBtn: true});
      }
    }
  };
  gameResult = async () => {
    try {
      obj = {
        betid: this.state.gameId,
      };
      const data = await gameservice.guessdata(obj)
      this.setState({
        balance: data.user.balance,
        totalwins: data.historydata[0].amountWon,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        showToast('error', ex.response.data);
      }
    }
  };
  toggleOn = async tg => {
    await this.setState({
      //toggle: !this.state.toggle,
    });
  };
  logout = async props => {
    Toast.show({
      type: 'success',
      text1: 'Logging out',
      autoHide: 'true',
      visibilityTime: 3000,
    });
    this.setState({isModalVisible: !this.state.isModalVisible});
    const data = await authService.logout(props);
  };
  guessDisable = data => {
    if (data >= 21) {
      this.setState({hiBtn: true, equalBtn: false, loBtn: false});
      Toast.show({
        type: 'success',
        text1: 'You cannot choose HI',
        autoHide: 'true',
        visibilityTime: 5000,
      });
    } else if (data <= 1) {
      this.setState({loBtn: true, equalBtn: false, hiBtn: false});
      Toast.show({
        type: 'success',
        text1: 'You cannot choose LO',
        autoHide: 'true',
        visibilityTime: 5000,
      });
    } else {
      this.setState({hiBtn: false, loBtn: false, equalBtn: false});
    }
    setTimeout(() => {
      this.setState({disableall: false});
    }, 1000);
  };
  toggleModal = async () => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      menubtn: !this.state.menubtn,
    });
    setTimeout(() => {
      this.setState({menubtn: false});
    }, 2000);
  };
  gameSetting = async set => {
    if (set === 'ticketcost') {
      this.setState({ticketview: true, gameRulesView: false});
    } else {
      this.setState({gameRulesView: true, ticketview: false});
    }
    this.setState({infobtn: true});
    setTimeout(() => {
      this.setState({infobtn: false});
    }, 700);
  };
  history = () => {
    this.props.navigation.navigate('history');
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  shuffle = async () => {
    this.setState({shuffledis: true, gameStatus: ''});
    try {
      const data = await gameservice.startingnumber()
      this.setState({
        startingNum: data.number,
        gameId: data.gameId,
        balance: data.userBalance,
      });
      this.guessDisable(data.number);

      this.setState({shuffledis: false});
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        showToast('error', ex.response.data);
        this.setState({
          disableall: false,
          hiBtn: false,
          lobtn: false,
          equalBtn: false,
          shuffledis: false,
        });
      }
    }
    // setTimeout(() => {
    //   this.setState({shuffledis: false});
    // }, 1000);
  };
  controlSound = () => {
    this.setState({sound: !this.state.sound, soundbtn: true});
    if (this.state.sound) {
      whoosh.stop();
    } else {
      whoosh.play();
    }
    setTimeout(() => {
      this.setState({soundbtn: false});
    }, 2000);
  };
  disableGoingBack = () => {
    backAction = () => {
      Alert.alert('stop', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
  };
  costIncDec = res => {
    this.setState({costDisEnb: true});
    if (res === 'dec') {
      this.setState({value: this.state.value - 1});
    } else {
      this.setState({value: this.state.value + 1});
    }
    setTimeout(() => {
      this.setState({costDisEnb: false});
    }, 1000);
  };
  render() {
    return (
      <ImageBackground
        source={require('../../../assets/images/hilobg.jpg')}
        style={{flex: 1}}>
        <View style={{flexDirection: 'row', top: 10, left: wp('3%')}}>
          <Icon name="person" type="FontAwesome5" color={'white'} />
          <Text style={{color: '#e7e7e7', fontFamily: 'YoungSerif-Regular'}}>
            {this.props?.auth?.name}
          </Text>
        </View>
        {this.state.previousNum ? (
          <Text style={styles.prevNum}>{this.state.previousNum}</Text>
        ) : (
          <Text style={styles.previousLine}>-</Text>
        )}

        <View style={{left: wp('9%'), top: hp('10%')}}>
          <Text style={styles.previousText}>previous</Text>
          <Text style={styles.previousText}>Number</Text>
        </View>
        <Text style={styles.shuffletext}>Shuffle</Text>
        <TouchableOpacity
          style={styles.shuffle}
          disabled={this.state.shuffledis}
          onPress={() => this.shuffle()}>
          {this.state.shuffledis ? (
            <MaterialIndicator color="white" />
          ) : (
            <Icon type="Ionicons" name="shuffle" color={'white'} />
          )}
        </TouchableOpacity>
        <View style={styles.startNum}>
          {this.state.startingNum !== '' ? (
            <Animatable.Text
              animation="bounceInDown"
              duration={200}
              style={{
                color: 'white',
                fontSize: 80,
                alignSelf: 'center',
                fontFamily: 'Lobster-Regular',
              }}>
              {this.state.startingNum}
            </Animatable.Text>
          ) : (
            <WaveIndicator color="pink" size={50} />
          )}
          <Animatable.Text
            animation="swing"
            duration={200}
            style={{
              color: 'white',
              fontSize: 50,
              alignSelf: 'center',
              fontFamily: 'YoungSerif-Regular',
            }}>
            {this.state.gameStatus}
          </Animatable.Text>
        </View>
        <ConfettiCannon
          count={200}
          origin={{x: 170, y: 50}}
          autoStart={false}
          ref={ref => (this.explosion = ref)}
        />
        <View style={styles.header}>
          <View style={styles.headerView}>
            <Text style={styles.footerText}>BALANCE</Text>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="currency-rupee"
                type="MaterialCommunityIcons"
                color={'white'}
                size={15}
                style={{top: 2}}
              />
              {this.state?.balance ? (
                <NumericFormat
                  value={this.state.balance ? this.state.balance : 0}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={styles.footerText}>{value}</Text>
                  )}
                />
              ) : (
                <NumericFormat
                  value={this.state.debitedBal ? this.state.debitedBal : 0}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={styles.footerText}>{value}</Text>
                  )}
                />
              )}
            </View>
          </View>
          <View style={styles.headerView}>
            <Text style={styles.footerText}>TOTAL WINS</Text>

            <NumericFormat
              value={this.state?.totalwins ? this.state?.totalwins : 0}
              displayType={'text'}
              thousandSeparator={true}
              thousandsGroupStyle={'thousand'}
              decimalScale={2}
              fixedDecimalScale={true}
              renderText={value => (
                <Text style={styles.footerText}>{value}</Text>
              )}
            />
          </View>
          <View style={styles.headerView}>
            <Text style={styles.footerText}>TICKET COST</Text>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="currency-rupee"
                type="MaterialCommunityIcons"
                color={'white'}
                size={15}
                style={{top: 2}}
              />
              <NumericFormat
                value={this.state.value ? this.state.value : 0}
                displayType={'text'}
                thousandSeparator={true}
                thousandsGroupStyle={'thousand'}
                decimalScale={2}
                fixedDecimalScale={true}
                renderText={value => (
                  <Text style={styles.footerText}>{value}</Text>
                )}
              />
            </View>
          </View>
        </View>
        <View style={styles.togglePosition}>
          <ToggleSwitch
            isOn={this.state.toggle}
            onColor="#b3b3b3"
            offColor="#b3b3b3"
            labelStyle={{
              color: 'white',
              fontWeight: '900',
              borderColor: 'white',
            }}
            size="medium"
            onToggle={isOn => this.toggleOn(isOn)}
            circleColor={'#040707'}
          />
        </View>
        <View style={{left: wp('10%'), top: hp('38%')}}>
          <Text
            style={{
              color: !this.state.toggle ? '#be7421' : 'white',
              marginBottom: hp('6%'),
              fontFamily: 'Montserrat-Medium',
            }}>
            Prizes
          </Text>
          <Text
            style={{
              color: this.state.toggle ? '#be7421' : 'white',
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Odds
          </Text>
        </View>
        <View style={styles.rupeecard}>
          <Text
            style={{
              color: '#be7421',
              fontWeight: '500',
              fontFamily: 'Montserrat-SemiBold',
            }}>
            {this.state.toggle ? 'Odds' : 'Prize'}
          </Text>
          <View style={styles.rupess}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {this.state?.odds?.equal}
            </Text>
          </View>
        </View>
        <View style={[styles.rupeecard, {left: wp('78'), bottom: hp('15')}]}>
          <Text
            style={{
              color: '#be7421',
              fontWeight: '500',
              fontFamily: 'Montserrat-SemiBold',
            }}>
            {this.state.toggle ? 'Odds' : 'Prize'}
          </Text>
          <View style={styles.rupess}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {this.state?.odds?.low}
            </Text>
          </View>
        </View>
        <View style={[styles.rupeecard, {left: wp('77'), bottom: hp('28')}]}>
          <Text style={{color: '#be7421', fontWeight: '500'}}>
            {this.state.toggle ? 'Odds' : 'Prize'}
          </Text>
          <View style={styles.rupess}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {this.state?.odds?.high}
            </Text>
          </View>
        </View>
        <Modal
          visible={this.state.isModalVisible}
          //animationType="slide"
          transparent={true}
          onRequestClose={this.toggleModal}>
          <View>
            <View style={styles.bottomPopUp}>
              <Text style={{color: 'white', alignSelf: 'center'}}>HILO</Text>
              <TouchableOpacity
                disabled={this.state.infobtn}
                style={[
                  styles.coin,
                  {borderWidth: this.state.ticketview ? 3 : 0},
                ]}
                onPress={() => this.gameSetting('ticketcost')}>
                <Icon type="FontAwesome5" name="attach-money" color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.infobtn}
                onPress={() => this.gameSetting()}
                style={[
                  styles.coin,
                  {
                    top: hp('24%'),
                    borderWidth: this.state.gameRulesView ? 3 : 0,
                  },
                ]}>
                <Icon type="FontAwesome5" name="info-outline" color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.soundbtn}
                onPress={() => this.setState(() => this.controlSound())}
                style={[styles.coin, {top: hp('35%'), borderWidth: 0}]}>
                <Icon
                  type="FontAwesome5"
                  name={this.state.sound ? 'volume-up' : 'volume-off'}
                  color={'white'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.history()}
                style={[styles.coin, {top: hp('45%'), borderWidth: 0}]}>
                <Icon type="FontAwesome5" name="history" color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.logout(this.props)}
                style={[styles.coin, {top: hp('55%'), borderWidth: 0}]}>
                <Icon type="FontAwesome5" name="logout" color={'white'} />
              </TouchableOpacity>
              {this.state.ticketview ? (
                <View style={styles.gameadj}>
                  <View>
                    <Text style={styles.gameadjText}>Game Adjustments</Text>
                    <View style={styles.line}></View>
                  </View>

                  <View style={styles.slider}>
                    <Text style={styles.ticketText}>Ticket Cost</Text>
                    <Slider
                      step={1}
                      style={{width: '100%'}}
                      thumbTintColor={'white'}
                      minimumValue={1}
                      maximumValue={30}
                      minimumTrackTintColor="#66ccff"
                      maximumTrackTintColor="white"
                      value={this.state.value}
                      onValueChange={value => this.setState({value})}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          disabled={
                            this.state.value == 1 || this.state.costDisEnb
                          }
                          onPress={() => this.costIncDec('dec')}
                          style={styles.incTicket}>
                          <Icon
                            name="remove"
                            color={'#ff4d4d'}
                            type="Ionicons"
                            size={31}
                          />
                        </TouchableOpacity>
                        <Text style={{color: 'white'}}>Cost</Text>
                        <Icon
                          name="currency-rupee"
                          type="MaterialCommunityIcons"
                          color={'white'}
                          size={15}
                          style={{top: 2, left: 2}}
                        />
                        <Text style={{color: 'white'}}>{this.state.value}</Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Icon
                          name="currency-rupee"
                          type="MaterialCommunityIcons"
                          color={'white'}
                          size={15}
                          style={{top: 2, left: 2}}
                        />
                        <Text style={{color: 'white'}}>30</Text>
                        <TouchableOpacity
                          disabled={
                            this.state.value == 30 || this.state.costDisEnb
                          }
                          onPress={() => this.costIncDec()}
                          style={styles.decTicket}>
                          <Icon
                            name="add"
                            color={'green'}
                            type="Ionicons"
                            size={30}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <ScrollView style={{width: wp('75%')}}>
                  <View style={{marginTop: hp('10%')}}>
                    <View>
                      <Text style={{color: 'white'}}>HOW TO PLAY</Text>
                      <View style={styles.rulescont}></View>
                      <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={styles.playCont}></View>
                        <Text style={{color: 'white', left: 10}}>
                          Select the price per ticket.
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          width: wp('70%'),
                        }}>
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 5,
                            backgroundColor: 'white',
                            marginTop: 5,
                          }}></View>
                        <Text style={{color: 'white', left: 10}}>
                          Press the HI,LO,or EQUAl button to purchase a ticket
                          and reveal a number.
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          width: wp('70%'),
                        }}>
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 5,
                            backgroundColor: 'white',
                            marginTop: 5,
                          }}></View>
                        <Text style={{color: 'white', left: 10}}>
                          If the number revealed matches the option you chose,
                          win the prize shown.
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          width: wp('70%'),
                        }}>
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 5,
                            backgroundColor: 'white',
                            marginTop: 5,
                          }}></View>
                        <Text style={{color: 'white', left: 10}}>
                          Odds and Prizes change based on the current number
                          shown.
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: 'white',
                          width: wp('70%'),
                          height: 1,
                          marginTop: 5,
                        }}></View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          width: wp('70%'),
                        }}>
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 5,
                            backgroundColor: '#cfc756',
                            marginTop: 5,
                          }}></View>
                        <Text style={{color: 'white', left: 10}}>
                          HI win if the number revealed is HIGHER than the
                          previous number.
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          width: wp('70%'),
                        }}>
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 5,
                            backgroundColor: '#d55d42',
                            marginTop: 5,
                          }}></View>
                        <Text style={{color: 'white', left: 10}}>
                          LO win if the number revealed is LOWER than the
                          previous number.
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          width: wp('70%'),
                        }}>
                        <View style={styles.playCont}></View>
                        <Text style={{color: 'white', left: 10}}>
                          EQUAL win if the number revealed is EQUAL than the
                          previous number.
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.more}
                onPress={() => this.toggleModal()}>
                <Icon name="cancel" type="Entypo" color={'white'} size={40} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.more}
          disabled={this.state.menubtn}
          onPress={() => this.toggleModal()}>
          <Icon name="menu" type="EvilIcons" color={'white'} size={40} />
        </TouchableOpacity>
        <View style={styles.btns}>
          <Numindicator highlightedButton={this.state.startingNum} />
        </View>
        <View style={styles.hexagon}>
          <Image source={require('../../../assets/images/hexgon.png')} />
          <TouchableOpacity
            disabled={this.state.disableall || this.state.equalBtn}
            style={[styles.btn, {width: wp('19%'), left: wp('9%')}]}
            onPress={() => this.guessNum('equal')}>
            <Image
              source={require('../../../assets/images/equalbtn.png')}
              style={{
                width: 150,
                height: 150,
                resizeMode: 'contain',
                opacity: this.state.equalBtn ? 0.3 : 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.disableall || this.state.hiBtn}
            onPress={() => this.guessNum('high')}
            style={[styles.btn, {width: wp('10%'), top: 62, left: wp('43')}]}>
            <Image
              source={require('../../../assets/images/hibtn.png')}
              style={{
                width: 128,
                height: 140,
                resizeMode: 'contain',
                right: 16,
                opacity: this.state.hiBtn ? 0.3 : 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.disableall || this.state.loBtn}
            onPress={() => this.guessNum('low')}
            style={[styles.btn, {top: 170, left: wp('32%')}]}>
            <Image
              source={require('../../../assets/images/lobtn.png')}
              style={{
                width: 132,
                height: 132,

                resizeMode: 'contain',
                left: wp('8%'),
                opacity: this.state.loBtn ? 0.3 : 1,
              }}
            />
          </TouchableOpacity>
        </View>
        <Toast />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
   
  };
};

export default connect(mapStateToProps)(Home);
const styles = StyleSheet.create({
  hexagon: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('4%'),
  },
  header: {
    backgroundColor: '#000',
    width: wp('100%'),
    height: hp('7%'),
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
  },
  headerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    position: 'absolute',
    //bottom:hp('16.4%'),
    alignItems: 'center',
    width: wp('8%'),
    height: hp('3'),
    justifyContent: 'center',
    alignSelf: 'center',
    top: 119,
  },
  startNum: {
    position: 'absolute',
    top: hp('20%'),
    alignSelf: 'center',
  },
  bottomPopUp: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: hp('100%'),
  },
  more: {
    position: 'absolute',
    right: wp('5%'),
    bottom: hp('7%'),
  },
  btns: {
    position: 'absolute',
    right: wp('6%'),
    top: hp('4%'),
  },
  rupeecard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('3%'),
    bottom: hp('21%'),
    left: wp('7%'),
    position: 'absolute',
  },
  rupess: {
    borderBottomLeftRadius: 15,
    borderTopEndRadius: 15,
    borderColor: '#ffffcc',
    borderWidth: 0.6,
    width: wp('15%'),
    backgroundColor: '#683764',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
  },
  gameadj: {
    // justifyContent:"space-between",
    // flexDirection:"row",
    top: hp('5%'),
  },
  line: {
    width: wp('70%'),
    backgroundColor: 'white',
    height: 1,
    top: hp('5%'),
  },
  coin: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#3d3c3d',
    borderWidth: 3,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: wp('4%'),
    top: hp('12%'),
  },
  slider: {
    top: hp('10%'),
    width: wp('60%'),
    left: wp('9%'),
  },
  shuffle: {
    position: 'absolute',
    right: wp('7%'),
    bottom: hp('33%'),
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#292c2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  shuffletext: {
    position: 'absolute',
    right: wp('8%'),
    bottom: hp('40%'),
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  prevNum: {
    left: wp('10%'),
    top: hp('10%'),
    fontSize: 50,
    color: '#eb78af',
    fontFamily: 'Lobster-Regular',
  },
  previousLine: {
    left: wp('13%'),
    top: hp('12%'),
    fontSize: 50,
    color: '#eb78af',
  },
  previousText: {
    color: '#e7e7e7',
    fontFamily: 'Montserrat-SemiBold',
  },
  togglePosition: {
    transform: [{rotate: '90deg'}],
    top: hp('60%'),
    position: 'absolute',
  },
  gameadjText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 21,
    alignSelf: 'center',
  },
  ticketText: {
    color: 'white',
    alignSelf: 'center',
    marginBottom: hp('4%'),
  },
  rulescont: {
    backgroundColor: 'white',
    width: wp('70%'),
    height: 1,
    marginTop: 5,
  },
  playCont: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 5,
  },
  incTicket: {
    right: wp('11%'),
    position: 'absolute',
    bottom: hp('1.8%'),
  },
  decTicket: {
    position: 'absolute',
    left: wp('6%'),
    bottom: hp('1.5%'),
  },
});
