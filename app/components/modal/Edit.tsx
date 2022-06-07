import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { Formik } from "formik"
import _, { isNil } from "lodash"
import moment from "moment"
import React, { useState } from "react"
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
// import DateTimePickerModal from "react-native-modal-datetime-picker"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Button, HelperText, TextInput } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import { pushNotification, selectFirebase } from "../../hooks/firebase"
import axios from "axios"
import { getFcmToken } from "../../hooks/token"
import { Masjid, User } from "../../types/firestore"

interface EditProps {
  masjid: Partial<Masjid>
  isRequest?: boolean
  value?: "Edit" | "View"
  isAdd?: boolean
  handleChange?: any
  userInfo?: boolean
}

const Edit: React.FC<EditProps> = ({
  masjid,
  isRequest = true,
  value = "Edit",
  isAdd = false,
  handleChange: returnChange = null,
  userInfo = true,
}) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [namazTime, setNamazTime] = useState("")
  const EditSchema = Yup.object().shape({
    userName: !isAdd ? Yup.string().required("your name is required") : Yup.string().nullable(true),
    userPhone: !isAdd
      ? Yup.string()
          .matches(
            /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
            "Phone number is not valid",
          )
          .min(11, "phone no. is short, please check again")
          .max(16, "phone no. is long, please check again")
          .required("phone number is required")
      : Yup.string().nullable(true),
    timing: Yup.object()
      .shape({
        isha: Yup.string().test("isDateTime", "not a valid Time", (value1) =>
          moment(value1, "hh:mm A").isValid(),
        ),
        fajar: Yup.string().test("isDateTime", "not a valid Time", (value1) =>
          moment(value1, "hh:mm A").isValid(),
        ),
        zohar: Yup.string().test("isDateTime", "not a valid Time", (value1) =>
          moment(value1, "hh:mm A").isValid(),
        ),
        asar: Yup.string().test("isDateTime", "not a valid Time", (value1) =>
          moment(value1, "hh:mm A").isValid(),
        ),
        magrib: Yup.string().test("isDateTime", "not a valid Time", (value1) =>
          moment(value1, "hh:mm A").isValid(),
        ),
        // jummuah: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
      })
      .required(),
  })
  console.log(masjid.uid, "===> id")

  const showTimePicker = (namazName: string) => {
    setTimePickerVisibility(true)
    setNamazTime(namazName)
  }

  const { profile } = useSelector(selectFirebase)

  // async function submitRequest() {
  //   const prevTime = {
  //     userName: '',
  //     userContact: '',
  //     isha: isha,
  //     fajar: fajar,
  //     zohar: zohar,
  //     asar: asar,
  //     magrib: magrib,
  //   };
  //   if (_.isEqual(time, prevTime) && isRequest) {
  //     console.log(isRequest);
  //     Alert.alert('Cannot Process', 'Please fill the form correctly');
  //   } else {
  //     if (isAdd) {
  //       setModalVisible(!modalVisible);
  //       return handleChange(time);
  //     }
  //     if (isRequest) {
  //       try {
  //         await firestore
  //           .collection('requests')
  //           .add({
  //             timing: time,
  //             adminId,
  //             isRead: false,
  //             createdAt: firestore.Timestamp.now(),
  //           })
  //           .then(a => {
  //             firestore
  //               .collection('Masjid')
  //               .doc(uid)
  //               .update({
  //                 requestList: firestore.FieldValue.arrayUnion(a.id),
  //               })
  //               .then(value1 => {
  //                 Alert.alert(
  //                   'Request Send!',
  //                   'Request has been forwarded to the admin',
  //                   [
  //                     {
  //                       text: 'Ok',
  //                       onPress: () => setModalVisible(!modalVisible),
  //                     },
  //                   ],
  //                   {cancelable: false},
  //                 );
  //               });
  //           });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     } else {
  //       try {
  //         await firestore
  //           .collection('Masjid')
  //           .doc(uid)
  //           .update({
  //             timing: {
  //               ...time,
  //             },
  //           })
  //           .then(a => {
  //             console.log('data sent');
  //             setModalVisible(!modalVisible);
  //             // GetRadMasjidData1().GetData();
  //           });
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   }
  // }

  const hideTimePicker = () => {
    setTimePickerVisibility(false)
  }

  const handleConfirm = (
    event: DateTimePickerEvent,
    newTime: moment.MomentInput,
    setFieldValue: {
      (field: string, value: any, shouldValidate?: boolean | undefined): void
      (arg0: string, arg1: string): void
    },
  ) => {
    if (event.type === "neutralButtonPressed") {
      setFieldValue("timing." + namazTime, null)
    } else if (event.type === "set") {
      const timeString = moment(newTime).format("hh:mm A")
      console.log(timeString)
      setFieldValue("timing." + namazTime, timeString)
      console.log("A Time has been picked: ", timeString)
    }

    hideTimePicker()
  }

  async function onRequest(
    values: any,
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void },
  ) {
    const token = await getFcmToken()
    await firestore()
      .collection("requests")
      .add({
        ...values,
        isRead: false,
        timeStamp: firestore.Timestamp.now(),
        token,
      })
      .then(
        (a) => {
          firestore()
            .collection("Masjid")
            .doc(masjid.uid)
            .update({
              requestList: firestore.FieldValue.arrayUnion(a.id),
            })
            .then(
              async () => {
                if (masjid.adminId === "" || isNil(masjid.adminId)) {
                  setSubmitting(false)
                  Alert.alert(
                    "Request Send!",
                    "Jazak Allah u Khairan, your namaz timings updates are sent to admin, he will review and approve in 24 hours.",
                    [
                      {
                        text: "Ok",
                        onPress: async () => {
                          setModalVisible(!modalVisible)
                          await axios
                            .post("https://namaz-timings-pakistan.herokuapp.com/email", {
                              to: "namaz.timing.pakistan@gmail.com",
                              body: `Dear Admin,\n${masjid.name} has received an time edit request from ${values.userName}`,
                              title: "Admin Notification",
                            })
                            .catch((e) => {
                              console.log(e)
                            })
                        },
                      },
                    ],
                    { cancelable: false },
                  )
                } else {
                  firestore()
                    .collection("users")
                    .doc(masjid.adminId)
                    .get()
                    .then((value1) => {
                      return pushNotification({
                        to: (value1.data() as User).token || "",
                        notification: {
                          title: "Request",
                          body: `You got request of namaz timings from ${masjid.name}`,
                        },
                      })
                    })
                    .then(() => {
                      setSubmitting(false)
                      Alert.alert(
                        "Request Send!",
                        "Jazak Allah u Khairan, your namaz timings updates are sent to admin, he will review and approve in 24 hours.",
                        [
                          {
                            text: "Ok",
                            onPress: async () => {
                              setModalVisible(!modalVisible)

                              await axios
                                .post("https://namaz-timings-pakistan.herokuapp.com/email", {
                                  to: masjid.user?.email,
                                  body: `Dear Admin,\n${masjid.name} has received an time edit request from ${values.userName}`,
                                  title: "Admin Notification",
                                })
                                .catch((e) => {
                                  console.log(e)
                                })
                            },
                          },
                        ],
                        { cancelable: false },
                      )
                    })
                }
              },
              (reason) => {
                firestore()
                  .collection("requests")
                  .doc(a.id)
                  .delete()
                  .then(() => {
                    setSubmitting(false)
                    console.warn(reason)
                    Alert.alert(
                      "Error",
                      reason.message,
                      [
                        {
                          text: "Ok",
                          onPress: () => setModalVisible(!modalVisible),
                        },
                      ],
                      { cancelable: false },
                    )
                  })
              },
            )
        },
        (reason) => {
          Alert.alert(
            "Error",
            reason.message,
            [
              {
                text: "Ok",
                onPress: () => setModalVisible(!modalVisible),
              },
            ],
            { cancelable: false },
          )
        },
      )
  }

  async function onUpdate(
    values: { userName?: string; userPhone?: string; timing: any },
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void },
  ) {
    await firestore()
      .collection("Masjid")
      .doc(masjid.uid)
      .update({
        timeStamp: firestore.Timestamp.now(),
        timing: {
          ...values.timing,
        },
      })
      .then(
        async () => {
          const masjidData = (
            await firestore().collection("Masjid").doc(masjid.uid).get()
          ).data() as Masjid
          if (masjidData.tokens) {
            for (const token of masjidData.tokens) {
              // await messaging()
              //   .sendMessage({
              //     to: token,
              //     data: {
              //       title: "masjid.name",
              //       body: "Timings has been updated",
              //     },
              //   })
              await pushNotification({
                to: token,
                notification: {
                  title: masjid.name || "unKnown",
                  body: "Timings has been updated",
                },
              }).then(
                () => {
                  // console.log(value1.data, "response from axios")
                  Alert.alert("Notifications", "Successfully sent notifications to the users")
                },
                (reason) => {
                  console.log(reason)
                  Alert.alert("Notifications", "Couldn't sent notifications to the users")
                },
              )
            }
          }
          setSubmitting(false)
          console.log("data sent")
          setModalVisible(!modalVisible)
        },
        (reason) => {
          Alert.alert(reason.message)
          setModalVisible(!modalVisible)
        },
      )
  }

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{ flexDirection: "row", paddingRight: 10 }}
        onPress={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginTop: 3,
            fontWeight: "200",
            color: "black",
          }}
        >
          {value}
        </Text>
        <Icon name="square-edit-outline" size={24} style={{ marginTop: 1 }} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <ScrollView>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Namaz Timings</Text>
              <Formik
                initialValues={{
                  userName: profile.name || "",
                  userPhone: profile.phone || "",
                  timing: {
                    isha: masjid.timing?.isha || "",
                    fajar: masjid.timing?.fajar || "",
                    zohar: masjid.timing?.zohar || "",
                    asar: masjid.timing?.asar || "",
                    magrib: masjid.timing?.magrib || "",
                    jummah: masjid.timing?.jummah || "",
                    eidUlAddah: masjid.timing?.eidUlAddah || "",
                    eidUlFitr: masjid.timing?.eidUlFitr || "",
                  },
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true)
                  if (_.isEqual(values.timing, masjid.timing) && isRequest) {
                    console.log(isRequest)
                    Alert.alert("Cannot Process", "Please fill the form correctly")
                  } else if (isAdd) {
                    setModalVisible(!modalVisible)
                    setSubmitting(false)
                    return returnChange(values.timing)
                  } else if (isRequest) {
                    await onRequest(values, setSubmitting)
                  } else {
                    await onUpdate(values, setSubmitting)
                  }
                }}
                validationSchema={EditSchema}
              >
                {({
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  setFieldValue,
                }) => (
                  <>
                    {userInfo && (
                      <>
                        <View
                          style={{
                            width: Dimensions.get("screen").width * 0.75,
                          }}
                        >
                          <TextInput
                            label={"Requestor Name"}
                            mode={"outlined"}
                            onChangeText={handleChange("userName")}
                            onBlur={handleBlur("userName")}
                            value={values.userName}
                            style={{
                              paddingHorizontal: 10,
                              backgroundColor: "#ffff",
                              color: "black",
                            }}
                            placeholder="Enter Your Name..."
                            placeholderTextColor="grey"
                            error={touched.userName && Boolean(errors.userName)}
                          />
                          <HelperText
                            type="error"
                            visible={touched.userName && Boolean(errors.userName)}
                          >
                            {touched.userName && errors.userName}
                          </HelperText>
                        </View>
                        <View
                          style={{
                            width: Dimensions.get("screen").width * 0.75,
                          }}
                        >
                          <TextInput
                            label={"Requestor Phone"}
                            mode={"outlined"}
                            onChangeText={handleChange("userPhone")}
                            onBlur={handleBlur("userPhone")}
                            value={values.userPhone}
                            keyboardType="phone-pad"
                            style={{
                              paddingHorizontal: 10,
                              backgroundColor: "#ffff",
                              color: "black",
                            }}
                            placeholder="Enter Your Phone Number..."
                            placeholderTextColor="grey"
                            error={touched.userPhone && Boolean(errors.userPhone)}
                          />
                          <HelperText
                            type="error"
                            visible={touched.userPhone && Boolean(errors.userPhone)}
                          >
                            {touched.userPhone && errors.userPhone}
                          </HelperText>
                        </View>
                      </>
                    )}
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Fajr :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable onPress={() => showTimePicker("fajar")}>
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.fajar || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Zohr :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable onPress={() => showTimePicker("zohar")}>
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.zohar || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Asar :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable onPress={() => showTimePicker("asar")}>
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.asar || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Magrib :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable onPress={() => showTimePicker("magrib")}>
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.magrib || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Isha :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable onPress={() => showTimePicker("isha")}>
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.isha || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Jumu&apos;ah :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable
                          onPress={() => showTimePicker("jummah")}
                          style={{ minWidth: 70 }}
                        >
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.jummah || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Eid Ul Adah :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable
                          onPress={() => showTimePicker("eidUlAddah")}
                          style={{ minWidth: 70 }}
                        >
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.eidUlAddah || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          flexGrow: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>Eid Ul Fitr :</Text>
                      </View>
                      <View style={styles.editTime}>
                        <Pressable
                          onPress={() => showTimePicker("eidUlFitr")}
                          style={{ minWidth: 70 }}
                        >
                          <Text style={{ fontSize: 17, textAlign: "center" }}>
                            {values.timing.eidUlFitr || "-- : --"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View
                      style={{
                        margin: 15,
                        borderBottomColor: "#C4C4C4",
                        borderBottomWidth: 1,
                      }}
                    />
                    <View style={{ flexDirection: "row" }}>
                      <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => {
                          setModalVisible(!modalVisible)
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </Pressable>
                      <Button
                        loading={isSubmitting}
                        onPress={handleSubmit}
                        mode={"contained"}
                        disabled={isSubmitting}
                        uppercase={false}
                        style={[styles.buttonClose, { borderRadius: 10 }]}
                      >
                        {!isAdd ? (isRequest ? "Request" : "Confirm") : "Confirm"}
                      </Button>
                    </View>
                    {isTimePickerVisible && (
                      <DateTimePicker
                        is24Hour={false}
                        mode="time"
                        neutralButtonLabel={"Delete"}
                        locale="en_GB"
                        // onConfirm={(e) => handleConfirm(e, setFieldValue)}
                        onChange={(event, date) => handleConfirm(event, date, setFieldValue)}
                        // onTouchCancel={hideTimePicker}
                        // onCancel={hideTimePicker}
                        value={new Date(Date.now())}
                      />
                    )}
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
// 00000071
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    elevation: 2,
    padding: 10,
    width: "40%",
  },
  buttonClose: {
    backgroundColor: "#1F441E",
    marginLeft: 15,
  },
  buttonOpen: {
    backgroundColor: "#5C5C5C",
    marginRight: 15,
  },
  centeredView: {
    alignItems: "center",
    backgroundColor: "#00000071",
    flex: 1,
    justifyContent: "center",
  },
  editTime: {
    backgroundColor: "#dddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  modalView: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    margin: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  // textStyle1: {
  //   color: "#CEE6B4",
  //   fontWeight: "bold",
  //   textAlign: "center",
  // },
})

export default Edit
