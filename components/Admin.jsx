import _ from 'lodash';
import React from 'react';
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
import {useSelector} from 'react-redux';
import {
  isEmpty,
  isLoaded,
  populate,
  useFirestoreConnect,
} from 'react-redux-firebase';
import {modifyData} from '../store/firebase';
import {headerStyles, textStyles} from '../theme/styles/Base';
import Edit from '../views/Edit';
import CoText from '../views/Text/Text';

const populates = [
  {child: 'requestList', root: 'requests', childAlias: 'requests'},
  {child: 'adminId', root: 'users', childAlias: 'admin'},
];

const Admin = ({navigation}) => {
  const [notify, setNotify] = React.useState(0);
  const {auth, profile} = useSelector(state => state.firebase);
  useFirestoreConnect([
    {
      collection: 'Masjid',
      where: !profile.isAdmin && [
        ['adminId', '==', isLoaded(auth) && !isEmpty(auth) ? auth.uid : ''],
      ],
      storeAs: 'myMasjids',
      populates,
    },
  ]);
  const snapshot = populate(
    useSelector(state => state.firestore),
    'myMasjids',
    populates,
  );
  console.log('From admin', snapshot);
  React.useEffect(() => {
    if (isLoaded(snapshot)) {
      setNotify(0);
      _.map(snapshot, doc => {
        setNotify(prevState => prevState + doc.requests?.length);
      });
    }

    return () => {
      console.log('unsubscribing....');
    };
  }, [snapshot]);

  return (
    <SafeAreaView>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.navigate('home')}>
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
            onPress={() => navigation.navigate('adminNotification')}
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
      {/*{error && (*/}
      {/*  <View>*/}
      {/*    <Text>{error}</Text>*/}
      {/*  </View>*/}
      {/*)}*/}
      {!isLoaded(snapshot) && (
        <ActivityIndicator color="#1F441E" size="large" />
      )}
      {snapshot ? (
        <>
          {_.map(snapshot, (doc, id) => {
            const data = modifyData(doc, id, 0);
            return (
              <ScrollView
                style={styles.scrollView}
                key={id}
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
                          paddingLeft: 15,
                          marginTop: 10,
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
                        style={{paddingRight: 18, paddingLeft: 13}}
                      />
                      <Text style={{maxWidth: 280, marginTop: 2}}>
                        {doc.admin && doc.admin.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Icon
                        name="phone-alt"
                        color="#5C5C5C"
                        size={20}
                        style={{
                          paddingRight: 18,
                          paddingLeft: 13,
                          marginTop: 5,
                        }}
                      />
                      <Text style={{maxWidth: 280, marginTop: 0}}>
                        {doc.admin && doc.admin.phone}
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
                      uid={id}
                      isRequest={false}
                      userInfo={false}
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
                      onPress={() =>
                        navigation.navigate('Notification', {
                          masjidId: id,
                          masjidName: data.name,
                          adminId: data.admin.id,
                        })
                      }>
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
