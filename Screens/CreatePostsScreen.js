import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";

import { selectID, selectName } from "../redux/auth/selectors";

export const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photoUri, setPhotoUri] = useState("");
  const [location, setLocation] = useState(null);
  const [photoLocation, setPhotoLocation] = useState("");
  const [photoSignature, setPhotoSignature] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  // const [type, setType] = useState(Camera.Constants.Type.back);
  const [errorMsg, setErrorMsg] = useState(null);
  const uid = useSelector(selectID);
  const name = useSelector(selectName);

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      const location = await Location.getCurrentPositionAsync();
      setPhotoUri(photo.uri);
    }
  };

  const handleDeletePhoto = async () => {
    if (photo) {
      await FileSystem.deleteAsync(photoUri, { idempotent: true });
      setPhotoUri(null);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const photoTitleHandler = (text) => {
    setPhotoSignature(text);
  };

  const photoLocationHandler = (text) => {
    setPhotoLocation(text);
  };

  const uploadPhotoToStorage = async () => {
    const response = await fetch(photoUri);
    const file = await response.blob();

    const photoId = nanoid();
    const storageRef = ref(storage, `postImage/${photoId}`);

    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    const storagePhotoUrl = await getDownloadURL(
      ref(storage, `postImage/${photoId}`)
    );
    return storagePhotoUrl;
  };

  const uploadPostToStorage = async () => {
    const photo = await uploadPhotoToStorage();

    try {
      const valueObj = {
        name,
        uid,
        photoSignature,
        photoLocation,
        photo,
        commentCounter: 0,
      };
      if (location) valueObj.location = location.coords;
      const docRef = await addDoc(collection(db, "posts"), valueObj);
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const sendPhoto = async () => {
    await uploadPostToStorage();
    setPhotoSignature("");
    setPhotoLocation("");
    setPhotoUri(null);
    navigation.navigate("Публікації", { photoUri });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={styles.container}>
          {useIsFocused() && (
            <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
              {photoUri && (
                <View style={styles.takePhotoWrap}>
                  <Image
                    source={{ uri: photoUri }}
                    style={{ width: 300, height: 200 }}
                  />
                </View>
              )}
              <TouchableOpacity style={styles.snapIconWrap} onPress={takePhoto}>
                <FontAwesome name="camera" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            </Camera>
          )}

          <Pressable onPress={uploadPhotoToStorage}>
            <Text style={styles.text}>Завантажте фото</Text>
          </Pressable>
          <TextInput
            value={photoSignature}
            onChangeText={photoTitleHandler}
            placeholder="Назва..."
            style={styles.input}
          />
          <View position="relative">
            <Pressable
              style={styles.mapBtn}
              onPress={() => {
                navigation.navigate("Map");
              }}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={24}
                color="#BDBDBD"
              />
            </Pressable>
            <TextInput
              value={photoLocation}
              onChangeText={photoLocationHandler}
              placeholder="Місцевість..."
              style={{ ...styles.input, paddingLeft: 30 }}
            ></TextInput>
          </View>
          <Pressable onPress={sendPhoto} style={styles.button}>
            <Text style={styles.buttonText}>Опублікувати</Text>
          </Pressable>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center",
            }}
            onPress={handleDeletePhoto}
          >
            <MaterialCommunityIcons
              name="delete-variant"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    height: 240,
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
  },
  snapIconWrap: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  takePhotoWrap: {
    position: "absolute",
    top: 10,
    left: 10,
    borderWidth: 3,
    borderColor: "red",
  },
  text: {
    marginTop: 10,
    color: "#BDBDBD",
  },
  input: {
    height: 44,
    padding: 2,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  mapBtn: {
    position: "absolute",
    top: 28,
    left: 2,
  },
  button: {
    backgroundColor: "#FF6C00",
    borderRadius: 32,
    padding: 16,
    marginVertical: 16,
    marginTop: 43,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});
