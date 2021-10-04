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
  render() {
    return (
      <View
        key={this.props.masjid.key}
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
              masjid: this.props.masjid,
              // name: this.props.masjid.name,
              // url: this.props.masjid.pictureURL,
              // address: this.props.masjid.address,
              // timing: this.props.masjid.timings,
              // favId: this.props.masjid.favId,
              // distance: this.props.masjid.distance,
              // latitude: this.props.masjid.g.geopoint.latitude,
              // longitude: this.props.masjid.g.geopoint.longitude,
              // user: this.props.masjid.user,
              // gLink: this.props.masjid.gLink,
              // timeStamp: this.props.masjid.timeStamp,
            })
          }>
          <ImageBackground
            source={{uri: `${this.props.masjid.pictureURL}`}}
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
                  favId={this.props.masjid.key}
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
              <Text style={{fontSize: 17}}>{this.props.masjid.name}</Text>
            </View>
            <View>
              <Text
                onPress={() => Linking.openURL(`${this.props.masjid.gLink}`)}
                style={{color: '#900000', textDecorationLine: 'underline'}}>
                {this.props.masjid.distance}KM AWAY
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
                  masjid: this.props.masjid,
                  // name: this.props.masjid.title,
                  // url: this.props.masjid.pictureURL,
                  // address: this.props.masjid.address,
                  // timing: this.props.masjid.timings,
                  // favId: this.props.masjid.favId,
                  // distance: this.props.masjid.distance,
                  // latitude: this.props.masjid.g.geopoint.latitude,
                  // longitude: this.props.masjid.g.geopoint.longitude,
                  // user: this.props.masjid.user,
                  // gLink: this.props.masjid.gLink,
                  // timeStamp: this.props.masjid.timeStamp,
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
