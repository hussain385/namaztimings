import React, { useState } from "react"
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { ActivityIndicator } from "react-native-paper"
import firestore from "@react-native-firebase/firestore"
import { Masjid } from "../../types/firestore"

const windowHeight = Dimensions.get("screen").height
const windowWidth = Dimensions.get("screen").width

interface DonationModalProps {
  masjid: Masjid
  setModalVisible: any
  editable: boolean
  adminView: boolean
}

const DonationModal = ({ masjid, setModalVisible, adminView, editable }: DonationModalProps) => {
  const [isSubmiting, setIsSubmitting] = useState(false)
  const [donationInfo, setDonationInfo] = useState(
    masjid.donationInfo || "No information set by admin",
  )
  const onSubmit = async () => {
    setIsSubmitting(true)
    await firestore()
      .collection("Masjid")
      .doc(masjid.uid)
      .update({
        donationInfo,
      })
      .then(() => {
        Alert.alert("Info Save", "Your information has been saved.", [
          {
            text: "Ok",
            onPress: () => {
              setIsSubmitting(false)
              setModalVisible(false)
            },
          },
        ])
      })
  }
  console.log(donationInfo)
  return (
    // <Modal
    //   animationType="slide"
    //   transparent={true}
    //   visible={props.modalVisible}>
    //   <View style={styles.centeredView}>
    //     <ScrollView>
    <View style={styles.modalView}>
      {(donationInfo !== "No information set by admin" || adminView) && (
        <>
          <TextInput
            value={donationInfo}
            // name="info"
            placeholder="Your donation information"
            multiline={true}
            editable={editable}
            onChangeText={(event) => {
              setDonationInfo(event)
            }}
            style={{
              padding: 10,
              fontSize: 17,
              color: "black",
              borderColor: "#bbbbbb",
              borderWidth: 1,
              textAlign: "center",
              width: "100%",
              borderRadius: 5,
              height: Dimensions.get("screen").height * 0.5,
              textAlignVertical: "top",
            }}
          />
          {editable && (
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onSubmit}>
              {isSubmiting ? (
                <ActivityIndicator size={18} color="white" />
              ) : (
                <Text style={styles.textStyle}>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
    //     </ScrollView>
    //   </View>
    // </Modal>
  )
}

export default DonationModal

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 10,
    elevation: 2,
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
    width: "30%",
  },
  buttonClose: {
    backgroundColor: "#1F441E",
    marginLeft: 15,
  },
  // buttonOpen: {
  //   backgroundColor: "#5C5C5C",
  // },
  // centeredView: {
  //   alignItems: "center",
  //   backgroundColor: "#00000071",
  //   flex: 1,
  //   justifyContent: "center",
  // },
  // information: {
  //   alignItems: "center",
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   marginTop: 10,
  //   width: "100%",
  // },
  // inputStyle: {
  //   marginTop: 0,
  //   textAlign: "center",
  // },
  // modalText: {
  //   fontSize: 20,
  //   marginBottom: 15,
  //   textAlign: "center",
  // },
  modalView: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 35,
    width: windowWidth,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})
