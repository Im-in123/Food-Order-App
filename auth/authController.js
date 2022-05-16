import { axiosHandler, custom_temp_navigation } from "./helper.js";
import { REFRESH_URL, ME_URL } from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const tokenName = "FoodOrderTokenName";

export const logout = async (navigation) => {
  await AsyncStorage.removeItem(tokenName);
  navigation.replace("Login");
};

export const checkAuthState = async (dispatch, navigation) => {
  custom_temp_navigation(navigation);
  let token = await AsyncStorage.getItem(tokenName);

  if (!token) {
    logout(navigation);
    return;
  }
  token = JSON.parse(token);
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e, "error on getting userprofile");
    if (e.response) {
      console.log("e response.data:::", e.response.data);
    } else if (e.request) {
      console.log("e request:::", e.request);
    }
  });
  if (userProfile) {
    console.log("got userprofile");
    console.log(userProfile.data, "userprofiledata..");
    if (!userProfile.data.phonenumber || !userProfile.data.city) {
      navigation.replace("PhoneNumber", {
        data: userProfile.data,
      });
      return;
    } else {
      dispatch({ type: "ADD_USER_DETAIL", payload: userProfile.data });
      return;
    }
  }
  console.log("getting new access");
  if (!token.refresh) logout(navigation);
  const getNewAccess = await axiosHandler({
    method: "post",
    url: REFRESH_URL,
    data: {
      refresh: token.refresh,
    },
  }).catch((e) => {
    console.log(e, "error on getting new access");
    if (e.response) {
      console.log("e response.data2:::", e.response?.data);

      if (
        e.response.data?.error === "Token is invalid or has expired" ||
        e.response.data?.error === "refresh token not found"
      ) {
        logout(navigation);
      }
    } else if (e.request) {
      console.log("e request:::", e.request);
      console.log("sleeping...");
      setTimeout(async () => {
        await checkAuthState(dispatch, navigation);
      }, 7000);
    }
  });

  if (getNewAccess) {
    await AsyncStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));

    await checkAuthState(dispatch, navigation);
  }
};
