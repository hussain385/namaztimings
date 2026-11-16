import Fuse from "fuse.js"
import React, { FC, useEffect, useState } from "react"
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Header } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome5"
import { isLoaded } from "react-redux-firebase"
import { getCurrentLocation, useGetMasjidPopulate } from "../../hooks/firebase"
import MasjidCard from "../../components/cards/MasjidCard"
import { setLocation } from "../../redux/locationSlicer"
import { ActivityIndicator } from "react-native-paper"
import Animated from "react-native-reanimated"
import Favbtn from "../../components/masjidInfo/Favbtn"
import { TabPropsType } from "../../navigation"
import { useAppDispatch } from "../../hooks/redux"
import { Masjid } from "../../types/firestore"

const Search: FC<TabPropsType<"Search">> = ({ navigation }) => {
  const { masjidData, location } = useGetMasjidPopulate({
    longitude: undefined,
    latitude: undefined,
  })
  const [result, setResult] = useState<Masjid[]>([])
  const dispatch = useAppDispatch()
  // console.log(masjidData, "the masjid from search")

  function onChangeSearch(text: string) {
    const fuse = new Fuse(masjidData, {
      keys: ["address"],
      distance: 400,
      shouldSort: true,
      findAllMatches: true,
      threshold: 1,
      minMatchCharLength: 5,
    })
    const resultf = fuse.search(text)
    console.log(resultf, "resultf")
    const data = resultf.map((e) => e.item)
    setResult(data)
  }

  useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        // setLocation(loc);
        if (loc?.coords) {
          dispatch(setLocation(loc.coords))
        }
        // console.log(loc.coords.longitude, '<========== location ');
      })
      .catch((e) => {
        console.error(e)
      })
  }, [dispatch])

  const renderItem = ({ item }: { item: Masjid }) => (
    <>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          zIndex: 1,
          top: 20,
        }}
      >
        <View style={{ flexGrow: 1 }} />
        <View style={{ right: 20 }}>
          <Favbtn favId={item.uid!} isBig={true} />
        </View>
      </View>
      <MasjidCard masjid={item} nav={navigation} />
    </>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header
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
              Search
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                width: "170%",
                marginTop: 10,
              }}
            >
              <TextInput
                onChangeText={onChangeSearch}
                // value={textSearch}
                placeholder="Enter City/Area e.g Karachi/Nazimabad..."
                style={{
                  backgroundColor: "#eeee",
                  width: "80%",
                  borderRadius: 10,
                  alignContent: "center",
                  color: "black",
                  height: 40,
                  paddingHorizontal: 20,
                }}
                placeholderTextColor="grey"
              />
            </View>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Map", {
                latitude: location.latitude || 0.0,
                longitude: location.longitude || 0.0,
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
      {masjidData.length === 0 && (
        <Animated.View
          style={{
            height: Dimensions.get("screen").height * 0.7,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <ActivityIndicator color="#1F441E" size="large" />
        </Animated.View>
      )}
      <FlatList
        data={result.length > 0 ? result : masjidData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.uid || index.toString()}
        style={{ marginBottom: 140 }}
        initialNumToRender={6}
      />
      {masjidData.length >= 1 && (
        <View
          style={{
            alignSelf: "center",
            position: "absolute",
            flex: 0.1,
            bottom: 80,
            height: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Add Masjid")}
            style={{
              alignItems: "center",
              backgroundColor: "#1F441E",
              padding: 10,
              borderRadius: 5,
              width: 300,
              marginHorizontal: 10,
            }}
          >
            <Text style={{ color: "#CEE6B4" }}>Add Masjid</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: 100,
    height: Dimensions.get("window").height + 30,
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
})

export default Search
// export default compose(
//   firestoreConnect(() => [{ collection: "Masjid", populates }]),
//   connect((state, props) => {
//     const masjid = populate(state.firestore, "Masjid", populates)
//     return {
//       ...props,
//       masjid,
//     }
//   }),
// )(Search)
