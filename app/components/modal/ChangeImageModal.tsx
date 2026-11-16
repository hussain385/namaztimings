import React, { useState } from "react"
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { isEmpty, isNil } from "lodash"
import storage from "@react-native-firebase/storage"
import firestore from "@react-native-firebase/firestore"
import { Masjid } from "../../types/firestore"
import { uploadImageAsync } from "../../hooks/firebase"

const ChangeImageModal = ({
  imageChangeModal,
  masjid,
  setImageChangeModal,
}: {
  imageChangeModal: boolean
  masjid: Masjid
  setImageChangeModal: any
}) => {
  const [image, setImage] = useState("")

  const chooseImage = () => {
    const oldImage = masjid.pictureURL
    // let options = {
    //   title: "Select Image",
    //   customButtons: [
    //     { name: "customOptionKey", title: "Choose Photo from Custom Option" },
    //   ],
    //   storageOptions: {
    //     skipBackup: true,
    //     path: "images",
    //   },
    // };
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
    })
      .then(async (response) => {
        if (response.cancelled) {
          return
        }
        if (response?.uri) {
          const { uri } = response
          // setImage(response.assets[0]);
          if (!isEmpty(uri)) {
            console.log(uri, "inside")
            setImage(uri)
            return await uploadImageAsync(uri)
            // const filename = uri.substring(uri.lastIndexOf("/") + 1)
            // const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri
            // const ref = storage().ref("/masjid/" + filename)
            // await ref.putFile(uri)
            // return await ref.getDownloadURL()
            // console.log(url)
            // setImage(url)
            // return url
          }
        }
      })
      .then((r) => {
        console.log(image, r, "sasc")
        firestore()
          .collection("Masjid")
          .doc(masjid.uid)
          .update({
            pictureURL: r,
          })
          .then(async () => {
            console.log(oldImage, "the old image")
            if (!isNil(oldImage)) {
              const ref = storage().refFromURL(oldImage)
              await ref.delete()
            }
            setImageChangeModal(false)
          })
          .catch((e) => console.log(e, "sas"))
      })
  }

  return (
    <Modal animationType="slide" transparent={true} visible={imageChangeModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Namaz Timings</Text>
          <Image
            source={{
              uri: `${
                masjid.pictureURL ||
                "https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png"
              }`,
            }}
            style={{
              width: 160,
              height: 100,
              marginRight: 10,
              borderRadius: 8,
            }}
          />
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={chooseImage}
              style={{
                alignItems: "center",
                backgroundColor: "#CEE6B4",
                padding: 10,
                borderRadius: 5,
                width: "40%",
                marginTop: 10,
                marginHorizontal: 5,
                // alignContent: "center",
              }}
            >
              <Text style={{ color: "#1F441E" }}>Change Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setImageChangeModal(false)}
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                paddingVertical: 15,
                borderRadius: 5,
                borderColor: "darkred",
                borderWidth: 1,
                width: "30%",
                marginTop: 10,
                marginHorizontal: 5,
              }}
            >
              <Text
                style={{
                  color: "darkred",
                  fontSize: 14,
                  alignSelf: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () =>
                Alert.alert("Delete", "Are you sure?", [
                  {
                    text: "ok",
                    onPress: () => {
                      console.log(masjid.pictureURL)
                      if (masjid.pictureURL != null) {
                        const ref = storage().refFromURL(masjid.pictureURL)
                        ref.delete().finally(() => {
                          console.log("in Finally")
                          firestore()
                            .collection("Masjid")
                            .doc(masjid.uid)
                            .update({
                              pictureURL: null,
                            })
                            .then(() => setImageChangeModal(false))
                        })
                      }
                    },
                  },
                  {
                    text: "Cancel",
                  },
                ])
              }
              style={{
                alignItems: "center",
                backgroundColor: "darkred",
                paddingVertical: 15,
                borderRadius: 5,
                width: "30%",
                marginTop: 10,
                marginHorizontal: 5,
              }}
            >
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ChangeImageModal
const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
    backgroundColor: "#00000071",
    flex: 1,
    justifyContent: "center",
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
    padding: 35,
    width: Dimensions.get("screen").width * 0.8,
  },
})
