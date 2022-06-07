import * as React from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Header } from "react-native-elements"
import { Card } from "react-native-paper"
import Icon from "react-native-vector-icons/FontAwesome5"
import { setLocation } from "../../redux/locationSlicer"
import { getCurrentLocation, useGetMasjidPopulate } from "../../hooks/firebase"
import moment from "moment"
import { useAppDispatch } from "../../hooks/redux"
import { Masjid } from "../../types/firestore"
import { HomePropsNavigation, HomePropsType } from "../../navigation"

const Item = ({ masjid, nav }: { masjid: Masjid; nav: HomePropsNavigation<"Show More"> }) => {
  const pastTime = moment(masjid.timeStamp?.seconds * 1000)
  const now = moment()
  return (
    <Card
      style={{
        borderRadius: 5,
        margin: 10,
        shadowOpacity: 10,
        elevation: 20,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          nav.navigate("More Info", {
            masjid,
          })
        }
      >
        <Card.Cover
          source={{
            uri: `${
              masjid.pictureURL ||
              "https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png"
            }`,
          }}
        />
      </TouchableOpacity>

      <Card.Actions>
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              margin: 5,
              justifyContent: "space-between",
            }}
          >
            <View style={{ maxWidth: Dimensions.get("screen").width * 0.65 }}>
              <Text style={{ fontSize: 17 }}>{masjid.name}</Text>
            </View>
            <TouchableOpacity>
              <Text
                onPress={async () => {
                  await Linking.openURL(
                    `${
                      masjid.gLink
                        ? masjid.gLink
                        : `https://maps.google.com/?q=${masjid.g.geopoint.latitude},${masjid.g.geopoint.longitude}`
                    }`,
                  )
                }}
                style={{ color: "#900000", textDecorationLine: "underline" }}
              >
                {masjid.distance}KM AWAY
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#EDEDED",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View style={{ flexGrow: 5 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                Fajar
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                {masjid.timing.fajar.substring(0, 5) || "--"}
              </Text>
            </View>
            <View style={{ flexGrow: 5 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                Zohar
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                {masjid.timing.zohar.substring(0, 5) || "--"}
              </Text>
            </View>
            <View style={{ flexGrow: 5 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                Asar
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                {masjid.timing.asar.substring(0, 5) || "--"}
              </Text>
            </View>
            <View style={{ flexGrow: 5 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                Magrib
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                {masjid.timing.magrib.substring(0, 5) || "--"}
              </Text>
            </View>
            <View style={{ flexGrow: 5 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                Isha
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
                }}
              >
                {masjid.timing.isha.substring(0, 5) || "--"}
              </Text>
            </View>
          </View>
        </View>
      </Card.Actions>
    </Card>
  )
}

const ShowMore: React.FC<HomePropsType<"Show More">> = ({ navigation }) => {
  const { masjidData, location } = useGetMasjidPopulate({
    longitude: undefined,
    latitude: undefined,
  })
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        // setLocation(loc);
        if (loc?.coords) {
          dispatch(setLocation(loc.coords))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  // @ts-ignore
  const renderItem = ({ item }: { item: Masjid }) => <Item nav={navigation} masjid={item} />
  return (
    <View>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
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
                marginTop: 5,
                textAlign: "center",
              }}
            >
              More Masjid
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Map", {
                latitude: location.latitude || 0.0,
                longitude: location.longitude || 0.0,
              })
            }
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
      {masjidData.length === 0 && <ActivityIndicator color="#1F441E" size="large" />}
      <FlatList
        data={masjidData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.uid ?? index.toString()}
        initialNumToRender={20}
        style={{ marginBottom: 85 }}
      />
    </View>
  )
}

export default ShowMore
