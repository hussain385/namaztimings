import * as React from 'react';
import {useState} from 'react';
import HeaderComp from '../views/HeaderComp';
import {Divider, Menu, Provider} from 'react-native-paper';
import {Formik} from 'formik';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';

const ERROR = {
  color: 'darkred',
  marginLeft: 10,
  marginTop: 10,
};

const AddContactSchema = Yup.object().shape({
  userEmail: Yup.string().email().required('Email is required'),
  userName: Yup.string().required('Your name is required'),
});

const ContactUs = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <Provider>
      <HeaderComp navigation={navigation} heading="Contact Us" />
      <Formik
        initialValues={{
          options: 'Feedback',
          message: '',
          userName: '',
          userEmail: '',
        }}
        validationSchema={AddContactSchema}
        onSubmit={async (values, {resetForm}) => {
          await firestore()
            .collection('contactForm')
            .add(values)
            .then(a => {
              setLoading(false);
              Alert.alert(
                'Request send successfully',
                'Jazak Allah u Khairan for your message. Admin will review and reply in 24 hours.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      resetForm();
                    },
                  },
                ],
              );
            });
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          values,
          errors,
        }) => (
          <>
            <ScrollView>
              <Text style={{marginLeft: 10, marginTop: 10}}>User Name</Text>
              <View
                style={{
                  borderRadius: 10,
                  marginHorizontal: 10,
                  marginTop: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 5,
                }}>
                <TextInput
                  onChangeText={handleChange('userName')}
                  value={values.userName}
                  onBlur={handleBlur('userName')}
                  style={{
                    paddingHorizontal: 10,
                    backgroundColor: '#EEEEEE',
                    color: 'black',
                  }}
                  placeholder="Enter Your Name..."
                  placeholderTextColor="grey"
                />
              </View>
              {errors.userName && touched.userName && (
                <Text style={ERROR}>{errors.userName}</Text>
              )}
              <Text style={{marginLeft: 10, marginTop: 10}}>User Email</Text>
              <View
                style={{
                  borderRadius: 10,
                  marginHorizontal: 10,
                  marginTop: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 5,
                }}>
                <TextInput
                  onChangeText={handleChange('userEmail')}
                  value={values.userEmail}
                  onBlur={handleBlur('userEmail')}
                  style={{
                    paddingHorizontal: 10,
                    backgroundColor: '#EEEEEE',
                    color: 'black',
                  }}
                  placeholder="Enter Your Email..."
                  placeholderTextColor="grey"
                />
              </View>
              {errors.userEmail && touched.userEmail && (
                <Text style={ERROR}>{errors.userEmail}</Text>
              )}
              <Text style={{marginLeft: 10, marginTop: 10}}>Form Type</Text>
              <Menu
                contentStyle={{
                  marginTop: 80,
                  width: Dimensions.get('screen').width * 0.96,
                }}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <View
                    style={{
                      margin: 10,
                      borderRadius: 10,
                      backgroundColor: '#EDEDED',
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 6.27,
                      elevation: 5,
                    }}>
                    <Text style={{fontSize: 17}}>{values.options}</Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#1F441E',
                        padding: 5,
                        borderRadius: 10,
                      }}
                      onPress={openMenu}>
                      <MaterialCommunityIcons
                        color={'white'}
                        size={20}
                        name="menu-down"
                      />
                    </TouchableOpacity>
                  </View>
                }>
                <Menu.Item
                  onPress={() => {
                    values.options = 'Feedback';
                    closeMenu();
                  }}
                  title="Feedback"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    values.options = 'Report a bug';
                    closeMenu();
                  }}
                  title="Report a bug"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    values.options = 'Queries';
                    closeMenu();
                  }}
                  title="Queries"
                />
              </Menu>
              <Text style={{marginLeft: 10}}>Description</Text>
              <TextInput
                style={{
                  paddingLeft: 10,
                  backgroundColor: '#EDEDED',
                  margin: 10,
                  borderRadius: 10,
                  height: Dimensions.get('screen').height * 0.4,
                  textAlignVertical: 'top',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 5,
                }}
                onChangeText={handleChange('message')}
                onBlur={handleBlur('message')}
                value={values.message}
                placeholderTextColor="grey"
                placeholder="Type Your Message Here"
              />
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
            </ScrollView>
          </>
        )}
      </Formik>
    </Provider>
  );
};

export default ContactUs;
