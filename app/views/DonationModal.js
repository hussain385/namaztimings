import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const Window_Height = Dimensions.get('screen').height;
const Window_Width = Dimensions.get('screen').width;

const DonationModal = props => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [donationInfo, setDonationInfo] = useState(props.donationInfo);
  const onSubmit = async () => {
    setIsSubmitting(true);
    await firestore()
      .collection('Masjid')
      .doc(props.masjidId)
      .update({
        donationInfo: donationInfo,
      })
      .then(() => {
        Alert.alert('Info Save', 'Your information has been saved.', [
          {
            text: 'Ok',
            onPress: () => {
              setIsSubmitting(false);
              props.setModalVisible(false);
            },
          },
        ]);
      });
  };
  console.log(donationInfo);
  return (
    // <Modal
    //   animationType="slide"
    //   transparent={true}
    //   visible={props.modalVisible}>
    //   <View style={styles.centeredView}>
    //     <ScrollView>
    <View style={styles.modalView}>
      {donationInfo !== 'No information set by admin' && (
        <>
          <TextInput
            value={donationInfo}
            name="info"
            placeholder="Your donation information"
            multiline={true}
            editable={props.editable}
            onChangeText={event => {
              setDonationInfo(event);
            }}
            style={{
              padding: 10,
              fontSize: 17,
              color: 'black',
              borderColor: '#bbbbbb',
              borderWidth: 1,
              textAlign: 'center',
              width: '100%',
              borderRadius: 5,
              height: Dimensions.get('screen').height * 0.5,
              textAlignVertical: 'top',
            }}
          />
          {props.editable && (
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onSubmit}>
              {isSubmiting ? (
                <ActivityIndicator size={18} color="white" />
              ) : (
                <Text style={styles.textStyle}>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
    //     </ScrollView>
    //   </View>
    // </Modal>
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
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: Window_Width,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
