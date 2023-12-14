import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Modal,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {showToast} from '../../../services/toastService';
import {BarIndicator} from 'react-native-indicators';
import gameservice from '../../../services/gameservice';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import Moment from 'react-moment';
import DatePicker from 'react-native-neat-date-picker';
import { backEndCallObj } from '../../../services/allservices';

class History extends Component {
  state = {
    history: [],
    isModalVisible: false,
    selectedHistory: [],
    bgColor: '',
    showDatePicker: false,
    date: '',
    checkdate: '',
  };
  async componentDidMount() {
    try {
      const obj = {
        userid: this.props.auth.userid,
      };
      const data = await gameservice.history(obj);
      this.setState({history: data});
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        showToast('error', ex.response.data);
      }
    }
  }
  toggleModal = async (data, bgcolor) => {
    this.setState({selectedHistory: data, bgColor: bgcolor});
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  dateview = async item => {
    await this.setState({showDatePicker: true});
  };
  onCancel = async item => {
    await this.setState({showDatePicker: false});
  };
  onConfirm = async item => {
    await this.setState({showDatePicker: false, date: item.dateString});
  };
  render() {
    const {history, selectedHistory, date, checkdate} = this.state;

    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#f2f2f2', '#e6ffff', '#ffebcc', '#ffcc80']}
        style={{flex: 1}}>
        <DatePicker
          isVisible={this.state.showDatePicker}
          dateStringFormat={'dd/mm/yyyy'}
          mode={'single'}
          onCancel={() => this.onCancel()}
          onConfirm={this.onConfirm}
        />
        <View
          style={{
            flexDirection: 'row',
            //justifyContent: 'space-evenly',
            top: hp('3%'),
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{marginLeft: wp('6%')}}
            onPress={() => this.props.navigation.goBack()}>
            <Icon type="Ionicons" name="arrow-back" size={26} color={'black'} />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: 22,
              left: wp('5%'),
            }}>
            Game History
          </Text>
          {/* <TouchableOpacity onPress={() => this.dateview()}>
            <Icon name="edit-calendar" type="Entypo" size={25} />
          </TouchableOpacity> */}
        </View>
        {history.length > 0 ? (
          <ScrollView>
            <View style={{marginBottom: 150}}>
              {history
                .filter(fm => {
                  const formatDate = new Date(Number(fm.time))
                    .toISOString()
                    .split('T')[0];

                  const changeDate = moment(date, 'DD/MM/YYYY').format(
                    'YYYY-MM-DD',
                  );

                  return date === '' ? fm : formatDate.includes(changeDate);
                })
                .map((data, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => this.toggleModal(data)}
                    style={[
                      styles.historyCont,
                      {borderLeftWidth: 1, borderColor: 'green'},
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View style={styles.container}>
                        <Text style={styles.headertext}>Bet_id</Text>
                        <Text style={styles.text}>{data.betid}</Text>
                      </View>
                      <View style={styles.container}>
                        <Text style={styles.headertext}>BetAmount</Text>
                        <Text style={styles.text}>{data.betAmount}</Text>
                      </View>
                      <View style={styles.container}>
                        <Text style={styles.headertext}>Status</Text>
                        <Text
                          style={[
                            styles.text,
                            {color: data.status == 'win' ? 'green' : 'red'},
                          ]}>
                          {data.status}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        top: 25,
                      }}>
                      <View>
                        <Text style={styles.headertext}>BetPlacedOn</Text>
                        <Text style={styles.text}>{data.betPlacedOn}</Text>
                      </View>
                      <View>
                        <Text style={styles.headertext}>Date</Text>
                        <Moment
                          style={styles.text}
                          element={Text}
                          fromNow
                          format="DD/MM/YYYY hh:mm A">
                          {new Date(Number(data?.time))}
                        </Moment>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        ) : (
          <BarIndicator color="#eb78af" />
        )}
        <Toast />
        <Modal
          visible={this.state.isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={this.toggleModal}>
          <View>
            <View style={styles.bottomPopUp}>
              <TouchableOpacity
                onPress={() => this.toggleModal()}
                style={{alignSelf: 'center'}}>
                <Icon name="cancel" type="Entypo" color={'red'} size={30} />
              </TouchableOpacity>
              <View
                style={{justifyContent: 'space-evenly', flexDirection: 'row'}}>
                <View style={styles.popupcont}>
                  <Text style={styles.text1}>User_Id</Text>
                  <Text style={styles.text1}>Bet_Id</Text>
                  <Text style={styles.text1}>Bet_PlacedOn</Text>
                  <Text style={styles.text1}>Bet_Amount</Text>
                  <Text style={styles.text1}>Amount_Won</Text>
                  <Text style={styles.text1}>Status</Text>
                  <Text style={styles.text1}>Odds</Text>
                  <Text style={styles.text1}>Date</Text>
                </View>
                <View style={styles.popupcont}>
                  <Text style={styles.text2}>:{selectedHistory?.userid}</Text>
                  <Text style={styles.text2}>:{selectedHistory?.betid}</Text>
                  <Text style={styles.text2}>
                    :{selectedHistory?.betPlacedOn}
                  </Text>
                  <Text style={styles.text2}>:{selectedHistory?.betAmount}</Text>
                  <Text style={styles.text2}>:{selectedHistory?.amountWon}</Text>
                  <Text style={styles.text2}>:{selectedHistory?.status}</Text>
                  <Text style={styles.text2}>:{selectedHistory?.odds}</Text>
                  <Moment
                    style={styles.text2}
                    element={Text}
                    fromNow
                    format="DD/MM/YYYY hh:mm A">
                    {new Date(Number(selectedHistory?.time))}
                  </Moment>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(History);

const styles = StyleSheet.create({
  historyCont: {
    width: wp('90%'),
    height: hp('15%'),
    alignSelf: 'center',
    top: hp('3%'),
    marginBottom: hp('5%'),
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  headertext: {
    color: 'black',
    //alignSelf: 'center',
  },
  text: {
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  container: {
    top: 10,
  },
  bottomPopUp: {
    position: 'absolute',
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: hp('45%'),
    alignSelf: 'center',
    top: hp('20%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  popupcont: {
    top: hp('4%'),
  },
  text1: {
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 10,
  },
  text2: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    left: 5,
  },
});
