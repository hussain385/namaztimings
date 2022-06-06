import { Formik } from "formik"
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
import * as Yup from "yup"
import HeaderComp from "../header/HeaderComp"
import NotificationCard from "../cards/NotificationCard"
import { selectFirebase } from "../../hooks/firebase"
import axios from "axios"
import { storage } from "../../redux/store"
import { HomePropsType } from "../../navigation"
import { Announcement, Masjid } from "../../types/firestore"

const Notification: React.FC<HomePropsType<"Notifications">> = ({
  navigation,
  route: { params },
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { masjid } = params
  const { auth, profile } = useSelector(selectFirebase)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  // const firestoreData = useFirestore()
  const [loading, setLoading] = useState(false)
  // const populates = [
  //   {
  //     child: "announcementList",
  //     root: "announcement",
  //     childAlias: "announcement",
  //   },
  // ]
  // useFirestoreConnect([
  //   {
  //     collection: "Masjid",
  //     doc: masjid.uid,
  //     populates,
  //     storeAs: "tempAnnouncement",
  //   },
  // ])
  // const firestore1 = useSelector(selectFirestore)
  //
  // const masjidData = populate(firestore1, "tempAnnouncement", populates)
  // console.log(masjidData, "====> id from noti")
  // console.log(firestore.status, 'on notify');

  // const data: Announcement[] = _.map(masjidData?.announcement, (rawData) => {
  //   return {
  //     ...rawData,
  //     // createdAt: Date.parse(rawData.createdAt),
  //   }
  // })
  console.log(auth.uid === masjid.adminId, auth.uid !== undefined, "<==== from notification")

  useEffect(() => {
    storage.delete("notification")
    const subscriber = firestore()
      .collection("Masjid")
      .doc(masjid.uid)
      .onSnapshot(async (snapshot) => {
        const data = snapshot.data() as Masjid
        const announcementsData = data.announcementList?.map(async (value) => {
          const annData = await firestore().collection("announcement").doc(value).get()
          return { ...(annData.data() as Announcement), id: annData.id }
        })
        if (announcementsData) {
          const doc = await Promise.all(announcementsData)
          setAnnouncements(doc)
        }
      })

    return () => subscriber()
  }, [])

  // console.log(auth.uid === adminId);

  return (
    <View>
      <HeaderComp heading="Announcements" />
      {announcements.length >= 1 ? (
        <FlatList
          style={{ height: Dimensions.get("screen").height * 0.82 }}
          data={announcements.reverse()}
          renderItem={({ item }) => <NotificationCard masjid={masjid} announcement={item} />}
        />
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
      {auth.uid !== undefined && (auth.uid === masjid.adminId || profile.isAdmin) && (
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
                firestore()
                  .collection("announcement")
                  .add({
                    createdAt: firestore.Timestamp.now(),
                    description: values.description,
                  })
                  .then(async (r) => {
                    firestore()
                      .collection("Masjid")
                      .doc(masjid.uid)
                      .update({
                        announcementList: firestore.FieldValue.arrayUnion(r.id),
                      })
                      .then(
                        async () => {
                          if (masjid.tokens) {
                            console.log(masjid.tokens, "===>some")
                            for (const token of masjid.tokens) {
                              await axios
                                .post(
                                  "https://fcm.googleapis.com/fcm/send",
                                  {
                                    to: token,
                                    notification: {
                                      title: masjid.name,
                                      body: values.description,
                                    },
                                    data: {
                                      announcement: true,
                                      id: r.id,
                                      createdAt: firestore.Timestamp.now(),
                                      description: values.description,
                                      masjidId: masjid.uid,
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
                        {errors.description && (
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
  error: {
    color: "red",
  },
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
})

export default Notification
