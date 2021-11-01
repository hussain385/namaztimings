import React, {PureComponent} from 'react';
import {
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class AdminCard extends PureComponent {
  render() {
    return (
      // <View>
      //   <Text>{JSON.stringify(this.props.masjid)}</Text>
      // </View>
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
            this.props.nav.navigate('Admin', {
              masjidId: this.props.masjid.id,
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
            }}
          />
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.nav.navigate('Admin', {
                  data: this.props.masjid,
                  masjidId: this.props.masjid.key,
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
