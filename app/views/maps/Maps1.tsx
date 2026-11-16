import React from "react"
import { Dimensions, SafeAreaView } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import Icon from "react-native-vector-icons/FontAwesome5"
import { HomePropsType } from "../../navigation"

const window = Dimensions.get("window")
const { width, height } = window
const LATITUD_DELTA = 0.0052

const Maps1: React.FC<HomePropsType<"Map1">> = ({ route }) => {
  const { masjid } = route.params

  return (
    <SafeAreaView>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={true}
        initialRegion={{
          latitude: Number(masjid.g.geopoint.latitude),
          longitude: Number(masjid.g.geopoint.longitude),
          latitudeDelta: LATITUD_DELTA,
          longitudeDelta: (LATITUD_DELTA * width) / height,
        }}
      >
        <SafeAreaView>
          <Marker
            title={`${masjid.name}`}
            icon={require("../../components/images/mosque2.png")}
            coordinate={{
              latitude: Number(masjid.g.geopoint.latitude),
              longitude: Number(masjid.g.geopoint.longitude),
            }}
          />
        </SafeAreaView>
      </MapView>
    </SafeAreaView>
  )
}

export default Maps1
