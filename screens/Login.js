import { StatusBar } from "expo-status-bar";
import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Input, Button } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosHandler } from "../auth/helper";
import { SIGNUP_URL, LOGIN_URL } from "../urls";
import { tokenName } from "../auth/authController";

export default function Login({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showScreen, setShowScreen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldsError, setFieldsError] = useState({ user: "", password: "" });

  useLayoutEffect(() => {
    const auth = async () => {
      let token = await AsyncStorage.getItem(tokenName);

      if (token) {
        navigation.replace("Home");
      } else {
        setShowScreen(true);
      }
    };
    auth();

    return () => {};
  }, []);

  const onChangeLogin = (name, value) => {
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const checkInput = async () => {
    setFieldsError({ user: "", password: "" });
    if (!loginData.username.trim()) {
      // setFieldsError({...fieldsError, user: "This field is required!" });
      setFieldsError({ user: "This field is required!" });
      return false;
    }
    if (!loginData.password.trim()) {
      setFieldsError({ password: "This field is required!" });
      return false;
    }
    return true;
  };

  const signIn = async () => {
    const check_non_empty_input = await checkInput();
    if (!check_non_empty_input) return;

    setLoading(true);
    setLoginError(false);
    const result = await axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: loginData,
    }).catch((e) => {
      if (e.response) {
        console.log(e.response.data);
        setErrorMsg(e.response.data.error);
      } else if (e.request) {
        setErrorMsg("Slow internet connection. Try agian");
      }
      setLoginError(true);
      setLoading(false);
    });

    if (result) {
      await AsyncStorage.setItem(tokenName, JSON.stringify(result.data));
      navigation.replace("Login");
    }
  };
  if (!showScreen) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ActivityIndicator
          animating={true}
          color="rgb(251, 28, 67)"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={100}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      {/* <Image
        style={styles.image}
        source={require("../assets/images/login/food2.jpg")}
      /> */}

      <StatusBar style="auto" />
      {loginError && (
        <Text
          style={{
            marginBottom: 5,
            color: "red",
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          {errorMsg}!!!
        </Text>
      )}
      <View style={styles.inputView}>
        <Input
          placeholder="Username"
          autoFocus
          value={loginData.username}
          type="text"
          onChangeText={(text) => onChangeLogin("username", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="black" />}
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          inputStyle={styles.TextInput}
          placeholderTextColor="black"
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.user}
        />
      </View>

      <View style={styles.inputView}>
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          inputStyle={styles.TextInput}
          placeholderTextColor="black"
          value={loginData.password}
          onChangeText={(text) => onChangeLogin("password", text)}
          onEndEditing={signIn}
          disabled={loading}
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            color: "black",
            size: 22,
          }}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.password}
        />
      </View>

      <Button
        title="LOGIN"
        containerStyle={styles.loginBtn}
        type="clear"
        titleStyle={{
          color: "white",
          fontWeight: 700,
        }}
        loading={loading}
        onPress={signIn}
      />

      <Button
        title="SIGNUP"
        containerStyle={styles.signupBtn}
        type="clear"
        titleStyle={{
          color: "grey",
          fontSize: 12,
        }}
        disabled={loading}
        onPress={() => navigation.navigate("Signup")}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 30,
    height: 170,
    width: "100%",
  },

  inputView: {
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,

    alignItems: "center",
  },

  TextInput: {
    color: "black",
    fontSize: 13,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    marginTop: 40,
    backgroundColor: "rgb(251, 28, 67)",
  },

  signupBtn: {
    width: "40%",
    borderRadius: 25,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "beige",
  },

  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
});
