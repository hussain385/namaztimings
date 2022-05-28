import moment from 'moment';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Card} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {selectFirebase} from '../../store/firebase';

const NotificationCard = ({data, masjidName, masjidId, adminId}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();
  const {auth} = useSelector(selectFirebase);

  const Delete = async () => {
    setLoading(true);
    await firestore
      .collection('announcement')
      .doc(data.id)
      .delete()
      .then(() => {
        firestore
          .collection('Masjid')
          .doc(masjidId)
          .update({
            announcementList: firestore.FieldValue.arrayRemove(data.id),
          })
          .then(() => {
            Alert.alert(
              'Announcement',
              'Your announcement has been deleted Successfully!',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    setModalVisible(false);
                  },
                },
              ],
            );
          });
        setLoading(false);
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
                <Text style={{marginTop: 6}}>
                  Dated:{' '}
                  {moment(data.createdAt?.seconds * 1000).format('DD/MM/YYYY')}
                </Text>
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
                  style={{
                    fontSize: 17,
                    width: Dimensions.get('screen').width * 0.72,
                  }}>
                  {data.description}
                </Text>
              </View>
            </View>
          </View>
        </Card.Actions>
      </Card>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
              <ScrollView style={{maxHeight: 200}}>
                <Text>{data.description}</Text>
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('screen').width * 0.7,
              }}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              {auth.uid === adminId && (
                <Pressable
                  disabled={loading}
                  style={[styles.button, styles.buttonClose]}
                  onPress={Delete}>
                  {!loading ? (
                    <Text style={[styles.textStyle1]}>Delete</Text>
                  ) : (
                    <ActivityIndicator color="#ffff" size={18} />
                  )}
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    width: '40%',
    marginTop: 10,
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
