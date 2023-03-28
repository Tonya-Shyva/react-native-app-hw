import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  register,
  setAvatar,
  setAvatarAuth,
  uploadPhotoToStorage,
} from "../redux/auth/authOperations";
import "firebase/storage";
import "firebase/database";
import { getStorage } from "firebase/storage";
import { nanoid } from "nanoid";
const avaDefault = require("../assets/images/avatar.jpg");

export const Registration = ({ navigation }) => {
  const dispatch = useDispatch();

  const [isShowKeyBoard, setIsShowKeyBoard] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [securePassword, setSecurePassword] = useState(true);
  const [toggleIcon, setToggleIcon] = useState(
    <Entypo name="eye-with-line" size={24} color="black" />
  );

  const keyboardHide = () => {
    () => setIsShowKeyBoard(false);
    Keyboard.dismiss();
  };

  const addAvatar = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result) {
        setAvatar(avaDefault);
        dispatch(setAvatarAuth(avaDefault));
      }

      if (!result.canceled) {
        const uriAva = result.assets[0].uri;
        setAvatar(uriAva);
        dispatch(setAvatarAuth(uriAva));
      }
    } catch (err) {
      const errCode = err.code;
      const errMessage = err.message;
      console.log(errCode, errMessage);
    }
  };

  useEffect(() => {}, [avatar]);
  const loginChange = (value) => {
    setLogin(value);
  };
  const emailChange = (value) => {
    setEmail(value);
  };
  const passwordChange = (value) => {
    setPassword(value);
  };

  // const uploadPhotoToStorage = async () => {
  //   const storage = getStorage();
  //   const response = await fetch(avatar);
  //   const file = await response.blob();
  //   const imageId = nanoid();
  //   const storageRef = ref(storage, `avatar/${imageId}`);
  //   await uploadBytes(storageRef, file).then((snapShot) => {
  //     console.log("Uploaded a blob or file!");
  //   });
  //   const urlAvatar = await getDownloadURL(ref(storage, `avatar/${imageId}`));
  //   console.log(storageUrlPhoto);
  //   return urlAvatar;
  // };

  const handleSubmit = async () => {
    try {
      keyboardHide();
      if (login === "" || email === "" || password === "") {
        return Alert.alert("Заповніть всі обов'язкові поля");
      }
      // const urlAvatar = await uploadPhotoToStorage();
      dispatch(register({ login, email, password, avatar }));
      // setLogin("");
      // setEmail("");
      // setPassword("");
      // setAvatar(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const togglePassInput = () => {
    if (securePassword === true) {
      setSecurePassword(false);
      setToggleIcon(<AntDesign name="eye" size={24} color="black" />);
    } else {
      setSecurePassword(true);
      setToggleIcon(<Entypo name="eye-with-line" size={24} color="black" />);
    }
  };

  const onTransition = () => {
    navigation.navigate("Логін");
  };

  return (
    <ImageBackground
      style={styles.image}
      source={require("../assets/images/bg-image.jpg")}
    >
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.containerReg,
              margingBottom: isShowKeyBoard && 103,
            }}
            // style={{
            //   ...styles.containerReg,
            //   marginTop: isShowKeyBoard ? 103 : 219,
            // }}
          >
            <View style={styles.avatarWrapper}>
              <Image style={styles.avatar} source={{ uri: avatar }} />
              <Pressable onPress={addAvatar} style={styles.iconPlus}>
                <AntDesign name="pluscircleo" size={30} color="#FF6C00" />
              </Pressable>
            </View>

            <Text style={styles.title}>Реєстрація</Text>
            <ScrollView>
              <TextInput
                style={styles.input}
                value={login}
                placeholder="Логін"
                onChangeText={loginChange}
                onFocus={() => setIsShowKeyBoard(true)}
              />
              <TextInput
                style={styles.input}
                value={email}
                placeholder="Адреса електронної пошти"
                onChangeText={emailChange}
                onFocus={() => setIsShowKeyBoard(true)}
              />
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Пароль"
                secureTextEntry={securePassword}
                onChangeText={passwordChange}
                onFocus={() => setIsShowKeyBoard(true)}
              />
              <Pressable style={styles.passwordIcon} onPress={togglePassInput}>
                {toggleIcon}
              </Pressable>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.text}>Зареєструватись</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subscribeWrapper}
                activeOpacity={0.8}
                onPress={onTransition}
              >
                <Text style={{ color: "#1B4371" }}>
                  Вже є аккаунт? <Text>Увійти</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  containerReg: {
    position: "relative",
    // justifyContent: "center",
    // alignItems: "stretch",
    fontFamily: "Roboto400",
    fontSize: 16,
    lineHeight: 19,
    paddingHorizontal: 16,
    paddingBottom: 45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  avatarWrapper: {
    position: "absolute",
    zIndex: 99,
    top: -50,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    alignSelf: "center",
  },
  avatar: {
    width: 120,
    height: 120,
  },
  iconPlus: {
    top: -50,
    left: 105,
  },
  title: {
    marginTop: 92,
    marginBottom: 16,
    fontFamily: "Roboto500",
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#212121",
  },
  input: {
    height: 44,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
  },
  passwordIcon: {
    position: "absolute",
    top: 145,
    right: 30,
    cursor: "pointer",
    userSelect: "none",
    zIndex: 99,
  },
  button: {
    justifyContent: "center",
    padding: 16,
    marginVertical: 16,
    marginTop: 43,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 32,
    backgroundColor: "#FF6C00",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  subscribeWrapper: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
