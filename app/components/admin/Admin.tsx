import _ from "lodash"
import React, { useEffect, useState } from "react"
import { Dimensions, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import { isEmpty, isLoaded } from "react-redux-firebase"
import { modifyData, selectFirebase } from "../../hooks/firebase"
import AdminCard from "./AdminCard"
import AdminView from "./AdminView"
import { Header } from "react-native-elements"
import { ActivityIndicator } from "react-native-paper"
import { HomePropsType } from "../../navigation"
import { Masjid } from "../../types/firestore"
import firestore from "@react-native-firebase/firestore"
import FontAwesome from "react-native-vector-icons/FontAwesome"

// const populates = [
//   { child: "requestList", root: "requests", childAlias: "requests" },
//   { child: "adminId", root: "users", childAlias: "admin" },
// ]

const Admin: React.FC<HomePropsType<"Admin view">> = ({ navigation }) => {
  const { auth, profile } = useSelector(selectFirebase)
  const [loading, setLoading] = useState(true)
  // const firestore = useSelector(selectFirestore)
  // useFirestoreConnect([
  //   {
  //     collection: "Masjid",
  //     where: !profile.isAdmin && [
  //       ["adminId", "==", isLoaded(auth) && !isEmpty(auth) ? auth.uid : ""],
  //     ],
  //     storeAs: "myMasjids",
  //     populates,
  //   },
  //   {
  //     collection: "requests",
  //   },
  // ])
  // const snapshot = populate(firestore, "myMasjids", populates)
  const [snapshot, setSnapshot] = useState<Masjid[]>([])
  useEffect(() => {
    setLoading(true)
    const collection = profile.isAdmin
      ? firestore().collection("Masjid")
      : firestore()
          .collection("Masjid")
          .where("adminId", "==", isLoaded(auth) && !isEmpty(auth) ? auth.uid : "")
    collection
      .get()
      .then((e) => e.docs.map((x) => ({ ...(x.data() as Masjid), uid: x.id })))
      // .then(async (masjid) => {
      //   const requests = (await firestore().collection("requests").get()).docs.map((value) => ({
      //     ...(value.data() as MasjidRequest),
      //     uid: value.id,
      //   }))
      //   const users = (await firestore().collection("users").get()).docs.map((value) => ({
      //     ...(value.data() as User),
      //     uid: value.id,
      //   }))
      //   return masjid.map((masjidData) => ({
      //     ...masjidData,
      //     requests: masjidData.requestList?.map((requestData) =>
      //       requests.find((value2) => value2.uid === requestData),
      //     ),
      //     admin: users.find((userData) => userData.uid === masjidData.adminId),
      //   })) as Masjid[]
      // })
      .then((value) => setSnapshot(_.sortBy(value, "name")))
      .then(() => setLoading(false))
  }, [profile.isAdmin])

  return (
    <SafeAreaView>
      {/* {snapshot.length > 1 && ( */}
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" color="#ffff" size={26} style={{ paddingLeft: 10 }} />
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
              Admin
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
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
      {snapshot.length === 1 ? (
        <>
          {_.map(snapshot, (doc) => {
            const data = modifyData(doc, doc.uid!, 0)
            return (
              <AdminView
                route={{
                  params: { Masjid: data },
                }}
                navigation={navigation}
              />
            )
          })}
        </>
      ) : (
        <FlatList
          data={snapshot}
          renderItem={(item) => (
            <AdminCard nav={navigation} masjid={item.item} key={item.item.uid} />
          )}
          initialNumToRender={5}
          keyExtractor={(item, index) => item.uid ?? index.toString()}
          style={{
            height: Dimensions.get("window").height - 80,
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default Admin
