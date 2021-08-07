/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Edit = ({
  isha,
  fajar,
  zohar,
  asar,
  magrib,
  uid,
  isRequest = true,
  value = 'Edit',
}) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [namazTime, setNamazTime] = useState('');
  const [time, setTime] = useState({
    isha: isha,
    fajar: fajar,
    zohar: zohar,
    asar: asar,
    magrib: magrib,
  });

  const showTimePicker = namazName => {
    setTimePickerVisibility(true);
    setNamazTime(namazName);
  };

  async function submitRequest() {
    const prevTime = {
      isha: isha,
      fajar: fajar,
      zohar: zohar,
      asar: asar,
      magrib: magrib,
    };
    if (_.isEqual(time, prevTime)) {
      Alert.alert('Alert', 'No Change Found');
    } else {
      console.log(uid);
      if (isRequest) {
        await firestore()
          .collection('Masjid')
          .doc(uid)
          .collection('requests')
          .add(time)
          .then(a => {
            Alert.alert(
              'Request Send!',
              'Request has been forwarded to the admin',
              [
                {
                  text: 'Ok',
                  onPress: () => setModalVisible(!modalVisible),
                },
              ],
              {cancelable: false},
            );
          });
      } else {
        await firestore()
          .collection('Masjid')
          .doc(uid)
          .update({
            timing: {
              ...time,
            },
          })
          .then(a => {
            setModalVisible(!modalVisible);
          });
      }
    }
  }

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = newTime => {
    const timeString = moment(newTime).format('hh:mm A');
    console.log(timeString);
    if (namazTime === 'Magrib') {
      setTime(pre => {
        return {
          ...pre,
          magrib: timeString,
        };
      });
    }
    if (namazTime === 'Fajr') {
      setTime(pre => {
        return {
          ...pre,
          fajar: timeString,
        };
      });
    }
    if (namazTime === 'Zohr') {
      setTime(pre => {
        return {
          ...pre,
          zohar: timeString,
        };
      });
    }
    if (namazTime === 'Asar') {
      setTime(pre => {
        return {
          ...pre,
          asar: timeString,
        };
      });
    }
    if (namazTime === 'Isha') {
      setTime(pre => {
        return {
          ...pre,
          isha: timeString,
        };
      });
    }
    console.log('A Time has been picked: ', timeString);
    hideTimePicker();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{flexDirection: 'row', paddingRight: 10}}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <Text style={{fontSize: 16, marginTop: 3, fontWeight: '200'}}>
          {value}
        </Text>
        <Icon name="square-edit-outline" size={24} style={{marginTop: 1}} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Namaz Timings</Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  flexGrow: 1,
                  paddingLeft: 10,
                }}>
                <Text style={{fontSize: 17}}>Fajr :</Text>
              </View>
              <View style={styles.editTime}>
                <Pressable onPress={() => showTimePicker('Fajr')}>
                  <Text style={{fontSize: 17}}>{time.fajar}</Text>
                </Pressable>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  flexGrow: 1,
                  paddingLeft: 10,
                }}>
                <Text style={{fontSize: 17}}>Zohr :</Text>
              </View>
              <View style={styles.editTime}>
                <Pressable onPress={() => showTimePicker('Zohr')}>
                  <Text style={{fontSize: 17}}>{time.zohar}</Text>
                </Pressable>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  flexGrow: 1,
                  paddingLeft: 10,
                }}>
                <Text style={{fontSize: 17}}>Asar :</Text>
              </View>
              <View style={styles.editTime}>
                <Pressable onPress={() => showTimePicker('Asar')}>
                  <Text style={{fontSize: 17}}>{time.asar}</Text>
                </Pressable>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  flexGrow: 1,
                  paddingLeft: 10,
                }}>
                <Text style={{fontSize: 17}}>Magrib :</Text>
              </View>
              <View style={styles.editTime}>
                <Pressable onPress={() => showTimePicker('Magrib')}>
                  <Text style={{fontSize: 17}}>{time.magrib}</Text>
                </Pressable>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  flexGrow: 1,
                  paddingLeft: 10,
                }}>
                <Text style={{fontSize: 17}}>Isha :</Text>
              </View>
              <View style={styles.editTime}>
                <Pressable onPress={() => showTimePicker('Isha')}>
                  <Text style={{fontSize: 17}}>{time.isha}</Text>
                </Pressable>
              </View>
            </View>
            <View
              style={{
                margin: 15,
                borderBottomColor: '#C4C4C4',
                borderBottomWidth: 1,
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={submitRequest}>
                <Text style={styles.textStyle1}>
                  {isRequest ? 'Request' : 'Confirm'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  editTime: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#dddd',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '30%',
  },
  buttonOpen: {
    backgroundColor: '#5C5C5C',
    marginRight: 15,
  },
  buttonClose: {
    backgroundColor: '#1F441E',
    marginLeft: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle1: {
    color: '#CEE6B4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Edit;
