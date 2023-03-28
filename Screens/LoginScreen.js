import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { logIn } from "../redux/auth/authOperations";

export const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isShowKeyBoard, setIsShowKeyBoard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [toggleIcon, setToggleIcon] = useState(
    <Entypo name="eye-with-line" size={24} color="black" />
  );

  const keyboardHide = () => {
    () => setIsShowKeyBoard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    keyboardHide();
    if (email === "" || password === "") {
      return Alert.alert("Заповніть всі обов'язкові поля");
    }
    dispatch(logIn({ email, password }));
    // setEmail("");
    // setPassword("");
  };

  const emailChange = (value) => setEmail(value);
  const passwordChange = (value) => setPassword(value);

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
    navigation.navigate("Реєстрація");
  };

  return (
    <ImageBackground
      style={{ ...styles.image, paddingTop: isShowKeyBoard ? 45 : 111 }}
      source={require("../assets/images/bg-image.jpg")}
    >
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          {/* <ScrollView> */}
          <View
            style={
              styles.container
              // marginTop: isShowKeyBoard ? 229 : 279,
            }
          >
            <Text style={styles.title}>Увійти</Text>
            <TextInput
              value={email}
              onChangeText={emailChange}
              placeholder="Адреса електронної пошти"
              style={styles.input}
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Пароль"
              secureTextEntry={securePassword}
              onChangeText={passwordChange}
            />
            <Pressable style={styles.passwordIcon} onPress={togglePassInput}>
              {toggleIcon}
            </Pressable>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.text}>Увійти</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.subscribeWrapper}
              activeOpacity={0.8}
              onPress={onTransition}
            >
              <Text style={{ color: "#1B4371" }}>
                Ще нема аккаунта?
                <Text> Зареєструватися</Text>
              </Text>
            </TouchableOpacity>
          </View>
          {/* </ScrollView> */}
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

  container: {
    alignItems: "stretch",
    fontFamily: "Roboto400",
    fontSize: 16,
    lineHeight: 19,
    paddingHorizontal: 16,
    paddingBottom: 111,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginTop: 32,
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
    top: 170,
    right: 30,
    cursor: "pointer",
    userSelect: "none",
    zIndex: 99,
  },
  button: {
    backgroundColor: "#FF6C00",
    borderRadius: 32,
    padding: 16,
    marginVertical: 16,
    marginTop: 43,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  subscribeWrapper: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
