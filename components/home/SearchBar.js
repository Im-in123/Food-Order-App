import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

let ref;
let go = true;
let skipsearch = true;
export default function SearchBar({ cityHandler }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (skipsearch === true) {
      setSearchResults([]);
      return;
    }
    getAutocompletePlace();
    return () => {};
  }, [query]);

  const getAutocompletePlace = async () => {
    // const algolia_url = `https://places-dsn.algolia.net/1/places/query?query=new&language=en`;
    let algolia_url = new URL("https://places-dsn.algolia.net/1/places/query");
    algolia_url.searchParams.append("query", query);
    // algolia_url.searchParams.append("type", "city");
    algolia_url.searchParams.append("language", "en");
    algolia_url.searchParams.append("hitsPerPage", 10);
    // algolia_url.searchParams.append("countries", ["us", "fr", "gh"]);
    console.log("algolia_url:::", algolia_url.toString());

    if (!go) return;
    go = false;
    clearTimeout(ref);
    ref = setTimeout(() => {
      const result = fetch(algolia_url.toString(), {
        method: "GET",
      })
        .then((res) => res.json())
        .then((json) => setSearchResults(json.hits))
        .catch((error) => {
          console.log("Error::", error);
        });
      go = true;
    }, 2000);
  };

  const parseNames = (data) => {
    console.log("item::", data);
    let local_name = data.locale_names[0];

    if (data.county) {
      if (data.county.length > 0) {
        local_name += ",  ";
      }
      for (let i = 0; i < data.county.length; i++) {
        if (i === data.county.length - 1) {
          local_name += data.county[i].toString();
        } else {
          local_name += data.county[i].toString();
          local_name += "/";
        }
      }
    }
    return local_name;
  };
  const parseName = (data) => {
    let local_name = data.locale_names[0];
    return local_name;
  };
  return (
    <View style={{ marginTop: 15, width: "100%" }}>
      <View
        style={{
          backgroundColor: "#eee",
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          marginRight: 10,
          width: "100%",
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <Ionicons name="location-sharp" size={24} />
        </View>
        <TextInput
          style={{
            backgroundColor: "#eee",
            borderRadius: 20,
            fontWeight: "700",
            margin: 7,
            marginTop: 9,
            width: "90%",
          }}
          placeholder="Search"
          value={query}
          onChangeText={(text) => setQuery(text)}
          onFocus={() => (skipsearch = false)}
        />
        <View
          style={{
            flexDirection: "row",
            marginRight: 8,
            backgroundColor: "white",
            padding: 9,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <AntDesign name="clockcircle" size={11} style={{ marginRight: 6 }} />
        </View>
      </View>
      {searchResults.length > 0 && (
        <View
          style={{
            flex: 0.7,
            backgroundColor: "#eee",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 4,
            padding: 5,
          }}
        >
          {searchResults.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                margin: 4,
                borderBottomColor: "whitesmoke",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setSearchResults([]);
                skipsearch = true;
                setQuery(parseName(item));
                cityHandler(parseName(item));
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  padding: 2,
                }}
              >
                {parseNames(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
