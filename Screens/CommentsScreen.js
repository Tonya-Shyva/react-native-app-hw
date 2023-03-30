import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  View,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import date from "date-and-time";
import uk from "date-and-time/locale/uk";
import { useEffect } from "react";

import { db } from "../firebase/config";
import { Comment } from "../components/Comment";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { selectName } from "../redux/auth/selectors";

export const CommentsScreen = ({ route }) => {
  const currentUid = getAuth().currentUser.uid;
  const { photo, id, uid } = route.params;
  const avatar = getAuth().currentUser.photoURL;
  const [text, setText] = useState("");
  const [comments, setComments] = useState(null);
  // const name = useSelector(selectName);

  date.locale(uk);
  const commentDate = date.format(new Date());

  const createPost = async () => {
    if (text === "") return;
    try {
      const time = date.format(new Date(), "D MMMM, YYYY | HH:mm");

      await addDoc(collection(db, "posts", id, "comments"), {
        avatar,
        text,
        time,
        uid: currentUid,
        commentDate,
      });
    } catch (err) {
      return Alert.alert(`Упс: ${err.message}`);
    }
    setText("");
  };

  // const getAllComments = async () => {
  //   const q = query(
  //     collection(db, "posts", id, "comments"),
  //     orderBy("commentDate")
  //   );
  //   const commentRef = doc(db, "posts", id);
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const post = [];
  //     querySnapshot.forEach((doc) =>
  //       post.push({
  //         ...doc.data(),
  //         id: doc.id,
  //       })
  //     );
  //     updateDoc(commentRef, { comment: post.length });
  //     console.log(post.length);
  //     setComments(post);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // };

  useEffect(() => {
    // getAllComments();
    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("commentDate")
    );
    const commentRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arrComments = [];
      snapshot.forEach((doc) =>
        post.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      updateDoc(commentRef, { commentCounter: arrComments.length });
      // console.log(post.length);
      setComments(arrComments);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={{ uri: photo }} />
      {/* <SafeAreaView> */}
      {comments && (
        <FlatList
          style={styles.comments}
          data={comments}
          renderItem={({ item }) => (
            <Comment
              avatar={item.avatar}
              text={item.text}
              time={item.time}
              postUid={uid}
              commentUid={item.uid}
              // name={name}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <View style={styles.inputWrap}>
        <TextInput
          onChangeText={(text) => setText(text)}
          style={styles.input}
          value={text}
        />
        <Pressable onPress={createPost} style={styles.button}>
          <MaterialCommunityIcons
            name="arrow-up-circle"
            size={34}
            color="#FF6C00"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorisontal: 16,
    paddingBottom: 16,
  },
  image: {
    resizeMode: "cover",
    marginLeft: "auto",
    marginRight: "auto",
    width: "92%",
    height: 240,
    borderRadius: 15,
  },
  comments: {
    marginTop: 10,
  },
  inputWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  input: {
    width: "90%",
    height: 44,
    padding: 10,
    paddingRight: 50,
    backgroundColor: "#E8E8E8",
    bottom: 0,
    borderRadius: 22,
  },
  button: {
    position: "absolute",
    right: 20,
    top: "7%",
  },
});
