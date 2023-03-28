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
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";

import { storage, db } from "../firebase/config";
import { selectID, selectName } from "../redux/auth/selectors";
import { uploadPhotoToStorage } from "../redux/auth/authOperations";

export const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [photoSignature, setPhotoSignature] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [locationText, setLocationText] = useState(null);

  const uid = useSelector(selectID);
  const name = useSelector(selectName);

  useEffect(() => {
    (async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
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

  useEffect(() => {
    if (location) {
      (async () => {
        let [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address) {
          setCity(address.city);
          setCountry(address.country);
          // setLocation(address);
        }
      })();
    }
  }, [location]);

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const deletePhoto = async () => {
    if (photo) {
      await FileSystem.deleteAsync(photo);
      setPhoto("");
    }
  };

  const photoSignatureHandler = (text) => {
    setPhotoSignature(text);
  };

  // const photoLocationHandler = (text) => {
  //   setLocationText(text);
  // };

  let text = "Loading location... ";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `${city}, ${country}`;
    // setLocationText(text);
  }

  const uploadPhotoToStorage = async () => {
    const response = await fetch(photo);
    const blobFile = await response.blob();

    const imageId = nanoid();
    const storageRef = ref(storage, `postImage/${imageId}`);

    await uploadBytes(storageRef, blobFile).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    const storageUrlPhoto = await getDownloadURL(
      ref(storage, `postImage/${imageId}`)
    );
    return storageUrlPhoto;
  };

  const downloadPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const pictureUri = result.assets[0].uri;
      console.log(pictureUri);
      setPhoto(pictureUri);
      // dispatch(uploadPhotoToStorage(uri));
    }
  };

  const uploadPostToStorage = async () => {
    // const photo = await uploadPhotoToStorage();
    try {
      const dataToSave = {
        name,
        uid,
        photoSignature,
        // location,
        photo,
        commentCounter: 0,
        locationText: text,
      };
      if (location) dataToSave.location = location.coords;
      const docRef = await addDoc(collection(db, "posts"), dataToSave);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error(e);
    }
  };

  const sendPost = async () => {
    await uploadPostToStorage();
    // console.log("Не пост");
    setPhotoSignature("");
    setLocationText("");
    setPhoto(null);
    navigation.navigate("Публікації");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={styles.container}>
          {useIsFocused() && (
            <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
              {photo && (
                <View style={styles.takePhotoWrap}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 300, height: 200 }}
                  />
                </View>
              )}
              <TouchableOpacity style={styles.snapIconWrap} onPress={takePhoto}>
                <FontAwesome name="camera" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            </Camera>
          )}

          <Pressable onPress={downloadPicture}>
            <Text
              style={{
                ...styles.downloadText,
                color: photo ? "#BDBDBD" : "#000",
              }}
            >
              Завантажте фото
            </Text>
          </Pressable>
          <TextInput
            value={photoSignature}
            onChangeText={photoSignatureHandler}
            placeholder="Назва..."
            style={styles.input}
          />
          <View position="relative">
            <Pressable
              style={styles.mapBtn}
              // onPress={() => {
              //   navigation.navigate("Map", { location });
              // }}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={24}
                color="#BDBDBD"
              />
            </Pressable>
            <TextInput
              // value={locationText}
              // onChangeText={photoLocationHandler}
              placeholder="Місцевість..."
              style={{ ...styles.input, paddingLeft: 30 }}
            >
              {text}
            </TextInput>
          </View>
          <Pressable onPress={sendPost} style={styles.button}>
            <Text style={styles.buttonText}>Опублікувати</Text>
          </Pressable>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "center",
              alignItems: "center",
            }}
            onPress={deletePhoto}
          >
            <MaterialCommunityIcons
              name="delete-variant"
              size={50}
              color={photo ? "black" : "#BDBDBD"}
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
    flexDirection: "row",
    // alignItems: "start",
    height: 240,
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
  },
  snapIconWrap: {
    width: 50,
    height: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    // alignSelf: "center",
    backgroundColor: "#fff",
  },
  takePhotoWrap: {
    position: "absolute",
    top: 15,
    left: 10,
    borderWidth: 3,
    borderColor: "red",
  },
  downloadText: {
    marginTop: 10,
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
