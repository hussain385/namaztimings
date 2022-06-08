import moment from "moment"
import React, { useEffect, useState } from "react"
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Header } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { headerStyles, textStyles } from "../../theme/styles/Base"
import Edit from "../modal/Edit"
import CoText from "../Text/Text"
import { isNil } from "lodash"
import ChangeImageModal from "../modal/ChangeImageModal"
import { HomePropsType } from "../../navigation"
import firestore from "@react-native-firebase/firestore"
import { Masjid, MasjidRequest } from "../../types/firestore"

const AdminView: React.FC<HomePropsType<"Admin">> = ({ navigation, route }) => {
  const [imageChangeModal, setImageChangeModal] = useState(false)
  const { Masjid: masjidParam } = route.params
  const [Masjid, setMasjidSnapshot] = useState(masjidParam)
  const pastTime = moment(Masjid.timeStamp?.seconds * 1000)
  const now = moment()
  const [count, setCount] = useState(0)
  // const { requests } = useAppSelector((state) => state.firestore.ordered)

  useEffect(() => {
    const subscriber = firestore()
      .collection("Masjid")
      .doc(masjidParam.uid)
      .onSnapshot((documentSnapshot) => {
        setMasjidSnapshot({
          ...(documentSnapshot.data() as Masjid),
          uid: documentSnapshot.id,
          user: masjidParam.user,
        })
      })

    return () => subscriber()
  }, [])

  useEffect(() => {
    if (!isNil(Masjid.requestList)) {
      setCount(0)
      Masjid.requestList.forEach((value) => {
        firestore()
          .collection("requests")
          .doc(value)
          .get()
          .then((value1) => {
            const data = value1.data() as MasjidRequest
            Masjid.requests
              ? Masjid.requests.push({ ...data, uid: value1.id })
              : (Masjid.requests = [{ ...data, uid: value1.id }])
            if (!data.isRead) {
              setCount((prevState) => prevState + 1)
            }
          })
      })
    }
  }, [Masjid.requestList])

  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={"arrow-left"} color="#ffff" size={26} style={{ paddingLeft: 10 }} />
          </TouchableOpacity>
        }
        centerComponent={
          <View>
            <Text
              style={{
                color: "#ffff",
                fontSize: 22,
                marginBottom: 5,
                marginTop: 5,
                textAlign: "center",
              }}
            >
              Admin
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Admin Notification", {
                masjid: Masjid,
              })
            }}
            style={{
              paddingRight: 10,
            }}
          >
            <View>
              <View style={headerStyles.cartTxt}>
                <CoText
                  textStyles={[textStyles.simple, { fontSize: 10, color: "#1F441E" }]}
                  text={count}
                />
              </View>
              <MaterialIcons name="bell" size={28} color="white" />
            </View>
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <ScrollView style={styles.scrollView}>
        <View>
          <View>
            <Text
              style={{
                justifyContent: "flex-start",
                fontSize: 17,
                padding: 15,
              }}
            >
              BASIC INFO
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexGrow: 1, flexDirection: "row" }}>
              <Icon
                name="mosque"
                color="#5C5C5C"
                size={20}
                style={{ paddingRight: 10, paddingLeft: 10 }}
              />
              <Text
                style={{
                  fontSize: 17,
                  color: "#5C5C5C",
                  fontWeight: "bold",
                }}
              >
                {Masjid.name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexGrow: 1, flexDirection: "row" }}>
              <Icon
                name="map-marker-alt"
                color="#5C5C5C"
                size={20}
                style={{
                  paddingRight: 18,
                  paddingLeft: 15,
                  marginTop: 10,
                }}
              />
              <Text style={{ maxWidth: 170, marginTop: 5 }}>{Masjid.address}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={{ flexGrow: 1, flexDirection: "row" }}>
              <Icon
                name="user-alt"
                color="#5C5C5C"
                size={20}
                style={{ paddingRight: 18, paddingLeft: 13 }}
              />
              <Text style={{ maxWidth: 280, marginTop: 2 }}>{Masjid.user && Masjid.user.name}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flexGrow: 1, flexDirection: "row" }}>
              <Icon
                name="phone-alt"
                color="#5C5C5C"
                size={20}
                style={{
                  paddingRight: 18,
                  paddingLeft: 13,
                  marginTop: 5,
                }}
              />
              <Text style={{ maxWidth: 280, marginTop: 0 }}>
                {Masjid.user && Masjid.user.phone}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setImageChangeModal(true)}>
              <Image
                source={{
                  uri: `${
                    Masjid.pictureURL ||
                    "https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png"
                  }`,
                }}
                style={{
                  width: 160,
                  height: 100,
                  marginTop: -50,
                  marginRight: 10,
                  borderRadius: 8,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                flexDirection: "row",
                backgroundColor: "#E1E1E1",
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>
                Last Updated:
                <Text
                  style={{
                    color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                  }}
                >
                  {" "}
                  {moment(Masjid.timeStamp?.seconds * 1000).format("MMMM Do YYYY") ===
                  "Invalid date"
                    ? "Not Available"
                    : moment(Masjid.timeStamp?.seconds * 1000).format("MMMM, Do YYYY")}
                </Text>
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                flexDirection: "row",
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Namaz Timings</Text>
            </View>
            <Edit masjid={Masjid} isRequest={false} userInfo={false} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Fajr</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>
                {Masjid.timing.fajar === "00:00 AM" ? "--" : Masjid.timing.fajar}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Zohr</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>{Masjid.timing.zohar}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Asr</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>
                {Masjid.timing.asar === "00:00 AM" ? "--" : Masjid.timing.asar}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Magrib</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>{Masjid.timing.magrib}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexGrow: 1,
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Isha</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>
                {Masjid.timing.isha === "00:00 AM" ? "--" : Masjid.timing.isha}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <View
              style={{
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Jumu&apos;ah</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>{Masjid.timing.jummah || "--"}</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <View
              style={{
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Eid Ul Fitr</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>{Masjid.timing.eidUlFitr || "--"}</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <View
              style={{
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>Eid Ul Adha</Text>
            </View>
            <View
              style={{
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 17 }}>{Masjid.timing.eidUlAddah || "--"}</Text>
            </View>
          </View>
          <View
            style={{
              margin: 15,
              borderBottomColor: "#C4C4C4",
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                backgroundColor: "#CEE6B4",
                padding: 10,
                borderRadius: 5,
                width: "70%",
                marginHorizontal: 10,
              }}
              onPress={() =>
                navigation.navigate("Notifications", {
                  masjid: Masjid,
                })
              }
            >
              <Text style={{ color: "#1F441E" }}>NEWS & ANNOUNCMENTS</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                backgroundColor: "#1F441E",
                padding: 10,
                borderRadius: 5,
                width: "70%",
                marginHorizontal: 10,
              }}
              onPress={() =>
                navigation.navigate("Donation", {
                  masjid: Masjid,
                  adminView: true,
                  edit: true,
                })
              }
            >
              <Text style={{ color: "#CEE6B4" }}>Donation</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ChangeImageModal
          masjid={Masjid}
          imageChangeModal={imageChangeModal}
          setImageChangeModal={setImageChangeModal}
        />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   marginBottom: 60,
  // },
  // mncontainer: {
  //   flex: 1,
  //   marginTop: 30,
  // },
  // navigationContainer: {
  //   backgroundColor: "#1F441E",
  // },
  // paragraph: {
  //   fontSize: 15,
  //   padding: 16,
  //   textAlign: "center",
  // },
  scrollView: {
    height: Dimensions.get("screen").height * 0.77,
    marginBottom: 10,
  },
})

export default AdminView
