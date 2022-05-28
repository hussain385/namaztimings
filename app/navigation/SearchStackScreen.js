import Search from "../views/search/Search";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const SearchStack = createStackNavigator();

const SearchStackScreen = () => (
  <SearchStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Find Masjid">
    <SearchStack.Screen
      name="Find Masjid"
      component={Search}
      options={{
        title: 'Prayer Time',
      }}
    />
  </SearchStack.Navigator>
);

export default SearchStackScreen;
