import React, { FC, useEffect, useState } from "react"
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Header } from "react-native-elements"
import AntDesign from "react-native-vector-icons/AntDesign"
import Icon from "react-native-vector-icons/FontAwesome5"
import { selectCords } from "../../redux/locationSlicer"
import { useGetRadMasjidData1 } from "../../hooks/firebase"
import LastUpdated from "../../components/masjidInfo/LastUpdated"
import TopPart from "../../components/masjidInfo/TopPart"
import { ActivityIndicator } from "react-native-paper"
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { TabPropsType } from "../../navigation"
import { headerStyles, textStyles } from "../../theme/styles/Base"
import CoText from "../../components/Text/Text"
import { useAppSelector } from "../../hooks/redux"
import { AnnouncementStatus } from "../../redux/announcementSlicer"

const HomeScreen: FC<TabPropsType<"Home">> = ({ navigation }) => {
  const {
    masjid: masjidData,
    loading,
    error,
    getLocation,
    GetDataRadMasjid: GetData,
  } = useGetRadMasjidData1()
  const [refreshing, setRefreshing] = useState(false)
  const location = useAppSelector(selectCords)
  const localAnnouncement = useAppSelector((state) => state.announcement)

  async function onRefresh() {
    setRefreshing(true)
    await getLocation()
    await GetData()
    setRefreshing(false)
  }

  useEffect(() => {
    onRefresh().then(() => {
      console.log("refreshed")
    })
  }, [location.latitude, location.longitude])

  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="bars" color="#ffff" size={26} style={{ paddingLeft: 10 }} />
          </TouchableOpacity>
        }
        centerComponent={
          <View>
            <Text
              style={{
                color: "#ffff",
                fontSize: 22,
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              Namaz Timings
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Root", {
                screen: "Announcement",
              })
            }}
            style={{
              paddingRight: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={headerStyles.cartTxt}>
                <CoText
                  textStyles={[textStyles.simple, { fontSize: 10, color: "#1F441E" }]}
                  text={
                    localAnnouncement.filter((e) => e.status === AnnouncementStatus.UnRead).length
                  }
                />
              </View>
              <MaterialIcons name="bell" size={28} color="white" />
            </View>
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <>
        {/* {error.message.trim() && ( */}
        {/*  <View> */}
        {/*    <Text>Error: {JSON.stringify(error)}</Text> */}
        {/*  </View> */}
        {/* )} */}
        {loading && (
          <View
            style={{
              height: Dimensions.get("screen").height * 0.8,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <ActivityIndicator color="#1F441E" size="large" />
          </View>
        )}
        {masjidData.length !== 0 && !loading && (
          <SafeAreaView style={styles.container}>
            <ScrollView
              // style={styles.scrollView}
              refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
            >
              <View>
                <View>
                  <Text style={{ textAlign: "center", fontSize: 17, padding: 15 }}>
                    MASJID NEAR YOUR LOCATION
                  </Text>
                </View>
                <TopPart masjidData={masjidData[0]} />
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <LastUpdated timeStamp={masjidData[0].timeStamp} />
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
                </View>
                {masjidData[0].timing.fajar !== "12:00 AM" && (
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
                      <Text style={{ fontSize: 17 }}>{masjidData[0].timing.fajar}</Text>
                    </View>
                  </View>
                )}
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
                    <Text style={{ fontSize: 17 }}>{masjidData[0].timing.zohar}</Text>
                  </View>
                </View>
                {masjidData[0].timing.asar !== "12:00 AM" && (
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
                      <Text style={{ fontSize: 17 }}>{masjidData[0].timing.asar}</Text>
                    </View>
                  </View>
                )}
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
                    <Text style={{ fontSize: 17 }}>{masjidData[0].timing.magrib}</Text>
                  </View>
                </View>
                {masjidData[0].timing.isha !== "12:00 AM" && (
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
                      <Text style={{ fontSize: 17 }}>{masjidData[0].timing.isha}</Text>
                    </View>
                  </View>
                )}
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
                    justifyContent: "center",
                    paddingHorizontal: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("More Info", {
                        masjid: masjidData[0],
                      })
                    }
                    style={{
                      alignItems: "center",
                      backgroundColor: "#CEE6B4",
                      padding: 10,
                      borderRadius: 5,
                      width: "70%",
                      marginHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#1F441E",
                      }}
                    >
                      More Info
                    </Text>
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
                    onPress={() => navigation.navigate("Show More")}
                  >
                    <Text style={{ color: "#CEE6B4" }}>Show More Masjid</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
        {masjidData.length === 0 && (
          <SafeAreaView>
            <ScrollView
              refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
            >
              <View
                style={{
                  alignItems: "center",
                  marginVertical: "50%",
                }}
              >
                <AntDesign name="folder1" size={50} />
                <Text>Not Available</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 40,
  },
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
  statusIndicator: {
    backgroundColor: "#74ff1c",
    borderColor: "#1F441E",
    borderRadius: 1000,
    borderWidth: 3,
    height: 15,
    marginLeft: -10,
    width: 15,
  },
})

export default HomeScreen
