import React, {PureComponent} from 'react';
import {
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Favbtn from './Favbtn';

export default class MasjidCard extends PureComponent {
  // constructor({
  //   url,
  //   title,
  //   distance,
  //   favId,
  //   address,
  //   timings,
  //   nav,
  //   onRefresh,
  //   latitude,
  //   longitude,
  //   user,
  // }) {
  //   super();
  //   this.url = url;
  //   this.title = title;
  //   this.distance = distance;
  //   this.favId = favId;
  //   this.address = address;
  //   this.timings = timings;
  //   this.nav = nav;
  //   this.onRefresh = onRefresh;
  //   this.latitude = latitude;
  //   this.longitude = longitude;
  //   this.user = user;
  // }
  render() {
    return (
      <View
        key={this.props.favId}
        style={{
          margin: 10,
          backgroundColor: '#ffff',
          borderRadius: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() =>
            this.props.nav.navigate('More Info', {
              name: this.props.title,
              url: this.props.url,
              address: this.props.address,
              timing: this.props.timings,
              favId: this.props.favId,
              distance: this.props.distance,
              latitude: this.props.latitude,
              longitude: this.props.longitude,
              user: this.props.user,
              gLink: this.props.gLink,
              timeStamp: this.props.timeStamp,
            })
          }>
          <ImageBackground
            source={{uri: `${this.props.url}`}}
            style={{
              flex: 1,
              resizeMode: 'cover',
              justifyContent: 'center',
              width: '100%',
              height: 200,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexGrow: 1}} />
              <View style={{top: -50}}>
                <Favbtn
                  favId={this.props.favId}
                  onRefresh={this.props.onRefresh}
                  isBig={true}
                />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={{padding: 5}}>
          <View
            style={{
              flexDirection: 'row',
              margin: 5,
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: 250}}>
              <Text style={{fontSize: 17}}>{this.props.title}</Text>
            </View>
            <View>
              <Text
                onPress={() => {
                  Linking.openURL(`${this.props.gLink}`);
                }}
                style={{color: '#900000', textDecorationLine: 'underline'}}>
                {this.props.distance}KM AWAY
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.nav.navigate('More Info', {
                  name: this.props.title,
                  url: this.props.url,
                  address: this.props.address,
                  timing: this.props.timings,
                  favId: this.props.favId,
                  distance: this.props.distance,
                  latitude: this.props.latitude,
                  longitude: this.props.longitude,
                  user: this.props.user,
                  gLink: this.props.gLink,
                  timeStamp: this.props.timeStamp,
                })
              }
              style={{
                alignItems: 'center',
                backgroundColor: '#1F441E',
                padding: 10,
                borderRadius: 5,
                width: '47%',
                marginVertical: 10,
                marginHorizontal: 10,
              }}>
              <Text style={{color: '#CEE6B4'}}>More Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`${this.props.gLink}`);
              }}
              style={{
                alignItems: 'center',
                padding: 10,
                borderRadius: 5,
                width: '47%',
                marginVertical: 10,
                marginHorizontal: 10,
                backgroundColor: '#CEE6B4',
              }}>
              <Text
                style={{
                  color: '#1F441E',
                }}>
                Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
