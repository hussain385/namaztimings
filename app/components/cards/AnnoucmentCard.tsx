import React, { memo, useEffect, useState } from "react"
import { Card } from "react-native-paper"
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import moment from "moment"
import { Announcement } from "../../types/firestore"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { addOrModifyAnnouncement, AnnouncementStatus } from "../../redux/announcementSlicer"

const AnnoucmentCard = ({ item }: { item: Announcement & { name: string; masjidId: string } }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const localAnnouncement = useAppSelector((state) => state.announcement)
  const dispatch = useAppDispatch()
  const announcementStatus = localAnnouncement.find((e) => e.id === item.id)?.status

  useEffect(() => {
    return () => {
      dispatch(
        addOrModifyAnnouncement({
          status: AnnouncementStatus.Read,
          id: item.id,
          masjidId: item.masjidId,
        }),
      )
    }
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
          borderBottomColor: announcementStatus === AnnouncementStatus.UnRead ? "#229704" : "grey",
          borderBottomWidth: 10,
        }}
      >
        <Card.Actions>
          <View style={{ width: "100%", padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    width: Dimensions.get("screen").width * 0.45,
                  }}
                >
                  {item.name}
                </Text>
              </View>
              <View>
                <Text style={{ marginTop: -6 }}>
                  Dated: {moment(item.createdAt?.seconds * 1000).format("DD/MM/YYYY")}
                </Text>
                <Text>
                  Time:{"  "}
                  {moment(item.createdAt?.seconds * 1000).format("hh:mm a")}
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
                  {item.description}
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
                <Text>{item.description}</Text>
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
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default memo(AnnoucmentCard)

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
    padding: 10,
    width: "40%",
  },
  // buttonClose: {
  //   backgroundColor: "darkred",
  //   marginLeft: 15,
  // },
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
