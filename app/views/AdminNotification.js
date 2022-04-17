import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {selectFirebase} from '../store/firebase';
import Edit from './Edit';

const markAsRead = async reqId => {
  Alert.alert(
    'Confirmation',
    'Do you want to change the status to mark as read?',
    [
      {
        text: 'Confirm',
        onPress: () => {
          firestore()
            .collection('requests')
            .doc(reqId)
            .update({
              isRead: true,
            })
            .then(
              value => {
                console.log('sent', value);
              },
              reason => {
                console.warn(reason.message);
              },
            );
        },
      },
      {
        text: 'Cancel',
      },
    ],
  );
};

const deleteFunc = (masjidId, reqId, uid) => {
  console.log(masjidId, reqId);
  console.log(masjidId, uid, 'is equal ?', masjidId === uid);
  Alert.alert('Confirmation', 'Do you want to delete the request?', [
    {
      text: 'Confirm',
      onPress: () => {
        firestore()
          .collection('Masjid')
          .doc(masjidId)
          .update({
            requestList: firestore.FieldValue.arrayRemove(reqId),
          })
          .then(
            () => {
              firestore()
                .collection('requests')
                .doc(reqId)
                .delete()
                .then(
                  value1 => {
                    Alert.alert(
                      'Successful',
                      'This request has been deleted successfully',
                    );
                  },
                  reason => {
                    console.warn(reason.message, 'from requests');
                  },
                );
            },
            reason => {
              console.warn(reason.message, 'from docs');
            },
          );
      },
    },
    {
      text: 'Cancel',
    },
  ]);
};

const AdminNotification = ({navigation, route}) => {
  const {masjid, masjidData} = route.params;
  // const [data, setData] = useState([]);
  // const {myMasjids} = useSelector(state => state.firestore.ordered);
  // const {auth} = useSelector(state => state.firebase);
  const {auth} = useSelector(selectFirebase);
  console.log(masjidData, 'from notification');
  // const tempData = [];
  // if (isLoaded(snapshot)) {
  //   // console.log(snapshot);
  //   if (snapshot.requests) {
  //     snapshot.requests.forEach(d => {
  //       tempData.push({
  //         ...d,
  //         // createdAt: Date.parse(d.timeStamp),
  //         masjid: snapshot.id,
  //         admin: snapshot.admin,
  //       });
  //     });
  //   }
  // }
  // const data = _.sortBy(
  //   // _.filter(tempData, function (o) {
  //   //   return !o.isRead;
  //   // }),
  //   tempData,
  //   'createdAt',
  // );

  // console.log(data, 'from notify');

  const renderItem = ({item}) => {
    console.log(item);
    const {timing, id, userName, userPhone, isRead} = item;
    if (!isRead) {
      firestore()
        .collection('requests')
        .doc(id)
        .update({
          isRead: true,
        })
        .then(value => {
          console.log('updated to read notification');
        });
    }
    // useEffect(() => {
    //   (async () => {
    //     await firestore().collection('requests').doc(id).update({
    //       isRead: true,
    //     });
    //   })();
    // }, []);

    if (!_.isUndefined(item.timing)) {
      return (
        <Card
          style={{
            borderRadius: 5,
            margin: 10,
            shadowOpacity: 10,
            elevation: 5,
          }}
          key={item.key}>
          <Card.Actions>
            <View style={{width: '100%'}}>
              <View style={{flexDirection: 'row', margin: 5}}>
                <View style={{flexGrow: 1}}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: `${isRead ? 'grey' : '#1F441E'}`,
                      fontWeight: `${isRead ? 200 : 700}`,
                    }}>
                    Requestor Name: {userName}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', margin: 5}}>
                <View style={{flexGrow: 1}}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: `${isRead ? 'grey' : '#1F441E'}`,
                      fontWeight: `${isRead ? 200 : 700}`,
                    }}>
                    Requestor Contact: {userPhone}
                  </Text>
                </View>
              </View>
              <View
                style={{backgroundColor: '#eeee', padding: 5, borderRadius: 8}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexGrow: 1}} />
                  <View>
                    <Edit
                      masjidName="N/A"
                      timing={timing}
                      uid={masjid}
                      isRequest={false}
                      userInfo={false}
                      value="View"
                    />
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flexGrow: 5}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      Fajar
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      {timing.fajar.substring(0, 5)}
                    </Text>
                  </View>
                  <View style={{flexGrow: 5}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      Zohar
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      {timing.zohar.substring(0, 5)}
                    </Text>
                  </View>
                  <View style={{flexGrow: 5}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      Asar
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      {timing.asar.substring(0, 5)}
                    </Text>
                  </View>
                  <View style={{flexGrow: 5}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      Magrib
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      {timing.magrib.substring(0, 5)}
                    </Text>
                  </View>
                  <View style={{flexGrow: 5}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      Isha
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: `${isRead ? 'grey' : '#1F441E'}`,
                        fontWeight: `${isRead ? 200 : 700}`,
                      }}>
                      {timing.isha.substring(0, 5)}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  padding: 10,
                }}>
                {/* <TouchableOpacity
                  disabled={isRead}
                  onPress={() => markAsRead(id)}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: `${isRead ? 'grey' : 'green'}`,
                    }}>
                    Mark As Read
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => deleteFunc(masjid, id, auth.uid)}>
                  <Text style={{fontSize: 15, color: 'red'}}>
                    Delete Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Actions>
        </Card>
      );
    }
  };

  // if (
  //   Firestore.status.requesting.myMasjidsView ||
  //   !Firestore.status.requested.myMasjidsView ||
  //   !isLoaded(snapshot)
  // ) {
  //   return (
  //     <View>
  //       <Header
  //         containerStyle={{
  //           shadowOpacity: 50,
  //           elevation: 50,
  //         }}
  //         centerComponent={
  //           <View style={{textAlign: 'center'}}>
  //             <Text
  //               style={{
  //                 color: '#ffff',
  //                 fontSize: 22,
  //                 marginBottom: 5,
  //                 marginTop: 5,
  //                 textAlign: 'center',
  //               }}>
  //               Admin
  //             </Text>
  //           </View>
  //         }
  //         backgroundColor="#1F441E"
  //       />
  //       <ActivityIndicator color="#1F441E" size="large" />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView>
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
              Requests
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
      <FlatList
        data={_.orderBy(masjidData.requests, 'timeStamp', 'desc')}
        renderItem={renderItem}
        // inverted={true}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              marginVertical: '50%',
            }}>
            <AntDesign name="folder1" size={80} />
            <Text style={{fontSize: 20}}>No Requests</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        style={{
          height: Dimensions.get('window').height - 80,
        }}
        initialNumToRender={15}
      />
    </SafeAreaView>
  );
};

export default AdminNotification;
