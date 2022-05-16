import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { axiosHandler, getToken } from "../auth/helper";
import { PROFILE_URL } from "../urls";
import { Button, Input, Text } from "react-native-elements";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ProfileSetup = ({ navigation, route, ...props }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [setupError, setSetupError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldsError, setFieldsError] = useState({
    fullname: "",
    first_name: "",
    city: "",
  });

  const data = route.params.data;
  const info = route.params.info;
  const [setupData, setSetupData] = useState({
    ...info,
    user_id: data.user.id,
  });
  console.log("data::", data);
  console.log("info:::", info);
  console.log("setupdata::", setupData);

  const onChangeSetup = (name, value) => {
    setSetupData({
      ...setupData,
      [name]: value,
    });
  };

  const checkInput = async () => {
    setFieldsError({
      fullname: "",
      first_name: "",
      bio: "",
    });
    if (!setupData.name) {
      setFieldsError({ fullname: "This field is required!" });
      return false;
    } else {
      if (!setupData.name.trim()) {
        setFieldsError({ fullname: "This field is required!" });
        return false;
      }
    }
    if (!setupData.first_name) {
      setFieldsError({ first_name: "This field is required!" });
      return false;
    } else {
      if (!setupData.first_name.trim()) {
        setFieldsError({ first_name: "This field is required!" });
        return false;
      }
    }

    if (!setupData.city) {
      setFieldsError({ city: "This field is required!" });
      return false;
    } else {
      if (!setupData.city.trim()) {
        setFieldsError({ city: "This field is required!" });
        return false;
      }
    }
    return true;
  };

  const setupProfile = async () => {
    const check_non_empty_input = await checkInput();
    if (!check_non_empty_input) return;

    setLoading(true);
    setSetupError(false);
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: PROFILE_URL,
      data: setupData,
      token,
    }).catch((e) => {
      console.log(e.response.data);
      setErrorMsg(e.response.data.error);
      setErrorMsg("An error occured. Try again!");
      setSetupError(true);
      setLoading(false);
    });

    if (result) {
      setLoading(false);
      console.log("res::", result.data);
      dispatch({ type: "ADD_USER_DETAIL", payload: result.data });
      navigation.replace("Home");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={150}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <View style={styles.inputContainer}>
        <Text h4 style={{ marginBottom: 50 }}>
          A LITTLE MORE INFO TO SETUP YOUR ACCOUNT!
        </Text>
        {setupError && (
          <Text style={{ marginBottom: 5, color: "red", fontWeight: "700" }}>
            {errorMsg}!!!
          </Text>
        )}
        <Input
          placeholder="Full Name"
          autoFocus
          value={setupData.fullname}
          type="text"
          inputContainerStyle={styles.bContainer}
          inputStyle={styles.TextInput}
          placeholderTextColor="black"
          onChangeText={(text) => onChangeSetup("name", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="black" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.fullname}
        />
        <Input
          placeholder="Firstname"
          value={setupData.firstname}
          type="text"
          inputContainerStyle={styles.bContainer}
          inputStyle={styles.TextInput}
          placeholderTextColor="black"
          onChangeText={(text) => onChangeSetup("first_name", text)}
          disabled={loading}
          leftIcon={<FontAwesome name="user" size={22} color="black" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.first_name}
        />

        <Input
          placeholder="City"
          value={setupData.city}
          type="text"
          inputContainerStyle={styles.bContainer}
          inputStyle={styles.TextInput}
          placeholderTextColor="black"
          onChangeText={(text) => onChangeSetup("city", text)}
          disabled={loading}
          leftIcon={<FontAwesome5 name="house-user" size={22} color="black" />}
          errorStyle={{ color: "red" }}
          errorMessage={fieldsError.city}
        />
      </View>

      <View>
        <Button
          title="CONTINUE"
          containerStyle={styles.button}
          onPress={setupProfile}
          loading={loading}
          type="clear"
          titleStyle={{
            color: "white",
            fontWeight: 700,
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },

  button: {
    width: 300,
    borderRadius: 25,
    marginTop: 40,
    backgroundColor: "rgb(251, 28, 67)",
  },

  bContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(251, 28, 67, 0.5)",
  },
  TextInput: {
    color: "black",
    fontSize: 13,
  },
});
