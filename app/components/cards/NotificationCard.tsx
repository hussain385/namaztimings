import moment from "moment"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { Card } from "react-native-paper"
import { selectFirebase } from "../../hooks/firebase"
import { Announcement, Masjid } from "../../types/firestore"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import {
  addOrModifyAnnouncement,
  AnnouncementStatus,
  useAnnouncements,
} from "../../redux/announcementSlicer"
import firestore from "@react-native-firebase/firestore"

const NotificationCard = ({
  masjid,
  announcement,
}: {
  masjid: Masjid
  announcement: Announcement
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const { auth, profile } = useAppSelector(selectFirebase)
  const localAnnouncement = useAppSelector(useAnnouncements)
  const dispatch = useAppDispatch()

  const Delete = async () => {
    console.log(masjid.uid, announcement.id, "the Delete")
    setLoading(true)
    await firestore()
      .collection("announcement")
      .doc(announcement.id)
      .delete()
      .then(() => {
        firestore()
          .collection("Masjid")
          .doc(masjid.uid)
          .update({
            announcementList: firestore.FieldValue.arrayRemove(announcement.id),
          })
          .then(() => {
            Alert.alert("Announcement", "Your announcement has been deleted Successfully!", [
              {
                text: "Ok",
                onPress: () => {
                  setModalVisible(false)
                },
              },
            ])
          })
        setLoading(false)
      })
  }

  useEffect(() => {
    return () => {
      dispatch(
        addOrModifyAnnouncement({
          status: AnnouncementStatus.Read,
          id: announcement.id,
          masjidId: masjid.uid!,
        }),
      )
    }
    // setLocalAnnouncement(
    //   localAnnouncement?.set(announcement.id, {
    //     status: AnnouncementStatus.Read,
    //     id: announcement.id,
    //     masjidId: masjid.uid!,
    //   }),
    // )
  }, [])

  return (
    <>
      <Card
        onPress={() => {
          setModalVisible(true)
        }}
        style={{
          borderRadius: 5,
          margin: 10,
          shadowOpacity: 10,
          elevation: 5,
          borderBottomColor:
            localAnnouncement.find((e) => e.id === announcement.id)?.status ===
            AnnouncementStatus.Read
              ? "grey"
              : "#229704",
          borderBottomWidth: 10,
        }}
      >
        <Card.Actions>
          <View style={{ width: "100%", padding: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontSize: 20 }}>{masjid.name}</Text>
              </View>
              <View>
                <Text style={{ marginTop: 6 }}>
                  Dated: {moment(announcement.createdAt?.seconds * 1000).format("DD/MM/YYYY")}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: 7,
                height: 40,
                marginBottom: -10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 17,
                    width: Dimensions.get("screen").width * 0.72,
                  }}
                >
                  {announcement.description}
                </Text>
              </View>
            </View>
          </View>
        </Card.Actions>
      </Card>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Namaz Timings</Text>
            <View
              style={{
                marginBottom: 10,
                backgroundColor: "#eeee",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <ScrollView style={{ maxHeight: 200 }}>
                <Text>{announcement.description}</Text>
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("screen").width * 0.7,
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(!modalVisible)
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              {auth.uid === masjid.adminId ||
                (profile.isAdmin && (
                  <Pressable
                    disabled={loading}
                    style={[styles.button, styles.buttonClose]}
                    onPress={Delete}
                  >
                    {!loading ? (
                      <Text style={styles.textStyle1}>Delete</Text>
                    ) : (
                      <ActivityIndicator color="#ffff" size={18} />
                    )}
                  </Pressable>
                ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
    padding: 10,
    width: "40%",
  },
  buttonClose: {
    backgroundColor: "darkred",
    marginLeft: 15,
  },
  buttonOpen: {
    backgroundColor: "#5C5C5C",
    marginRight: 15,
  },
  centeredView: {
    alignItems: "center",
    backgroundColor: "#6d6d6d6b",
    flex: 1,
    justifyContent: "center",
  },
  // editTime: {
  //   backgroundColor: "#dddd",
  //   borderRadius: 8,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  // },
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
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})
export default NotificationCard
