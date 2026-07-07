import { View, StyleSheet } from "react-native";
import {
  useLinkBuilder,
  Text,
  PlatformPressable,
} from "expo-router/react-navigation";
import { BottomTabBarProps } from "expo-router/js-tabs";

export function TabBarNav({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title || route.name
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Get the icon component from options
        const IconComponent = options.tabBarIcon;

        return (
          <PlatformPressable
            key={index}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <View
              style={[
                styles.innerContainer,
                isFocused && styles.focusedInnerContainer,
              ]}
            >
              {IconComponent && (
                <View style={styles.iconContainer}>
                  {IconComponent({
                    color: isFocused ? "#99621E" : "#999",
                    size: 24,
                    focused: isFocused,
                  })}
                </View>
              )}
              <Text style={[styles.tabLabel, isFocused && styles.focusedLabel]}>
                {label}
              </Text>
            </View>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    paddingBottom: 9,
    // paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingBottom: 8,
  },
  innerContainer: {
    alignItems: "center",
  },
  focusedInnerContainer: {
    backgroundColor: "#D38B5D14",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 9,
    color: "#492800B2",
    fontFamily: "poppins-regular",
  },
  focusedLabel: {
    color: "#492800",
    fontFamily: "poppins-medium",
  },
});
