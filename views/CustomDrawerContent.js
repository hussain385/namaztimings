import {DrawerContentScrollView} from '@react-navigation/drawer';
import React from 'react';
import {Alert, Linking, Share, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {isEmpty, isLoaded, useFirebase} from 'react-redux-firebase';
import CoText from '../views/Text/Text';
import {selectFirebase} from '../store/firebase';

const CustomDrawerContent = ({navigation}) => {
    const {auth} = useSelector(selectFirebase);
    const firebaseApp = useFirebase();

    async function handleSignOut() {
        console.log('logging Out...', auth);
        await firebaseApp.logout();
        navigation.navigate('home');
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                title: 'Namaz Timings',
                message:
                    'Hey, Install this app and never worry about finding a masjid near you again.\n\nhttps://play.google.com/store/apps/details?id=com.namaztimings',
                url: 'https://play.google.com/store/apps/details?id=com.namaztimings',
            });
            if (result.action === Share.sharedAction) {
                // if (result.activityType) {
                //   // shared with activity type of result.activityType
                // } else {
                //   // shared
                // }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <DrawerContentScrollView style={{backgroundColor: '#CEE6B4'}}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={{
                    paddingVertical: 30,
                    borderBottomColor: '#1F441E',
                    borderBottomWidth: 1,
                    marginBottom: 30,
                    flexDirection: 'column',
                    alignSelf: 'center',
                    width: '100%',
                }}>
                <CoText
                    textStyles={[{paddingLeft: 60, color: '#1F441E', fontSize: 18, fontWeight: 'bold'}]}
                    text="Namaz Timings"
                />
                <CoText textStyles={[{paddingLeft: 60, color: '#1F441E'}]} text="Namaztimings.pk"/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('home')}
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                }}>
                <Entypo name="home" size={26} color="#1F441E"/>
                <View style={{marginLeft: 30}}>
                    <CoText textStyles={[{color: '#1F441E'}]} text="Home"/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('SearchStackScreen', {
                        screen: 'Find Masjid',
                    })
                }
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                }}>
                <Icon name="mosque" color="#1F441E" size={19}/>
                <View style={{marginLeft: 30}}>
                    <CoText textStyles={[{color: '#1F441E'}]} text="Find Masjid"/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('FavouriteStackScreen', {
                        screen: 'Favourites',
                    })
                }
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                }}>
                <MaterialCommunityIcons name="star" size={26} color="#1F441E"/>
                <View style={{marginLeft: 30}}>
                    <CoText textStyles={[{color: '#1F441E'}]} text="Favourites"/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                // onPress={() => navigation.navigate('Notifications')}
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                    marginLeft: 6,
                }}>
                <Icon
                    name="clipboard-list"
                    color="#1F441E"
                    size={20}
                    style={{marginRight: 6}}
                />
                <View style={{marginLeft: 30}}>
                    <CoText textStyles={[{color: '#1F441E'}]} text="Notifications"/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onShare}
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                    marginLeft: 2,
                }}>
                <MaterialCommunityIcons name="share" size={26} color="#1F441E"/>
                <View style={{marginLeft: 30}}>
                    <CoText
                        textStyles={[{color: '#1F441E'}]}
                        text="Invite Your Friends"
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Contact Us')}
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                    marginLeft: 4,
                }}>
                <MaterialCommunityIcons name="phone" size={26} color="#1F441E"/>
                <View style={{marginLeft: 30}}>
                    <CoText textStyles={[{color: '#1F441E'}]} text="Contact Us"/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => Linking.openURL('https://masjid-finder-pakistan.web.app/term_conditions')}
                style={{
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                    marginLeft: 4,
                }}>
                <MaterialCommunityIcons name="newspaper" size={26} color="#1F441E"/>
                <View style={{marginLeft: 30}}>
                    <CoText textStyles={[{color: '#1F441E'}]} text="Terms & Conditions"/>
                </View>
            </TouchableOpacity>
            {(() => {
                if (isLoaded(auth) && !isEmpty(auth)) {
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Admin view')}
                                style={{
                                    paddingHorizontal: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 25,
                                    marginLeft: 4,
                                }}>
                                <MaterialCommunityIcons
                                    name="account-circle"
                                    size={26}
                                    color="#1F441E"
                                />
                                <View style={{marginLeft: 30}}>
                                    <CoText textStyles={[{color: '#1F441E'}]} text="Admin view"/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 25,
                                    marginLeft: 4,
                                }}
                                onPress={handleSignOut}>
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={26}
                                    color="#1F441E"
                                />
                                <View style={{marginLeft: 30}}>
                                    <CoText textStyles={[{color: '#1F441E'}]} text="Sign Out"/>
                                </View>
                            </TouchableOpacity>
                        </>
                    );
                } else {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('login')}
                            style={{
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 25,
                                marginLeft: 4,
                            }}>
                            <MaterialCommunityIcons name="logout" size={26} color="#1F441E"/>
                            <View style={{marginLeft: 30}}>
                                <CoText textStyles={[{color: '#1F441E'}]} text="Login"/>
                            </View>
                        </TouchableOpacity>
                    );
                }
            })()}
        </DrawerContentScrollView>
    );
};

export default CustomDrawerContent;
