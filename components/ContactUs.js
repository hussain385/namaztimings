import * as React from 'react';
import HeaderComp from '../views/HeaderComp';
import {Divider, Menu, Provider} from 'react-native-paper';
import {Formik} from 'formik';
import {ActivityIndicator, Dimensions, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';

const ContactUs = ({navigation}) => {
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
        <Provider>
            <HeaderComp navigation={navigation} heading="Contact Us"/>
            <Formik initialValues={{options: 'Feedback', message: ''}} onSubmit={values => {
                setLoading(true);
                console.log(values);
                setLoading(false);
            }}>{({
                     handleChange,
                     handleBlur,
                     handleSubmit,
                     touched,
                     values,
                     errors,
                 }) => (
                <>
                    <Menu
                        contentStyle={{marginTop: 80, width: Dimensions.get('screen').width * 0.96}}
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<View style={{
                            margin: 10,
                            borderRadius: 10,
                            backgroundColor: '#EDEDED',
                            padding: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{fontSize: 17}}>{values.options}</Text>
                            <TouchableOpacity style={{backgroundColor: '#1F441E', padding: 5, borderRadius: 10}} onPress={openMenu}>
                                <MaterialCommunityIcons color={'white'} size={20} name="menu-down"/>
                            </TouchableOpacity>
                        </View>}>
                        <Menu.Item onPress={() => {
                            values.options = 'Feedback';
                            closeMenu();
                        }} title="Feedback"/>
                        <Divider/>
                        <Menu.Item onPress={() => {
                            values.options = 'Report a bug';
                            closeMenu();
                        }} title="Report a bug"/>
                        <Divider/>
                        <Menu.Item onPress={() => {
                            values.options = 'Quries';
                            closeMenu();
                        }} title="Quries"/>
                    </Menu>
                    <View style={{
                        backgroundColor: '#EDEDED',
                        margin: 10,
                        borderRadius: 10,
                        height: Dimensions.get('screen').height * 0.6,
                    }}>
                        <TextInput
                            style={{paddingLeft: 10}}
                            onChangeText={handleChange('message')}
                            onBlur={handleBlur('message')}
                            value={values.password}
                            placeholderTextColor="grey"
                            placeholder="Type Your Message Here"
                        />
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 15}}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            style={{
                                alignItems: 'center',
                                backgroundColor: '#CEE6B4',
                                padding: 10,
                                borderRadius: 5,
                                width: '95%',
                                marginHorizontal: 10,
                            }}>
                            {!loading ? (
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#1F441E',
                                    }}>
                                    Submit
                                </Text>
                            ) : (
                                <ActivityIndicator color="#1F441E" size="small" />
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}
            < /Formik>
        </Provider>
    );
};

export default ContactUs;
