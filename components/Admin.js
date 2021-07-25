/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {useCollectionOnce} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../store/fireAuth';
import _ from 'lodash';

const Admin = ({navigation}) => {
  const user = React.useContext(AuthContext);
  if (_.isNull(user) || _.isUndefined(user)) {
    return (
      <SafeAreaView>
        <Header
          containerStyle={{
            shadowOpacity: 50,
            elevation: 50,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
          backgroundColor="#1F441E"
        />
      </SafeAreaView>
    );
  } else {
    const [snapshot, loading, error] = useCollectionOnce(
      firestore().collection('Masjid').where('adminId', '==', user.uid),
    );
    console.log(snapshot, error);
    return (
      <SafeAreaView>
        <Header
          containerStyle={{
            shadowOpacity: 50,
            elevation: 50,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
            {snapshot.docs.map(doc => (
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
                        style={{fontSize: 24, color: '#5C5C5C', marginTop: -5}}>
                        {doc.data().name}
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
                          paddingRight: 10,
                          paddingLeft: 13,
                          marginTop: 5,
                        }}
                      />
                      <Text style={{maxWidth: 280, marginTop: 5}}>
                        {doc.data().address}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Icon
                        name="user-alt"
                        color="#5C5C5C"
                        size={20}
                        style={{paddingRight: 10, paddingLeft: 10}}
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
                        style={{paddingRight: 10, paddingLeft: 10}}
                      />
                      <Text style={{maxWidth: 280, marginTop: 0}}>
                        +92 323 0000000
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={{
                          uri: `${doc.data().pictureURL}`,
                        }}
                        style={{
                          width: 200,
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
                      <Text style={{fontSize: 17}}>
                        {doc.data().timing.fajar}
                      </Text>
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
                      <Text style={{fontSize: 17}}>
                        {doc.data().timing.zohar}
                      </Text>
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
                      <Text style={{fontSize: 17}}>
                        {doc.data().timing.asar}
                      </Text>
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
                      <Text style={{fontSize: 17}}>
                        {doc.data().timing.magrib}
                      </Text>
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
                      <Text style={{fontSize: 17}}>
                        {doc.data().timing.isha}
                      </Text>
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
              // <Text key={doc.id}>{doc.data().pictureURL)}</Text>
            ))}
          </>
        ) : null}
      </SafeAreaView>
    );
  }
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
