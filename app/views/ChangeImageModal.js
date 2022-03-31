import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useFirestore} from 'react-redux-firebase';
import * as ImagePicker from 'react-native-image-picker';
import {isEmpty} from 'lodash';

const ChangeImageModal = props => {
  console.log(props);
  const [image, setImage] = useState('');
  const firestore = useFirestore();

  const chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel) {
        return;
      }
      if (response?.assets[0]?.error) {
        return Alert.alert(
          'An error occurred: ',
          response.assets[0].error.message,
        );
      } else if (response?.assets[0]?.uri) {
        const {uri} = response.assets[0];
        setImage(response.assets[0]);
        let filename;
        let url = '';
        if (!isEmpty(image)) {
          console.log(image, 'inside');
          filename = image?.uri.substring(image.uri.lastIndexOf('/') + 1);
          let uploadUri =
            Platform.OS === 'ios'
              ? image.uri.replace('file://', '')
              : image.uri;
          let ref = storage().ref('/masjid/' + filename);
          await ref.putFile(uploadUri);
          url = await ref.getDownloadURL();
          setImage(url);
        }
      }
    }).then(r => {
      console.log(image, 'sasc');
      firestore()
        .collection('Masjid')
        .doc(props.uid)
        .update({
          pictureURL: image,
        })
        .then(() => alert('Confirm'))
        .catch(e => console.log(e, 'sas'));
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.imageChangeModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Namaz Timings</Text>
          <Image
            source={{
              uri: `${
                props.pictureURL ||
                'https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png'
              }`,
            }}
            style={{
              width: 160,
              height: 100,
              marginRight: 10,
              borderRadius: 8,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={chooseImage}
              style={{
                alignItems: 'center',
                backgroundColor: '#CEE6B4',
                padding: 10,
                borderRadius: 5,
                width: '50%',
                marginTop: 10,
                marginHorizontal: 10,
              }}>
              <Text style={{color: '#1F441E'}}>Change Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                let ref = storage().refFromURL(props.pictureURL);
                await ref.delete();
                firestore()
                  .collection('Masjid')
                  .doc(props.uid)
                  .update({
                    pictureURL: '',
                  })
                  .then(() => alert('Confirm'))
                  .catch(e => console.log(e, 'sas'));
              }}
              style={{
                alignItems: 'center',
                backgroundColor: 'darkred',
                padding: 10,
                borderRadius: 5,
                width: '50%',
                marginTop: 10,
                marginHorizontal: 10,
              }}>
              <Text style={{color: 'white'}}>Delete</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => props.setImageChangeModal(false)}
            style={{
              marginTop: 10,
            }}>
            <Text style={{color: '#1F441E', fontSize: 17}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeImageModal;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000071',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    padding: 35,
    width: Dimensions.get('screen').width * 0.8,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});
