import moment from "moment"
import React from "react"
import { Text, View } from "react-native"

const LastUpdated = ({ timeStamp }: { timeStamp: FirebaseFirestore.Timestamp }) => {
  const pastTime = moment(timeStamp?.seconds * 1000)
  const now = moment()
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#E1E1E1",
        padding: 10,
        width: "100%",
      }}
    >
      <Text style={{ fontSize: 17 }}>Last Updated:</Text>
      <Text
        style={{
          fontSize: 17,
          marginLeft: 5,
          color: `${now.diff(pastTime, "days") <= 30 ? "#008000" : "darkred"}`,
        }}
      >
        {moment(timeStamp?.seconds * 1000).format("MMMM Do YYYY") === "Invalid date"
          ? "Not Available"
          : moment(timeStamp?.seconds * 1000).format("MMMM, Do YYYY")}
      </Text>
    </View>
  )
}

export default LastUpdated
