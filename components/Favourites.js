import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import {Header} from 'react-native-elements';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const Item = props => (
  <Card
    style={{
      borderRadius: 5,
      margin: 10,
      shadowOpacity: 10,
      elevation: 20,
    }}>
    <Card.Cover
      source={{
        uri: `${props.pictureURL}`
      }}
    />
    <Card.Actions style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', margin: 5}}>
        <View style={{flexGrow: 1}}>
          <Text>{props.title}</Text>
        </View>
        <View>
          <Text>0 km</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{flexGrow: 1}}>
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              width: 160,
              marginVertical: 10,
              borderRadius: 5,
              backgroundColor: '#364547',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: '#ffff',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              width: 160,
              marginVertical: 10,
              borderRadius: 5,
              backgroundColor: '#CEE6B4',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: '#1F441E',
              }}>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card.Actions>
  </Card>
);

const Favourites = ({navigation}) => {
  const [masjidData, setmasjidData] = React.useState(null);

  React.useEffect(() => {
    const fetchMasjidData = async () => {
      const masjids = await firestore()
        .collection('Masjid')
        .get()
        .then(querySnapshot => {
          console.log('Total users: ', querySnapshot.size);
          let data = [];
          querySnapshot.forEach(documentSnapshot => {
            console.log(
              'User ID: ',
              documentSnapshot.id,
              documentSnapshot.data(),
            );
            data.push({id: documentSnapshot.id, ...documentSnapshot.data()});
          });
          return data;
        });
      setmasjidData(masjids);
    };
    fetchMasjidData();
  }, []);

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };
  const renderItem = ({item}) => (
    <Item
      title={item.name}
      address={item.address}
      url={item.pictureURL}
      timing={item.timing}
    />
  );
  return (
    <View>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon
              name="bars"
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
              Favourites
            </Text>
          </View>
        }
        rightComponent={
          <Icon
            name="bell"
            color="#ffff"
            size={26}
            style={{paddingRight: 10}}
          />
        }
        backgroundColor="#1F441E"
      />
      {/* <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View>
            {masjidData !== null ? (
              masjidData.map((masjid, id) => (
                
              ))
            ) : (
              <ActivityIndicator size="small" color="#1F441E" />
            )}

          </View>
        </ScrollView>
      </SafeAreaView> */}
      <FlatList
        data={masjidData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{marginBottom:140}}
      />
    </View>
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

export default Favourites;
