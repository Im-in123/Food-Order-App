// import React from "react";
// import { View, Text, TextInput } from "react-native";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import AntDesign from "react-native-vector-icons/AntDesign";

// export default function SearchBar({ cityHandler }) {
//   return (
//     <View style={{ marginTop: 15, flexDirection: "row" }}>
//       <TextInput
//        onPress={(data, details = null) => {
//         console.log(data.description);
//         const city = data.description.split(",")[0];
//         cityHandler(city);
//       }}
//       />
//       <GooglePlacesAutocomplete
//         query={{ key: "AIzaSyATiAqIXBARofRD2apZcPQ1eEWZPH4fPV4" }}
//         onPress={(data, details = null) => {
//           console.log(data.description);
//           const city = data.description.split(",")[0];
//           cityHandler(city);
//         }}
//         placeholder="Search"
//         styles={{
//           textInput: {
//             backgroundColor: "#eee",
//             borderRadius: 20,
//             fontWeight: "700",
//             marginTop: 7,
//           },
//           textInputContainer: {
//             backgroundColor: "#eee",
//             borderRadius: 50,
//             flexDirection: "row",
//             alignItems: "center",
//             marginRight: 10,
//           },
//         }}
//         renderLeftButton={() => (
//           <View style={{ marginLeft: 10 }}>
//             <Ionicons name="location-sharp" size={24} />
//           </View>
//         )}
//         renderRightButton={() => (
//           <View
//             style={{
//               flexDirection: "row",
//               marginRight: 8,
//               backgroundColor: "white",
//               padding: 9,
//               borderRadius: 30,
//               alignItems: "center",
//             }}
//           >
//             <AntDesign
//               name="clockcircle"
//               size={11}
//               style={{ marginRight: 6 }}
//             />
//             <Text>Search</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const apiOptions = {
//     headers: {
//       Authorization: `Bearer ${YELP_API_KEY}`,
//     },
//     method: "POST",
//     // method: "POST",
//     // headers: { "Content-Type": "application/json" },
//     // body: JSON.stringify(data),
//   }
//
// const result = fetch(algolia_url.toString(), apiOptions)
//     .then((res) => res.json())
//     .then((json) => setSearchResults(json.hits))
//     .catch((error) => {
//       console.log("Error::", error);
//     });
