import React from "react";
import { ScrollView, FlatList, RefreshControl } from "react-native";
import { useRefresh } from "@/hooks/useRefresh";

interface RefreshableWrapperProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  component?: "ScrollView" | "FlatList";
  flatListProps?: any; // For FlatList specific props
  scrollViewProps?: any; // For ScrollView specific props
  refreshColor?: string;
}

export const RefreshableWrapper: React.FC<RefreshableWrapperProps> = ({
  onRefresh,
  children,
  component = "ScrollView",
  flatListProps = {},
  scrollViewProps = {},
  refreshColor = "#D38B5D",
}) => {
  const { refreshing, onRefresh: handleRefresh } = useRefresh({ onRefresh });

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={refreshColor}
      colors={[refreshColor]}
    />
  );

  if (component === "FlatList") {
    return (
      <FlatList {...flatListProps} refreshControl={refreshControl}>
        {children}
      </FlatList>
    );
  }

  return (
    <ScrollView {...scrollViewProps} refreshControl={refreshControl}>
      {children}
    </ScrollView>
  );
};

export default RefreshableWrapper;
