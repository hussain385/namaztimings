import React, { useState } from "react"
import { Dimensions, SafeAreaView, Text } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { useGetMasjidPopulate } from "../../hooks/firebase"
import { HomePropsType } from "../../navigation"

const window = Dimensions.get("window")
const { width, height } = window
const LATITUD_DELTA = 0.0052

const Map: React.FC<HomePropsType<"Map">> = ({ navigation, route }) => {
  const [titleShow, setTitleShow] = useState("")
  const { longitude, latitude } = route.params
  const { masjidData } = useGetMasjidPopulate({ latitude, longitude })

  return (
    <SafeAreaView>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={true}
        initialRegion={{
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: LATITUD_DELTA,
          longitudeDelta: (LATITUD_DELTA * width) / height,
        }}
      >
        {masjidData !== null
          ? masjidData.map((masjid1, id) => (
              <SafeAreaView key={id}>
                <Marker
                  onCalloutPress={() => {
                    navigation.navigate("More Info", { masjid: masjid1 })
                  }}
                  icon={require("../../components/images/mosque2.png")}
                  coordinate={{
                    latitude: Number(masjid1.g.geopoint.latitude),
                    longitude: Number(masjid1.g.geopoint.longitude),
                  }}
                >
                  <>
                    <Callout>
                      <Text>{masjid1.name}</Text>
                    </Callout>
                  </>
                </Marker>
                {(() => {
                  if (latitude !== 0.0) {
                    return (
                      <Marker
                        title="Your Location"
                        coordinate={{
                          latitude,
                          longitude,
                        }}
                      />
                    )
                  }
                })()}
              </SafeAreaView>
            ))
          : null}
      </MapView>
    </SafeAreaView>
  )
}

export default Map
