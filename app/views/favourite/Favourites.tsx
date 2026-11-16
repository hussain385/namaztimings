import _ from "lodash"
import React, { FC, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useSelector } from "react-redux"
import { useGetFavMasjidData } from "../../hooks/firebase"
import Favbtn from "../../components/masjidInfo/Favbtn"
import HeaderComp from "../../components/header/HeaderComp"
import { useFavorites } from "../../redux/favSlicer"
import { TouchableOpacity } from "react-native-gesture-handler"
import { TabPropsType } from "../../navigation"
import { Masjid } from "../../types/firestore"
import { Header } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome5"

const Favourites: FC<TabPropsType<"Favourite">> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false)
  //   const [masjidData, loading, error] = GetRadMasjidData();

  const { masjid: masjidData, loading, error, GetDataFavMasjid: GetData } = useGetFavMasjidData()
  const favoriteId = useSelector(useFavorites)

  async function onRefresh() {
    setRefreshing(true)
    await GetData()
    setRefreshing(false)
  }

  useEffect(() => {
    async function fetchData() {
      await GetData()
      // await onRefresh();
    }

    fetchData().then((r) => {
      console.log(r)
    })
  }, [favoriteId])

  const Item = ({ item }: { item: Masjid }) => (
    <View
      style={{
        margin: 10,
        backgroundColor: "#ffff",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Root", {
            screen: "More Info",
            params: {
              masjid: item,
            },
          })
        }
      >
        <ImageBackground
          source={{
            uri: `${
              item.pictureURL ||
              "https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png"
            }`,
          }}
          style={{
            flex: 1,
            // resizeMode: "cover",
            justifyContent: "center",
            width: "100%",
            height: 200,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexGrow: 1 }} />
            <View style={{ top: -60, right: 10 }}>
              <Favbtn favId={item.uid!} isBig={true} />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <View style={{ padding: 5 }}>
        <View
          style={{
            flexDirection: "row",
            margin: 5,
            justifyContent: "space-between",
          }}
        >
          <View style={{ maxWidth: 250 }}>
            <Text style={{ fontSize: 17 }}>{item.name}</Text>
          </View>
          <View>
            <Text
              onPress={async () => {
                await Linking.openURL(
                  `${
                    item.gLink ||
                    `https://maps.google.com/?q=${item.g.geopoint.latitude},${item.g.geopoint.longitude}`
                  }`,
                )
              }}
              style={{ color: "#900000", textDecorationLine: "underline" }}
            >
              {item.distance}KM AWAY
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 5,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Root", {
                screen: "More Info",
                params: {
                  masjid: item,
                },
              })
            }
            style={[styles.btnStyles, { backgroundColor: "#1F441E" }]}
          >
            <Text style={{ color: "#CEE6B4" }}>More Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await Linking.openURL(
                `${
                  item.gLink ||
                  `https://maps.google.com/?q=${item.g.geopoint.latitude},${item.g.geopoint.longitude}`
                }`,
              )
            }}
            style={styles.btnStyles}
          >
            <Text
              style={{
                color: "#1F441E",
              }}
            >
              Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <>
      <Header
        containerStyle={{
          shadowOpacity: 30,
          elevation: 10,
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
              Favourites
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
      <>
        {(() => {
          if (error) {
            return (
              <View
                style={{
                  alignItems: "center",
                  marginVertical: "50%",
                }}
              >
                <AntDesign name="folder1" size={70} />
                <Text>404 Error</Text>
              </View>
            )
          }
          if (!loading) {
            if (!_.isNull(masjidData) && !_.isEmpty(masjidData)) {
              console.log(masjidData, "<==== from fav page")
              return (
                <FlatList
                  data={masjidData}
                  renderItem={Item}
                  keyExtractor={(x, index) => x.uid || index.toString()}
                  style={{ flex: 1 }}
                  onRefresh={onRefresh}
                  initialNumToRender={20}
                  refreshing={refreshing}
                />
              )
            } else {
              return (
                <View
                  style={{
                    alignItems: "center",
                    marginVertical: "50%",
                  }}
                >
                  <AntDesign name="folder1" size={50} />
                  <Text>No Favourites</Text>
                </View>
              )
            }
          } else {
            return <ActivityIndicator color="#1F441E" size="large" />
          }
        })()}
      </>
    </>
  )
}

const styles = StyleSheet.create({
  btnStyles: {
    alignItems: "center",
    backgroundColor: "#CEE6B4",
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    width: Dimensions.get("screen").width * 0.43,
  },
})

export default Favourites
