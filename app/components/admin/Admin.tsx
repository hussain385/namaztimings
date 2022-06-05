import _ from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { Dimensions, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import { isEmpty, isLoaded, populate, useFirestoreConnect } from "react-redux-firebase"
import { modifyData, selectFirebase, selectFirestore } from "../../hooks/firebase"
import AdminCard from "./AdminCard"
import AdminView from "./AdminView"
import Icon from "react-native-vector-icons/FontAwesome5"
import { Header } from "react-native-elements"
import { ActivityIndicator } from "react-native-paper"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { DrawerStackParamList } from "../../navigation"
import { Masjid, MasjidRequest, User } from "../../types/firestore"
import firestore from "@react-native-firebase/firestore"

// const populates = [
//   { child: "requestList", root: "requests", childAlias: "requests" },
//   { child: "adminId", root: "users", childAlias: "admin" },
// ]

const Admin: React.FC<DrawerScreenProps<DrawerStackParamList, "Admin view">> = ({ navigation }) => {
  const { auth, profile } = useSelector(selectFirebase)
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
    firestore()
      .collection("Masjid")
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
      .then((value) => setSnapshot(value))
  }, [])

  return (
    <SafeAreaView>
      {snapshot.length > 1 && (
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
                Admin
              </Text>
            </View>
          }
          backgroundColor="#1F441E"
        />
      )}
      {!isLoaded(snapshot) && (
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
                  params: { Masjid: data, masjidId: doc.uid, isSingle: true },
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
