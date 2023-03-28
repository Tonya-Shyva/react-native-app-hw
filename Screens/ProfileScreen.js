import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import { storage, db, auth } from "../firebase/config";
import PostItem from "../components/PostItem";
import {
  selectName,
  selectAvatar,
  selectID,
  selectIsAuth,
} from "../redux/auth/selectors";
import { logOut, setAvatarAuth } from "../redux/auth/authOperations";
import { VirtualizedList } from "react-native";

export const ProfileScreen = ({ navigation }) => {
  // const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const name = useSelector(selectName);
  const id = useSelector(selectID);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    if (!isAuth) return;
    const avaFromStorage = getAuth().currentUser.photoURL;
    setAvatar(avaFromStorage);

    const queryRequest = query(collection(db, "posts"), where("uid", "==", id));
    const unsubscribe = onSnapshot(queryRequest, (querySnapshot) => {
      const allPosts = [];
      querySnapshot.forEach((doc) =>
        allPosts.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      setPosts(allPosts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {}, [avatar]);

  const addAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    const uriAva = result.assets[0].uri;
    setAvatar(uriAva);
    dispatch(setAvatarAuth(uriAva));
  };

  const getItemCount = () => posts.length;

  const getItem = (posts, index) => ({
    photo: posts[index].photo,
    title: posts[index].photoSignature,
    location: posts[index].location,
    uid: posts[index].uid,
    id: posts[index].id,
    locationText: posts[index].locationText,
  });

  const logOutHandler = () => {
    dispatch(logOut());
  };

  return (
    <ImageBackground
      style={styles.image}
      source={require("../assets/images/bg-image.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={{ uri: avatar }} />
          <Pressable onPress={addAvatar} style={styles.pressIcon}>
            <AntDesign name="pluscircleo" size={30} color="#BDBDBD" />
          </Pressable>
        </View>
        <Pressable onPress={logOutHandler} style={styles.logoutIcon}>
          <MaterialCommunityIcons name="logout" size={26} color="#aaa" />
        </Pressable>
        <Text style={styles.name}>{name}</Text>
        <VirtualizedList
          data={posts}
          initialNumToRender={posts.length}
          renderItem={({ item }) => (
            <PostItem
              navigation={navigation}
              photo={item.photo}
              title={item.title}
              id={item.id}
              uid={item.uid}
              location={item.location}
              locationText={item.locationText}
            />
          )}
          keyExtractor={(item) => item.id}
          getItemCount={getItemCount}
          getItem={getItem}
        />
        {/* <SafeAreaView>
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              // console.log(item)
              <PostItem
                navigation={navigation}
                title={item.photoSignature}
                photo={item.photo}
                uid={item.uid}
                id={item.id}
                location={item.location}
                locationText={item.locationText}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView> */}
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
  container: {
    position: "relative",
    height: "85%",
    backgroundColor: "#fff",
    fontSize: 45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  post: {
    backgroundColor: "#ccc",
    width: 343,
    height: 299,
  },
  // imageWrap: {
  //   backgroundColor: "green",
  //   borderRadius: 17,
  //   position: "relative",
  //   height: 0,
  // },
  avatarWrapper: {
    position: "absolute",
    top: -50,
    zIndex: 99,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    alignSelf: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 15,
    alignSelf: "center",
  },

  pressIcon: {
    position: "absolute",
    top: 70,
    left: 107,
    // rotate: 45,
    collor: "white",
  },

  // icon: {
  //   rotate: "45deg",
  // },

  box: {
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
