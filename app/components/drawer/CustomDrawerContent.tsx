import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"
import React, { FC } from "react"
import { Alert, Linking, Share, TouchableOpacity, View } from "react-native"
import Entypo from "react-native-vector-icons/Entypo"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useSelector } from "react-redux"
import { isEmpty, isLoaded, useFirebase } from "react-redux-firebase"
import CoText from "../Text/Text"
import { selectFirebase } from "../../hooks/firebase"

const CustomDrawerContent: FC<DrawerContentComponentProps> = ({ navigation }) => {
  const { auth } = useSelector(selectFirebase)
  const firebaseApp = useFirebase()

  async function handleSignOut() {
    console.log("logging Out...", auth)
    await firebaseApp.logout()
    navigation.navigate("Home")
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: "Namaz Timings",
        message:
          "Hey, Install this app and never worry about finding a masjid near you again.\n\nhttps://play.google.com/store/apps/details?id=com.namaztimings",
        url: "https://play.google.com/store/apps/details?id=com.namaztimings",
      })
      if (result.action === Share.sharedAction) {
        // if (result.activityType) {
        //   // shared with activity type of result.activityType
        // } else {
        //   // shared
        // }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  return (
    <DrawerContentScrollView style={{ backgroundColor: "#CEE6B4" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{
          paddingVertical: 30,
          borderBottomColor: "#1F441E",
          borderBottomWidth: 1,
          marginBottom: 30,
          flexDirection: "column",
          alignSelf: "center",
          width: "100%",
        }}
      >
        <CoText
          textStyles={[
            {
              paddingLeft: 60,
              color: "#1F441E",
              fontSize: 18,
              fontWeight: "bold",
            },
          ]}
          text="Namaz Timings"
        />
        <CoText textStyles={[{ paddingLeft: 60, color: "#1F441E" }]} text="Namaztimings.pk" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Entypo name="home" size={26} color="#1F441E" />
        <View style={{ marginLeft: 30 }}>
          <CoText textStyles={[{ color: "#1F441E" }]} text="Home" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onShare}
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          marginLeft: 2,
        }}
      >
        <MaterialCommunityIcons name="share" size={26} color="#1F441E" />
        <View style={{ marginLeft: 30 }}>
          <CoText textStyles={[{ color: "#1F441E" }]} text="Invite Your Friends" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Contact Us")}
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          marginLeft: 4,
        }}
      >
        <MaterialCommunityIcons name="phone" size={26} color="#1F441E" />
        <View style={{ marginLeft: 30 }}>
          <CoText textStyles={[{ color: "#1F441E" }]} text="Contact Us" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://namaz-timings.surge.sh/")}
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          marginLeft: 4,
        }}
      >
        <MaterialCommunityIcons name="newspaper" size={26} color="#1F441E" />
        <View style={{ marginLeft: 30 }}>
          <CoText textStyles={[{ color: "#1F441E" }]} text="Terms & Conditions" />
        </View>
      </TouchableOpacity>

      {isLoaded(auth) && !isEmpty(auth) ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate("Admin view")}
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 25,
              marginLeft: 4,
            }}
          >
            <MaterialCommunityIcons name="account-circle" size={26} color="#1F441E" />
            <View style={{ marginLeft: 30 }}>
              <CoText textStyles={[{ color: "#1F441E" }]} text="Admin view" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 25,
              marginLeft: 4,
            }}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons name="logout" size={26} color="#1F441E" />
            <View style={{ marginLeft: 30 }}>
              <CoText textStyles={[{ color: "#1F441E" }]} text="Sign Out" />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 25,
            marginLeft: 4,
          }}
        >
          <MaterialCommunityIcons name="logout" size={26} color="#1F441E" />
          <View style={{ marginLeft: 30 }}>
            <CoText textStyles={[{ color: "#1F441E" }]} text="Login" />
          </View>
        </TouchableOpacity>
      )}
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent
