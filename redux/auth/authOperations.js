import { Alert } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateCurrentUser,
} from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import nanoid from "nanoid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase/config";

const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await updateProfile(auth.currentUser, {
        displayName: credentials.login,
        photoURL: credentials.avatar,
      });
      const updateUser = auth.currentUser;

      return {
        name: updateUser.displayName,
        email: updateUser.email,
        id: updateUser.uid,
        token: updateUser.accessToken,
        avatar: updateUser.photoURL,
      };
    } catch (error) {
      if (`${error}`.includes("auth/email-already-in-use")) {
        Alert.alert(
          "Користувач з таким email вже існує. Перейдіть на сторінку логіну"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

const logIn = createAsyncThunk(
  "auth/logIn",
  async (credentials, { rejectWithValue }) => {
    const auth = getAuth();
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return {
        name: user.displayName,
        email: user.email,
        id: user.uid,
        token: user.accessToken,
        avatar: user.avatar,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const setAvatarAuth = createAsyncThunk(
  "auth/setAvatar",
  async (uri, { rejectWithValue }) => {
    const auth = getAuth();
    try {
      const avatar = await uploadPhotoToStorage(uri);
      await updateProfile(auth.currentUser, { photoURL: avatar });
      const updateUser = auth.currentUser;
      return {
        name: updateUser.displayName,
        email: updateUser.email,
        id: updateUser.uid,
        token: updateUser.accessToken,
        avatar: updateUser.photoURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const uploadPhotoToStorage = async (uri) => {
  const response = await fetch(uri);
  const file = await response.blob();
  const imageId = nanoid();
  const storageRef = ref(storage, `avatar/${imageId}`);
  await uploadBytes(storageRef, file).then((snapShot) => {
    console.log("Uploaded a blob or file!");
  });
  const storageUrlPhoto = await getDownloadURL(
    ref(storage, `avatar/${imageId}`)
  );
  console.log(storageUrlPhoto);
  return storageUrlPhoto;
};

export { register, logIn, logOut, setAvatarAuth, uploadPhotoToStorage };
