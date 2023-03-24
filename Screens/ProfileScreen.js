import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";

export const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState();

  return (
    <ImageBackground
      style={styles.image}
      source={require("../assets/images/bg-image.jpg")}
    >
      <View style={styles.box}>
        <View style={styles.imageWraper}>
          <Image style={styles.avatar} source={{ uri: "" }} />
          <Pressable onPress="" style={styles.pressIcon}>
            <Ionicons
              name="add-circle-outline"
              size={30}
              color="#bdbdbd"
              style={styles.icon}
            />
          </Pressable>
        </View>

        <Pressable onPress="" style={styles.logoutIcon}>
          <MaterialCommunityIcons name="logout" size={26} color="#aaa" />
        </Pressable>
        <Text style={styles.name}>name</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostItem
              navigation={navigation}
              title={item.imageSignature}
              photo={item.photo}
              imageLocation={item.imageLocation}
              uid={item.uid}
              id={item.id}
              location={item.location}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  box: {
    height: "85%",
    backgroundColor: "#fff",
    fontSize: 45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
  },
  post: {
    backgroundColor: "#ccc",
    width: 343,
    height: 299,
  },
  imageWraper: {
    backgroundColor: "green",
    borderRadius: 17,
    position: "relative",
    height: 0,
  },

  avatar: {
    position: "absolute",
    top: -48,
    width: 120,
    height: 120,

    borderRadius: 15,
    alignSelf: "center",
  },

  pressIcon: {
    position: "absolute",
    top: 18,
    left: 240,
    rotate: "45deg",
    collor: "white",
  },

  icon: {
    rotate: "45deg",
  },

  container: {
    backgroundColor: "grey",
    fontFamily: "Roboto400",
    fontSize: 16,
    padding: 16,
    paddingBottom: 45,
    alignItems: "stretch",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  logoutIcon: {
    position: "absolute",
    top: 20,
    right: 15,
  },

  name: {
    marginTop: 92,
    marginBottom: 32,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});
