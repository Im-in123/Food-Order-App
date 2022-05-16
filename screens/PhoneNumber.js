import React, { useState, useRef } from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import PhoneInput from "react-native-phone-number-input";

export default function App({ navigation, route, ...props }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(true);
  const phoneInput = useRef(null);
  const data = route.params.data;

  const getPhoneNumber = () => {
    const info = {
      isvalid: phoneInput.current?.isValidNumber(phoneNumber),
      country_code: phoneInput.current.getCountryCode(),
      calling_code: phoneInput.current.getCallingCode(),
      phonenumber: phoneInput.current.props.defaultValue,
    };
    setValid(info.isvalid);
    console.log("info::", info);
    if (info.isvalid) {
      navigation.replace("ProfileSetup", {
        data: data,
        info: info,
      });
    }
  };

  return (
    <View style={styleSheet.MainContainer}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode="GH"
        layout="first"
        withShadow
        autoFocus
        containerStyle={styleSheet.phoneNumberView}
        textContainerStyle={{ paddingVertical: 0 }}
        onChangeFormattedText={(text) => {
          setPhoneNumber(text);
        }}
      />
      {!valid ? (
        <Text style={{ color: "black", marginTop: 20 }}>
          Enter a valid phone number!
        </Text>
      ) : null}
      <TouchableOpacity
        style={styleSheet.button}
        onPress={() => getPhoneNumber()}
      >
        <Text style={styleSheet.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "white",
  },

  phoneNumberView: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    width: "80%",
    padding: 8,
    backgroundColor: "#00B8D4",
  },

  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
});
