import { Formik } from "formik"
import _ from "lodash"
import firestore from "@react-native-firebase/firestore"
import React, { useEffect, useState } from "react"
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { ActivityIndicator, FAB } from "react-native-paper"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useSelector } from "react-redux"
import { populate, useFirestore, useFirestoreConnect } from "react-redux-firebase"
import * as Yup from "yup"
import HeaderComp from "../header/HeaderComp"
import NotificationCard from "../cards/NotificationCard"
import { selectFirebase, selectFirestore } from "../../hooks/firebase"
import axios from "axios"
import { storage } from "../../redux/store"

const Notification = ({ navigation, route: { params } }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { masjidId, masjidName, adminId } = params
  console.log(masjidId, "====> id from noti")
  const { auth } = useSelector(selectFirebase)
  const firestoreData = useFirestore()
  const [loading, setLoading] = useState(false)
  const populates = [
    {
      child: "announcementList",
      root: "announcement",
      childAlias: "announcement",
    },
  ]
  useFirestoreConnect([
    {
      collection: "Masjid",
      doc: masjidId,
      populates,
      storeAs: "tempAnnouncement",
    },
  ])

  const firestore1 = useSelector(selectFirestore)
  const masjidData = populate(firestore1, "tempAnnouncement", populates)
  // console.log(firestore.status, 'on notify');

  const data = _.map(masjidData?.announcement, (rawData) => {
    return {
      ...rawData,
      // createdAt: Date.parse(rawData.createdAt),
    }
  })

  useEffect(() => {
    storage.delete("notification")
  }, [])

  // console.log(auth.uid === adminId);

  return (
    <View>
      <HeaderComp heading="Announcements" navigation={navigation} />
      {firestore1.status.requested.tempAnnouncement && data.length >= 1 ? (
        <FlatList
          style={{ height: Dimensions.get("screen").height * 0.82 }}
          data={data.reverse()}
          renderItem={({ item }) => (
            <NotificationCard
              data={item}
              masjidName={masjidName}
              masjidId={masjidId}
              adminId={adminId}
            />
          )}
        />
      ) : firestore1.status.requesting.tempAnnouncement ? (
        <View
          style={{
            height: Dimensions.get("screen").height,
          }}
        >
          <ActivityIndicator size={40} color="#1F441E" />
        </View>
      ) : (
        <View
          style={{
            height: Dimensions.get("screen").height * 0.82,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign color="#1F441E" name="folder1" size={70} />
          <Text style={{ fontSize: 20, color: "#1F441E" }}>No News & Announcements</Text>
        </View>
      )}
      {auth.uid === adminId && auth.uid !== undefined && (
        <View>
          <FAB style={styles.fab} small icon="plus" onPress={() => setModalVisible(true)} />
          <Modal animationType="slide" transparent={true} visible={modalVisible}>
            <Formik
              initialValues={{
                description: "",
              }}
              validationSchema={Yup.object().shape({
                description: Yup.string().required("description is required"),
              })}
              onSubmit={(values) => {
                setLoading(true)
                firestoreData
                  .collection("announcement")
                  .add({
                    createdAt: firestoreData.Timestamp.now(),
                    description: values.description,
                  })
                  .then(async (r) => {
                    firestoreData
                      .collection("Masjid")
                      .doc(masjidId)
                      .update({
                        announcementList: firestoreData.FieldValue.arrayUnion(r.id),
                      })
                      .then(
                        async () => {
                          const masjidTokens = await firestore()
                            .collection("Masjid")
                            .doc(masjidId)
                            .get()
                          if (masjidTokens.data().tokens) {
                            console.log(masjidTokens.data().tokens, "===>some")
                            for (const token of masjidTokens.data().tokens) {
                              await axios
                                .post(
                                  "https://fcm.googleapis.com/fcm/send",
                                  {
                                    to: token,
                                    notification: {
                                      title: masjidTokens.data().name,
                                      body: values.description,
                                    },
                                    data: {
                                      announcement: true,
                                    },
                                  },
                                  {
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization:
                                        "key=AAAAE5W6Aqg:APA91bFw_t03bZFaOIdMQj-irRXr5eygS8UBqL3Vd7UYUpS9u3n96rCPxiwfTLBpyb69og2zOr7amP2bpgKVqjzY7qUdxd2Etdfkxm7qik013Z6cUrzji1P2Q-ehfl-RvcWQ91ROD_4G",
                                    },
                                  },
                                )
                                .then(
                                  () => {
                                    setModalVisible(false)
                                    setLoading(false)
                                  },
                                  (reason) => {
                                    console.log(reason)
                                  },
                                )
                            }
                          }
                        },
                        (reason) => {
                          Alert.alert(reason.message)
                          setModalVisible(!modalVisible)
                        },
                      )
                  })
              }}
            >
              {({ values, handleChange, errors, handleBlur, handleSubmit, touched }) => (
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>New Announcement</Text>
                    <View
                      style={{
                        width: Dimensions.get("screen").width * 0.75,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 10,
                          marginHorizontal: 10,
                          marginTop: 5,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 5,
                          },
                          shadowOpacity: 0.34,
                          shadowRadius: 6.27,
                          elevation: 5,
                        }}
                      >
                        <TextInput
                          multiline={true}
                          onChangeText={handleChange("description")}
                          onBlur={handleBlur("description")}
                          value={values.description}
                          scrollEnabled={true}
                          style={{
                            paddingHorizontal: 10,
                            backgroundColor: "#EEEEEE",
                            color: "black",
                            maxHeight: 200,
                            overflow: "scroll",
                          }}
                          keyboardType="numbers-and-punctuation"
                          placeholder="Enter Your Notification..."
                          placeholderTextColor="grey"
                        />
                        {errors.description && touched.email && (
                          <Text style={styles.error}>{errors.description}</Text>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => {
                          setModalVisible(!modalVisible)
                          setLoading(false)
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        disabled={loading}
                        style={[styles.button, styles.buttonClose]}
                        onPress={handleSubmit}
                      >
                        {!loading ? (
                          <Text
                            style={{
                              textAlign: "center",
                              color: "#ffff",
                            }}
                          >
                            Submit
                          </Text>
                        ) : (
                          <ActivityIndicator color="#ffff" size={18} />
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            </Formik>
          </Modal>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    elevation: 2,
    padding: 10,
    width: "30%",
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
  // editTime: {
  //   backgroundColor: "#dddd",
  //   borderRadius: 8,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  // },
  fab: {
    backgroundColor: "#1F441E",
    bottom: 0,
    margin: 16,
    padding: 10,
    position: "absolute",
    right: 0,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
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
  //   color: "white",
  //   fontWeight: "bold",
  //   textAlign: "center",
  // },
})

export default Notification
