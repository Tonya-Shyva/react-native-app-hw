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
  Alert,
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
import { PostItem } from "../components/PostItem";
import {
  selectName,
  selectAvatar,
  selectID,
  selectIsAuth,
} from "../redux/auth/selectors";
import {
  logOut,
  setAvatarAuth,
  uploadPhotoToStorage,
} from "../redux/auth/authOperations";

export const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const name = useSelector(selectName);
  const id = useSelector(selectID);
  const avaDefault = require("../assets/images/avatar.jpg");

  useEffect(() => {
    const avaFromStorage = getAuth().currentUser.photoURL;
    // if (!avaFromStorage) {
    //   return;
    // }
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

  useEffect(() => {
    dispatch(setAvatarAuth(avatar));
  }, [avatar]);

  const addAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      const uriAva = result.assets[0].uri;
      setAvatar(uriAva);
      dispatch(setAvatarAuth(uriAva));
    } catch (err) {
      return Alert.alert(`Упс: ${err.message}`);
    }
  };

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
          {avatar ? (
            <Image style={styles.avatar} source={{ uri: avatar }} />
          ) : (
            <Image style={styles.avatar} source={avaDefault} />
          )}

          <Pressable onPress={addAvatar} style={styles.plusIcon}>
            <AntDesign name="pluscircleo" size={30} color="#FF6C00" />
          </Pressable>
        </View>
        <Pressable onPress={logOutHandler} style={styles.logoutIcon}>
          <MaterialCommunityIcons name="logout" size={26} color="#aaa" />
        </Pressable>
        <Text style={styles.name}>{name}</Text>
        <SafeAreaView>
          <FlatList
            data={posts}
            renderItem={({ item }) => (
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
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "contain",
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

  plusIcon: {
    position: "absolute",
    top: 70,
    left: 106,
  },

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
