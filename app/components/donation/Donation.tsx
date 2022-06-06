import React, { useState } from "react"
import HeaderComp from "../header/HeaderComp"
import { Dimensions, Image, ScrollView, Text, View } from "react-native"
import DonationModal from "../modal/DonationModal"
import { HomePropsType } from "../../navigation"

const windowHeight = Dimensions.get("screen").height
const windowWidth = Dimensions.get("screen").width

const Donation: React.FC<HomePropsType<"Donation">> = ({ route }) => {
  const { masjid, edit, adminView = false } = route.params
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <>
      <HeaderComp heading="Donation Info" />
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "600", marginBottom: 10 }}>{masjid.name}</Text>
          <Image
            source={require("../../../assets/image/donation.png")}
            style={{
              width: windowWidth * 0.6,
              height: windowHeight * 0.4,
            }}
          />
          <Text
            style={{
              marginHorizontal: windowWidth * 0.1,
              textAlign: "center",
              fontSize: 16,
              marginTop: -10,
            }}
          >
            Various Hadith cite the Prophet (PBUH) saying:{" "}
            <Text style={{ fontWeight: "700" }}>
              “Whoever builds a masjid for the sake of Allah, Allah will build for him a house in
              Paradise.”
            </Text>{" "}
            By donating, not only will you be providing a place of worship but laying foundations
            for your own spiritual rewards in this life and the next.
          </Text>
          {/* <TouchableOpacity */}
          {/*  style={{ */}
          {/*    alignItems: 'center', */}
          {/*    backgroundColor: '#1F441E', */}
          {/*    padding: 10, */}
          {/*    borderRadius: 5, */}
          {/*    width: '70%', */}
          {/*    marginTop: 20, */}
          {/*    marginHorizontal: 10, */}
          {/*  }} */}
          {/*  onPress={() => setModalVisible(!modalVisible)}> */}
          {/*  <Text style={{color: '#CEE6B4', fontSize: 16}}> */}
          {/*    Donation Details */}
          {/*  </Text> */}
          {/* </TouchableOpacity> */}
          <DonationModal
            // modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            editable={edit}
            masjid={masjid}
            adminView={adminView}
          />
        </View>
      </ScrollView>
    </>
  )
}

export default Donation
