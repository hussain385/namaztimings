import React, { useState } from "react"
import { Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"
import Favbtn from "../masjidInfo/Favbtn"
import AdminRequest from "../admin/AdminRequest"
import { isEmpty } from "lodash"
import { Masjid } from "../../types/firestore"

const TopPart = ({ masjidData }: { masjidData: Masjid }) => {
  const [more, setMore] = useState(false)
  return (
    <View style={styles.mainView1}>
      <View style={styles.mainView2}>
        <View style={[styles.elementStyle, { paddingTop: 0 }]}>
          <Icon style={styles.iconStyle} name="mosque" color="#5C5C5C" size={20} />
          <Text>{masjidData.name}</Text>
        </View>
        <View style={styles.elementStyle}>
          <Icon style={styles.iconStyle} name="map-marker-alt" color="#5C5C5C" size={20} />
          <View>
            <Text
              style={{ width: Dimensions.get("screen").width * 0.45 }}
              numberOfLines={more ? undefined : 1}
            >
              {masjidData.address}
            </Text>
            <Text
              onPress={() => {
                setMore(!more)
              }}
              style={{ color: "#1F441E" }}
            >
              View {!more ? "more" : "less"}
            </Text>
          </View>
        </View>
        {masjidData.user?.name !== "No Admin" ? (
          <>
            <View style={styles.elementStyle}>
              <Icon style={styles.iconStyle} name="user-alt" color="#5C5C5C" size={20} />
              <Text>{masjidData.user?.name || "hussain"}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${masjidData.user?.phone || "+920000000000"}`)}
              style={styles.elementStyle}
            >
              <Icon style={styles.iconStyle} name="phone-alt" color="#5C5C5C" size={20} />
              <Text
                style={{
                  color: "rgba(13,104,161,0.83)",
                  textDecorationLine: "underline",
                }}
              >
                {masjidData.user?.phone || "+920000000000"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.elementStyle}>
            <Icon style={styles.iconStyle} name="user-alt" color="#1F441E" size={20} />
            <AdminRequest id={masjidData.uid} masjidName={masjidData.name} />
          </View>
        )}
      </View>
      <View style={styles.mainView4}>
        <View style={{ alignItems: "flex-end" }}>
          <Favbtn favId={masjidData.uid} isBig={false} />
        </View>
        <View style={styles.direction}>
          <Icon name="directions" color="#900000" size={24} style={{ marginRight: 5 }} />
          <Text
            style={{ textDecorationLine: "underline", color: "darkred" }}
            onPress={async () => {
              await Linking.openURL(
                `${
                  masjidData.gLink
                    ? masjidData.gLink
                    : `https://maps.google.com/?q=${masjidData.g.geopoint.latitude},${masjidData.g.geopoint.longitude}`
                }`,
              )
            }}
          >
            {masjidData.distance} Km Away
          </Text>
        </View>
        <View style={styles.imageView}>
          <Image
            source={{
              uri: `${
                isEmpty(masjidData.pictureURL)
                  ? "https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png"
                  : masjidData.pictureURL
              }`,
            }}
            style={{
              width: Dimensions.get("screen").width * 0.3,
              height: Dimensions.get("screen").height * 0.12,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default TopPart

const styles = StyleSheet.create({
  direction: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  elementStyle: {
    flexDirection: "row",
    paddingTop: 17,
    width: Dimensions.get("screen").width * 0.6,
  },
  iconStyle: {
    alignSelf: "center",
    textAlign: "center",
    width: 50,
  },
  imageView: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  mainView1: {
    flexDirection: "row",
  },
  mainView2: {
    flexDirection: "column",
  },
  // mainView3: {
  //   flexDirection: "row",
  // },
  mainView4: {
    width: Dimensions.get("screen").width * 0.35,
  },
  // subView1: {
  //   alignContent: "center",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: Dimensions.get("screen").width * 0.1,
  // },
  // subView2: {
  //   alignContent: "center",
  //   alignItems: "flex-start",
  //   justifyContent: "center",
  //   width: Dimensions.get("screen").width * 0.5,
  // },
})
