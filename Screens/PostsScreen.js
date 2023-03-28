import { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, VirtualizedList } from "react-native";
import { useSelector } from "react-redux";
// import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  QuerySnapshot,
  doc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { selectName, selectEmail, selectIsAuth } from "../redux/auth/selectors";
import { auth, db } from "../firebase/config";
import { PostItem } from "../components/PostItem";

export const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  // const isAuth = useSelector(selectIsAuth);
  const isAuth = useSelector((state) => state.auth.isAuth);

  useEffect(() => {
    if (!isAuth) return;
    setAvatar(auth.currentUser.photoURL);

    const queryRequest = query(
      collection(db, "posts")
      // orderBy("date", "desc")
    );
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

  const getItemCount = () => posts.length;

  const getItem = (posts, index) => ({
    photo: posts[index].photo,
    title: posts[index].photoSignature,
    location: posts[index].location,
    uid: posts[index].uid,
    id: posts[index].id,
    locationText: posts[index].text,
  });

  return (
    <View style={styles.container}>
      {isAuth && (
        <>
          <View style={styles.avatar}>
            <Image style={styles.image} source={{ uri: avatar }} />
            <View style={styles.wraper}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          <VirtualizedList
            data={posts}
            initialNumToRender={posts.length}
            renderItem={({ item }) => (
              <PostItem
                navigation={navigation}
                photo={item.photo}
                title={item.title}
                locationText={item.locationText}
                id={item.id}
                uid={item.uid}
                location={item.location}
              />
            )}
            keyExtractor={(item) => item.id}
            getItemCount={getItemCount}
            getItem={getItem}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
  },

  avatar: {
    marginTop: 16,
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  image: {
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
