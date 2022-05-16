import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({
  menuItemStyle: {
    flexDirection: "row",
    // justifyContent: "space-between",
    width: "90%",
  },

  titleStyle: {
    fontSize: 19,
    fontWeight: "600",
  },
});

export default function MenuItems({
  restaurantName,
  foods,
  hideCheckbox,
  marginLeft,
}) {
  const dispatch = useDispatch();

  const selectItem = (item, checkboxValue) =>
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...item,
        restaurantName: restaurantName,
        checkboxValue: checkboxValue,
      },
    });

  const cartItems = useSelector(
    (state) => state.cartReducer.selectedItems.items
  );

  const isFoodInCart = (food, cartItems) =>
    Boolean(cartItems.find((item) => item.title === food.title));

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {foods.map((food, index) => (
        <View key={index}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: 12,
            }}
          >
            {hideCheckbox ? (
              <></>
            ) : (
              <View
                styles={
                  {
                    // width: "10%",
                    // height: "100%",
                    // margin: 15,
                    // padding: 15,
                  }
                }
              >
                <BouncyCheckbox
                  iconStyle={{
                    borderColor: "lightgray",
                    borderRadius: 0,
                  }}
                  fillColor="green"
                  isChecked={isFoodInCart(food, cartItems)}
                  onPress={(checkboxValue) => selectItem(food, checkboxValue)}
                />
              </View>
            )}

            <View style={styles.menuItemStyle}>
              <FoodInfo food={food} />
              <FoodImage food={food} />
            </View>
          </View>
          <Divider
            width={0.5}
            orientation="vertical"
            style={{ marginHorizontal: 20 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const FoodInfo = (props) => (
  <View style={{ width: "50%", justifyContent: "space-evenly", margin: 3 }}>
    <Text style={styles.titleStyle}>{props.food.title}</Text>
    <Text>{props.food.description}</Text>
    <Text>{props.food.price}</Text>
  </View>
);

const FoodImage = ({ marginLeft, ...props }) => (
  <View style={{ width: "50%", marginLeft: 10, margin: 2 }}>
    <Image
      source={{ uri: props.food.image }}
      style={{
        maxWidth: 100,
        width: "80%",
        height: 100,
        borderRadius: 8,
      }}
    />
  </View>
);
