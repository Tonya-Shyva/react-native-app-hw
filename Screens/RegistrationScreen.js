import React, { useState } from "react";
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
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export const Registration = ({ navigation }) => {
  const [isShowKeyBoard, setIsShowKeyBoard] = useState(false);
  const [login, setLogin] = useState("");
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

  const onSubmit = () => {
    keyboardHide();
    if (login === "" || email === "" || password === "") {
      return Alert.alert("Заповніть всі обов'язкові поля");
    }
    setLogin("");
    setEmail("");
    setPassword("");
  };

  const loginChange = (value) => {
    setLogin(value);
    setIsShowKeyBoard(true);
  };
  const emailChange = (value) => {
    setEmail(value);
    setIsShowKeyBoard(true);
  };
  const passwordChange = (value) => {
    setPassword(value);
    setIsShowKeyBoard(true);
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
          <ScrollView
            style={{
              ...styles.container,
              marginTop: isShowKeyBoard ? 103 : 219,
            }}
          >
            {/* <View> */}
            <View style={styles.avatarWrapper}>
              {/* <Image style={styles.avatar} source={{ uri: ava }} /> */}
              <Pressable onPress="">
                <AntDesign
                  name="pluscircleo"
                  size={30}
                  color="#FF6C00"
                  style={styles.icon}
                />
                {/* <AntDesign name="closecircleo" size={24} color="black" /> */}
              </Pressable>
            </View>

            <Text style={styles.title}>Реєстрація</Text>

            <TextInput
              style={styles.input}
              value={login}
              placeholder="Логін"
              onChangeText={loginChange}
            />
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Адреса електронної пошти"
              onChangeText={emailChange}
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
              onPress={onSubmit}
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
  icon: {
    top: 70,
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
    top: 290,
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
