
import "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

import WordsNavigation from "./WordsNavigation";
import LearningNavigation from "./LearningNavigation";
import Settings from "../screens/Settings";

import { wordsLearningActions } from "../store/wordsLearningSlice";
import { themeActions } from "../store/themeSlice";
import * as dbUtils from "../store/dbUtils";

import { REFRESH_STATUSES_SPAN } from "../constants";

const Tab = createBottomTabNavigator();

function MainNavigator() {
  const dispatch = useDispatch();

  const colors = useSelector((state) => state.theme.colors);
  const isDark = useSelector((state) => state.theme.isDark);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSavedData = async () => {
      try {
        await dbUtils.init();

        const [savedWords, savedTheme] = await Promise.all([
          dbUtils.getWords(),
          dbUtils.getTheme(),
        ]);

        if (!isMounted) {
          return;
        }

        dispatch(
          wordsLearningActions.setInitial(
            Array.isArray(savedWords) ? savedWords : []
          )
        );

        dispatch(themeActions.setInitial(Boolean(savedTheme)));
      } catch {
        // Якщо локальна база недоступна, дозволяємо застосунку
        // відобразити інтерфейс із початковим станом.
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    loadSavedData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) {
      return undefined;
    }

    const interval = setInterval(() => {
      dispatch(wordsLearningActions.updateStatuses());
    }, REFRESH_STATUSES_SPAN);

    return () => clearInterval(interval);
  }, [dispatch, isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar
        backgroundColor={colors.appBackground}
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarHideOnKeyboard: true,
            headerTitleStyle: {
              fontWeight: "800",
            },
            tabBarActiveTintColor: colors.primary900,
            tabBarActiveBackgroundColor: colors.appBackground,
            tabBarInactiveBackgroundColor: colors.appBackground,
            headerStyle: {
              backgroundColor: colors.appBackground,
            },
            headerTintColor: colors.primary900,
            headerTitleAlign: "center",
          }}
        >
          <Tab.Screen
            name="Words"
            component={WordsNavigation}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="list-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Learning"
            component={LearningNavigation}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="book-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="settings-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default MainNavigator;
