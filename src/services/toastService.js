import Toast from 'react-native-toast-message';

export async function showToast(type, text1) {
  Toast.show({
    type: type,
    text1: type === 'error' ? 'Error' : 'Success',
    text2: text1,
    topOffset: 10,
    position:'top'
  
    
  });
}

export default {
  showToast,
};
