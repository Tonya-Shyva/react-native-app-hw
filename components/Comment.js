import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export const Comment = ({ avatar, text, time, postUid, commentUid }) => {
  return postUid === commentUid ? (
    <View style={styles.comment}>
      <View style={styles.userWrap}>
        {/* <Text style={styles.name}>{name}</Text> */}
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{time} </Text>
      </View>
      <Image style={styles.userAvatar} source={{ uri: avatar }} />
    </View>
  ) : (
    <View style={styles.comment}>
      <Image style={styles.guestAvatar} source={{ uri: avatar }} />
      <View style={styles.wrap}>
        {/* <Text style={styles.name}>{name}</Text> */}
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{time} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    fontFamily: "Roboto400",
    fontSize: 13,
    flex: 1,
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },

  guestAvatar: {
    width: 28,
    height: 28,
    marginRight: 10,
    borderRadius: 14,
  },
  userAvatar: {
    width: 28,
    height: 28,
    marginLeft: 10,
    borderRadius: 14,
  },
  wrap: {
    width: 290,
    flexWrap: "wrap",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderTopLeftRadius: 0,
    padding: 12,
    borderRadius: 6,
  },
  userWrap: {
    width: 290,
    flexWrap: "wrap",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderTopRightRadius: 0,
    padding: 12,
    borderRadius: 6,
  },
  // name: {
  //   fontFamily: "Roboto500",
  //   fontWeight: "bold",
  //   lineHeight: 18,
  //   fontSize: 14,
  // },
  text: {
    fontFamily: "Roboto400",
    fontSize: 13,
    lineHeight: 18,
    width: 258,
    // marginLeft: 16,
  },
  time: {
    fontSize: 10,
    lineHeight: 18,
    width: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 8,
    color: "#BDBDBD",
  },
});
