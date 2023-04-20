import { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, VirtualizedList } from "react-native";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { collection, query, onSnapshot } from "firebase/firestore";

import { selectName, selectEmail, selectAvatar } from "../redux/auth/selectors";
import { auth, db } from "../firebase/config";
import { PostItem } from "../components/PostItem";
import { uploadPhotoToStorage } from "../redux/auth/authOperations";

const avaDefault = require("../assets/images/avatar.jpg");

export const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const name = useSelector(selectName);
  const email = useSelector(selectEmail);

  useEffect(() => {
    const avaFromStorage = auth.currentUser.photoURL;
    if (avaFromStorage) {
      setAvatar(avaFromStorage);
    }

    const queryRequest = query(collection(db, "posts"));
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
  }, [avatar]);

  const getItemCount = () => posts.length;

  const getItem = (posts, index) => ({
    photo: posts[index].photo,
    title: posts[index].photoSignature,
    location: posts[index].location,
    uid: posts[index].uid,
    id: posts[index].id,
    locationText: posts[index].locationText,
  });

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {avatar ? (
          <Image style={styles.avatar} source={{ uri: avatar }} />
        ) : (
          <Image style={styles.avatar} source={avaDefault} />
        )}
        <View style={styles.wraper}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      {posts && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
  },

  avatarWrapper: {
    marginTop: 16,
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  wraper: {
    marginLeft: 8,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 13,
    lineHeight: 15,
  },
  email: {
    fontWeight: "normal",
    fontSize: 11,
    lineHeight: 13,
  },
});
