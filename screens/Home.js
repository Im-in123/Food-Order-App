import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import { checkAuthState } from "../auth/authController";
import BottomTabs from "../components/home/BottomTabs";
import Categories from "../components/home/Categories";
import HeaderTabs from "../components/home/HeaderTabs";
import RestaurantItems, {
  localRestaurants,
} from "../components/home/RestaurantItems";
import SearchBar from "../components/home/SearchBar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RESTAURANT_API_URL } from "../urls";

export default function Home({ navigation }) {
  const [restaurantData, setRestaurantData] = useState(localRestaurants);
  const [city, setCity] = useState("");
  const [activeTab, setActiveTab] = useState("Delivery");
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.userReducer.userDetail);
  console.log("userdetail on homepage::", userDetail);

  const getRestaurantFromApi = () => {
    const url = `${RESTAURANT_API_URL}?location=${city}`;
    console.log("url:::", url);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log("data::", res.results);
        let filtered = [];
        for (let i in res.results) {
          let t = res.results[i];
          let transac = t.transactions;
          for (let e in transac) {
            let type = transac[e].type;
            if (type.toLowerCase() === activeTab.toLowerCase()) {
              filtered = [...filtered, t];
            }
          }
        }
        console.log("Filtered Data", filtered);
        setRestaurantData(filtered);
      })
      .catch((e) => {
        console.log("Error in restaurant data::::", e);
      });
  };

  useEffect(() => {
    (async () => {
      await checkAuthState(dispatch, navigation);
    })();
    return () => {};
  }, []);

  useEffect(() => {
    getRestaurantFromApi();
    return () => {};
  }, [city, activeTab]);

  return (
    <SafeAreaView style={{ backgroundColor: "#eee", flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          padding: 15,
          position: "absolute",
          zIndex: 7,
          left: 0,
          right: 0,
        }}
      >
        <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SearchBar cityHandler={setCity} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 100 }}
      >
        <Categories />
        <RestaurantItems
          restaurantData={restaurantData}
          navigation={navigation}
        />
      </ScrollView>
      <Divider width={1} />
      <BottomTabs />
    </SafeAreaView>
  );
}
