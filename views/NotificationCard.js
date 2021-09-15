import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card} from 'react-native-paper';
import {useFirestore} from 'react-redux-firebase';
import {useSelector} from 'react-redux';

const NotificationCard = ({data, masjidName, masjidId, adminId}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const firestore = useFirestore();
  const {auth, profile} = useSelector(state => state.firebase);

  const Delete = () => {
    firestore
      .collection('announcement')
      .doc(data.id)
      .delete()
      .then(value => {
        firestore
          .collection('Masjid')
          .doc(masjidId)
          .update({
            announcementList: firestore.FieldValue.arrayRemove(data.id),
          })
          .then(value1 => {
            console.log(value1);
          });
      });
  };

  return (
    <>
      <Card
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          borderRadius: 5,
          margin: 10,
          shadowOpacity: 10,
          elevation: 5,
          borderBottomColor: '#229704',
          borderBottomWidth: 10,
        }}>
        <Card.Actions>
          <View style={{width: '100%', padding: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={{fontSize: 20}}>{masjidName}</Text>
              </View>
              <View>
                <Text style={{marginTop: 6}}>Dated: 02/09/2021</Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: 7,
                height: 40,
                marginBottom: -10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{fontSize: 17, maxWidth: '91.5%'}}>
                  {data.description}
                </Text>
              </View>
              {auth.uid === adminId ||
                (profile.isAdmin && (
                  <TouchableOpacity
                    onPress={Delete}
                    style={{
                      backgroundColor: 'darkred',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 5,
                      height: 30,
                      borderRadius: 5,
                    }}>
                    <MaterialCommunityIcons
                      color="white"
                      name="trash-can-outline"
                      size={20}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </Card.Actions>
      </Card>
      {auth.uid === adminId ||
        (profile.isAdmin && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Namaz Timings</Text>
                <View
                  style={{
                    marginBottom: 10,
                    backgroundColor: '#eeee',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  <Text>{data.description}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: -30,
                  }}>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      console.log('logged');
                    }}>
                    <Text style={[styles.textStyle1]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        ))}
    </>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6d6d6d6b',
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
    borderRadius: 10,
    padding: 35,
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
    backgroundColor: 'darkred',
    marginLeft: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});
export default NotificationCard;