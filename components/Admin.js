/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {modifyData} from '../store/firebase';
import {headerStyles, textStyles} from '../theme/styles/Base';
import Edit from '../views/Edit';
import CoText from '../views/Text/Text';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const Admin = ({navigation}) => {
  const [notify, setNotify] = React.useState(0);
  const [requests, setRequests] = React.useState(null);
  const [snapshot, setSnapshot] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const auth = useSelector(state => state.firebase.auth);
  // const [snapshot, loading, error] = useCollectionOnce(
  //   firestore().collection('Masjid').where('adminId', '==', user.uid),
  // );
  React.useEffect(() => {
    setLoading(true);
    let unSubReq;
    const sub = firestore()
      .collection('Masjid')
      .where('adminId', '==', auth.uid ? auth.uid : '')
      .onSnapshot(data => {
        setLoading(false);
        setSnapshot(data);
        setNotify(0);
        data.docs.map(n => {
          unSubReq = firestore()
            .collection('Masjid')
            .doc(n.id)
            .collection('requests')
            .onSnapshot(reqData => {
              const rData = [];
              console.log(reqData);
              reqData.forEach(docSnapshot => {
                rData.push({
                  ...docSnapshot.data(),
                  id: docSnapshot.id,
                  Masjidid: n.id,
                });
              });
              setRequests(_.sortBy(rData, 'createdAt'));
              reqData.docChanges().forEach(change => {
                if (change.type === 'added') {
                  setNotify(prevState => {
                    return (prevState += 1);
                  });
                }
                if (change.type === 'modified') {
                  const data1 = change.doc.data();
                  if (data1.isRead === true) {
                    setNotify(prevState => {
                      return (prevState -= 1);
                    });
                  } else {
                    setNotify(prevState => {
                      return (prevState += 1);
                    });
                  }
                }
                if (change.type === 'removed') {
                  setNotify(prevState => {
                    return (prevState -= 1);
                  });
                }
              });
            });
        });
      }, setError);
    return () => {
      sub();
      unSubReq && unSubReq();
      console.log('unsubscribing....');
    };
  }, [auth.uid]);
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
              Admin
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('adminNotification', {
                requests,
                id: snapshot.docs.id,
              })
            }
            style={{
              paddingRight: 10,
            }}>
            <View>
              <View style={headerStyles.cartTxt}>
                <CoText
                  textStyles={[
                    textStyles.simple,
                    {fontSize: 10, color: '#1F441E'},
                  ]}
                  text={notify}
                />
              </View>
              <MaterialIcons name="bell" size={28} color="white" />
            </View>
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      {error && (
        <View>
          <Text>{error}</Text>
        </View>
      )}
      {loading && <ActivityIndicator color="#1F441E" size="large" />}
      {snapshot ? (
        <>
          {snapshot.docs.map(doc => {
            const data = modifyData(doc.data(), doc.id, 0);
            return (
              <ScrollView
                style={styles.scrollView}
                key={doc.id}
                // refreshControl={
                //   <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                // }
              >
                <View>
                  <View>
                    <Text
                      style={{
                        justifyContent: 'flex-start',
                        fontSize: 17,
                        padding: 15,
                      }}>
                      BASIC INFO
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Icon
                        name="mosque"
                        color="#5C5C5C"
                        size={20}
                        style={{paddingRight: 10, paddingLeft: 10}}
                      />
                      <Text
                        style={{
                          fontSize: 17,
                          color: '#5C5C5C',
                          fontWeight: 'bold',
                        }}>
                        {data.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Icon
                        name="map-marker-alt"
                        color="#5C5C5C"
                        size={20}
                        style={{
                          paddingRight: 18,
                          paddingLeft: 13,
                          marginTop: 5,
                        }}
                      />
                      <Text style={{maxWidth: 200, marginTop: 5}}>
                        {data.address}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Icon
                        name="user-alt"
                        color="#5C5C5C"
                        size={20}
                        style={{paddingRight: 18, paddingLeft: 10}}
                      />
                      <Text style={{maxWidth: 280, marginTop: 2}}>
                        Moulana Tariq
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Icon
                        name="phone-alt"
                        color="#5C5C5C"
                        size={20}
                        style={{paddingRight: 18, paddingLeft: 10}}
                      />
                      <Text style={{maxWidth: 280, marginTop: 0}}>
                        +92 323 0000000
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={{
                          uri: `${data.pictureURL}`,
                        }}
                        style={{
                          width: 160,
                          height: 100,
                          marginTop: -50,
                          marginRight: 10,
                          borderRadius: 8,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        flexDirection: 'row',
                        backgroundColor: '#E1E1E1',
                        padding: 10,
                      }}>
                      <Text style={{fontSize: 17}}>
                        Last Updated:
                        <Text style={{color: '#008000'}}>14th May 2021</Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        flexDirection: 'row',
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                        Namaz Timings
                      </Text>
                    </View>
                    <Edit
                      fajar={data.timing.fajar}
                      zohar={data.timing.zohar}
                      asar={data.timing.asar}
                      magrib={data.timing.magrib}
                      isha={data.timing.isha}
                      uid={doc.id}
                      isRequest={false}
                    />
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Fajr</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 10,
                      }}>
                      <Text style={{fontSize: 17}}>{data.timing.fajar}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Zohr</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 10,
                      }}>
                      <Text style={{fontSize: 17}}>{data.timing.zohar}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Asr</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 10,
                      }}>
                      <Text style={{fontSize: 17}}>{data.timing.asar}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Magrib</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 10,
                      }}>
                      <Text style={{fontSize: 17}}>{data.timing.magrib}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        flexGrow: 1,
                        paddingLeft: 10,
                      }}>
                      <Text style={{fontSize: 17}}>Isha</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 10,
                      }}>
                      <Text style={{fontSize: 17}}>{data.timing.isha}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      margin: 15,
                      borderBottomColor: '#C4C4C4',
                      borderBottomWidth: 1,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#1F441E',
                        padding: 10,
                        borderRadius: 5,
                        width: '70%',
                        marginHorizontal: 10,
                      }}
                      onPress={() => navigation.navigate('Show More')}>
                      <Text style={{color: '#CEE6B4'}}>
                        NEWS & ANNOUNCMENTS
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            );
            // <Text key={doc.id}>{data.pictureURL)}</Text>
          })}
        </>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
  mncontainer: {
    flex: 1,
    marginTop: 30,
  },
  navigationContainer: {
    backgroundColor: '#1F441E',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default Admin;
