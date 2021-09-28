import _ from 'lodash';
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {ActivityIndicator, FAB} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  populate,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import NotificationCard from '../views/NotificationCard';

const Notification = ({navigation, route: {params}}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {masjidId, masjidName, adminId} = params;
  const {auth, profile} = useSelector(state => state.firebase);
  const firestoreData = useFirestore();
  const populates = [
    {
      child: 'announcementList',
      root: 'announcement',
      childAlias: 'announcement',
    },
  ];
  useFirestoreConnect([
    {
      collection: 'Masjid',
      doc: masjidId,
      populates,
      storeAs: 'tempAnnouncement',
    },
  ]);

  const firestore = useSelector(state => state.firestore);
  const masjidData = populate(firestore, 'tempAnnouncement', populates);

  console.log(masjidData);

  const data = _.map(masjidData?.announcement, rawData => {
    return {
      ...rawData,
      // createdAt: Date.parse(rawData.createdAt),
    };
  });

  return (
    <View>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              color="#ffff"
              size={26}
              style={{paddingLeft: 10}}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={{textAlign: 'center'}}>
            <Text
              style={{
                color: '#ffff',
                fontSize: 22,
                marginBottom: 5,
                marginTop: 5,
                textAlign: 'center',
              }}>
              Notification
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
      {firestore.status.requested.tempAnnouncement && data.length >= 1 ? (
        <FlatList
          style={{height: Dimensions.get('screen').height * 0.82}}
          data={data}
          renderItem={({item, index}) => (
            <NotificationCard
              data={item}
              masjidName={masjidName}
              masjidId={masjidId}
              adminId={adminId}
            />
          )}
        />
      ) : firestore.status.requesting.tempAnnouncement ? (
        <View
          style={{
            height: Dimensions.get('screen').height,
          }}>
          <ActivityIndicator size={40} color="#1F441E" />
        </View>
      ) : (
        <View
          style={{
            height: Dimensions.get('screen').height * 0.82,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign color="#1F441E" name="folder1" size={70} />
          <Text style={{fontSize: 20, color: '#1F441E'}}>No Notification</Text>
        </View>
      )}
      {auth.uid === adminId ||
        (profile.isAdmin && (
          <View>
            <FAB
              style={styles.fab}
              small
              icon="plus"
              onPress={() => setModalVisible(true)}
            />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <Formik
                initialValues={{
                  description: '',
                }}
                validationSchema={Yup.object().shape({
                  description: Yup.string().required('description is required'),
                })}
                onSubmit={values => {
                  firestoreData
                    .collection('announcement')
                    .add({
                      createdAt: new firestoreData.Timestamp.now(),
                      description: values.description,
                    })
                    .then(r => {
                      firestoreData
                        .collection('Masjid')
                        .doc(masjidId)
                        .update({
                          announcementList: firestoreData.FieldValue.arrayUnion(
                            r.id,
                          ),
                        })
                        .then(r => setModalVisible(false));
                    });
                }}>
                {({
                  values,
                  handleChange,
                  errors,
                  handleBlur,
                  handleSubmit,
                  touched,
                }) => (
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>New Notification</Text>
                      <View
                        style={{
                          width: Dimensions.get('screen').width * 0.75,
                          marginBottom: 10,
                        }}>
                        {/*<Text style={{marginLeft: 10, marginTop: 10}}>*/}
                        {/*    New*/}
                        {/*</Text>*/}
                        <View
                          style={{
                            borderRadius: 10,
                            marginHorizontal: 10,
                            marginTop: 5,
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 5,
                            },
                            shadowOpacity: 0.34,
                            shadowRadius: 6.27,
                            elevation: 5,
                          }}>
                          <TextInput
                            multiline={true}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            value={values.description}
                            scrollEnabled={true}
                            style={{
                              paddingHorizontal: 10,
                              backgroundColor: '#EEEEEE',
                              color: 'black',
                              maxHeight: 200,
                              overflow: 'scroll',
                            }}
                            keyboardType="numbers-and-punctuation"
                            placeholder="Enter Your Notification..."
                            placeholderTextColor="grey"
                          />
                          {errors.description && touched.email && (
                            <Text style={styles.error}>
                              {errors.description}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 10,
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
                          onPress={handleSubmit}>
                          <Text style={[styles.textStyle1]}>Send</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
              </Formik>
            </Modal>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: '#1F441E',
  },
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
    backgroundColor: '#1F441E',
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

export default Notification;
