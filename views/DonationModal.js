import React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Input} from 'react-native-elements';

const Window_Height = Dimensions.get('screen').height;
const Window_Width = Dimensions.get('screen').width;

const DonationModal = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}>
      <View style={styles.centeredView}>
        <ScrollView>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Namaz Timings</Text>
            <Text style={{textAlign: 'center'}}>
              Transfer your amount through one of the following
            </Text>
            <View style={styles.information}>
              <Image
                style={{
                  width: Window_Width * 0.35,
                  height: Window_Height * 0.042,
                }}
                source={require('../assests/image/Easypaisa.png')}
              />
              <Input
                style={styles.inputStyle}
                placeholder="Account Details"
                value="+92-323-6501386"
                disabled={!props.editable}
              />
            </View>
            <View style={styles.information}>
              <Image
                style={{
                  width: Window_Width * 0.24,
                  height: Window_Height * 0.042,
                }}
                source={require('../assests/image/Paytm.png')}
              />
              <Input
                style={styles.inputStyle}
                placeholder="Account Details"
                value="+92-323-6501386"
                disabled={!props.editable}
              />
            </View>
            <View style={styles.information}>
              <Image
                resizeMethod="auto"
                style={{
                  width: Window_Width * 0.19,
                  height: Window_Height * 0.054,
                }}
                source={require('../assests/image/Jazz.png')}
              />
              <Input
                style={styles.inputStyle}
                placeholder="Account Details"
                value="+92-323-6501386"
                disabled={!props.editable}
              />
            </View>
            <View style={styles.information}>
              <Text style={{fontSize: 20}}>Account Number</Text>
              <Input
                style={styles.inputStyle}
                placeholder="Account Details"
                value="+92-323-6501386"
                disabled={!props.editable}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  props.setModalVisible(!props.modalVisible);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              {props.editable && (
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    props.setModalVisible(!props.modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DonationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000071',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: Window_Width * 0.8,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '30%',
  },
  buttonOpen: {
    backgroundColor: '#5C5C5C',
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
  information: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  inputStyle: {
    marginTop: 0,
    textAlign: 'center',
  },
});
