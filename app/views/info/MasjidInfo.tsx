import * as React from "react"
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Header } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome5"
import Edit from "../../components/modal/Edit"
import LastUpdated from "../../components/masjidInfo/LastUpdated"
import TopPart from "../../components/masjidInfo/TopPart"
import { isEmpty } from "lodash"
import { HomePropsType } from "../../navigation"

const MasjidInfo: React.FC<HomePropsType<"More Info">> = ({ route, navigation }) => {
  const { masjid } = route.params
  console.log(masjid, "===>info")
  return (
    <>
      <Header
        containerStyle={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 5,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" color="#ffff" size={26} style={{ paddingLeft: 10 }} />
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
              Masjid Info
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Root", {
                screen: "Map1",
                params: {
                  masjid,
                },
              })
            }}
          >
            <Icon
              name="map-marker-alt"
              color="#ffff"
              size={26}
              style={{ paddingRight: 10, marginTop: 3 }}
            />
          </TouchableOpacity>
        }
        backgroundColor="#1F441E"
      />
      <SafeAreaView style={{ height: Dimensions.get("window").height - 85 }}>
        <ScrollView>
          <View>
            <View>
              <Text />
            </View>
            <TopPart masjidData={masjid} />
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <LastUpdated timeStamp={masjid.timeStamp} />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 10,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Namaz Timings</Text>
              </View>
              <Edit masjid={masjid} />
            </View>
            {masjid.timing.fajar !== "12:00 AM" && (
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
                  <Text style={{ fontSize: 17 }}>Fajr</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 17 }}>{masjid.timing.fajar}</Text>
                </View>
              </View>
            )}
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
                <Text style={{ fontSize: 17 }}>Zohr</Text>
              </View>
              <View
                style={{
                  paddingRight: 10,
                }}
              >
                <Text style={{ fontSize: 17 }}>{masjid.timing.zohar}</Text>
              </View>
            </View>
            {masjid.timing.asar !== "12:00 AM" && (
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
                  <Text style={{ fontSize: 17 }}>Asr</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 17 }}>{masjid.timing.asar}</Text>
                </View>
              </View>
            )}
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
                <Text style={{ fontSize: 17 }}>Magrib</Text>
              </View>
              <View
                style={{
                  paddingRight: 10,
                }}
              >
                <Text style={{ fontSize: 17 }}>{masjid.timing.magrib}</Text>
              </View>
            </View>
            {masjid.timing.isha !== "12:00 AM" && (
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
                  <Text style={{ fontSize: 17 }}>Isha</Text>
                </View>
                <View
                  style={{
                    paddingRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 17 }}>{masjid.timing.isha}</Text>
                </View>
              </View>
            )}
            {!isEmpty(masjid.timing.jummah) && masjid.timing.jummah !== "12:00 AM" && (
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
                  <Text style={{ fontSize: 17 }}>{masjid.timing.jummah || "--"}</Text>
                </View>
              </View>
            )}
            {!isEmpty(masjid.timing.eidUlFitr) && masjid.timing.eidUlFitr !== "12:00 AM" && (
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
                  <Text style={{ fontSize: 17 }}>{masjid.timing.eidUlFitr || "--"}</Text>
                </View>
              </View>
            )}
            {masjid.timing.eidUlAddah !== "12:00 AM" && !isEmpty(masjid.timing.eidUlAddah) && (
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
                  <Text style={{ fontSize: 17 }}>
                    {isEmpty(masjid.timing.eidUlAddah) ? "--" : masjid.timing.eidUlAddah}
                  </Text>
                </View>
              </View>
            )}
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
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Notifications", {
                  masjid,
                })
              }}
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
                News & Announcement
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
              onPress={() =>
                navigation.navigate("Donation", {
                  masjid,
                  edit: false,
                })
              }
            >
              <Text style={{ color: "#CEE6B4" }}>Donation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default MasjidInfo