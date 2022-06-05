import _, { isEmpty } from "lodash"
import React, { useEffect, useState } from "react"
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useGetFavMasjidData } from "../../hooks/firebase"
import AnnoucmentCard from "../../components/cards/AnnoucmentCard"
import HeaderComp from "../../components/header/HeaderComp"
import { HomePropsType } from "../../navigation"
import { Announcement } from "../../types/firestore"

const AnnouncementView: React.FC<HomePropsType<"Announcement">> = ({ navigation }) => {
  const [announcements, setAnnoucements] = useState<Announcement[]>([])
  const { masjid: masjidData, loading, GetDataFavMasjid: GetData } = useGetFavMasjidData()
  const announcements1: Announcement[] = []
  useEffect(() => {
    async function fetchData() {
      await GetData()
    }

    fetchData().then((r) => {
      console.log(r)
    })
    return () => {}
  }, [])

  useEffect(() => {
    masjidData.map((masjid) => {
      if (masjid.announcements) {
        masjid.announcements.map((announcement) =>
          announcements1.push({
            createdAt: announcement.createdAt,
            description: announcement.description,
          }),
        )
        setAnnoucements(announcements1)
      }
      return null
    })
  }, [masjidData])

  return (
    <View>
      <HeaderComp navigation={navigation} heading="Announcements" />
      {isEmpty(announcements) && !loading ? (
        <View
          style={{
            alignItems: "center",
            marginVertical: "50%",
          }}
        >
          <AntDesign name="folder1" size={50} />
          <Text>No Announcements</Text>
        </View>
      ) : (
        <>
          {!isEmpty(announcements) ? (
            <FlatList
              style={{ height: Dimensions.get("screen").height * 0.82 }}
              data={_.orderBy(announcements, "createdAt", "desc")}
              keyExtractor={(item, index) => item.id || index.toString()}
              initialNumToRender={15}
              renderItem={({ item }) => <AnnoucmentCard item={item} />}
            />
          ) : (
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
        </>
      )}
    </View>
  )
}

export default AnnouncementView

// const styles = StyleSheet.create({
//   button: {
//     borderRadius: 10,
//     elevation: 2,
//     marginTop: 10,
//     padding: 10,
//     width: "40%",
//   },
//   buttonClose: {
//     backgroundColor: "darkred",
//     marginLeft: 15,
//   },
//   buttonOpen: {
//     backgroundColor: "#5C5C5C",
//     marginRight: 15,
//   },
//   centeredView: {
//     alignItems: "center",
//     backgroundColor: "#6d6d6d6b",
//     flex: 1,
//     justifyContent: "center",
//   },
//   editTime: {
//     backgroundColor: "#dddd",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   modalText: {
//     fontSize: 20,
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   modalView: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     elevation: 5,
//     margin: 20,
//     padding: 35,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
// textStyle: {
//   color: "white",
//   fontWeight: "bold",
//   textAlign: "center",
// },
// textStyle1: {
//   color: "white",
//   fontWeight: "bold",
//   textAlign: "center",
// },
// })
