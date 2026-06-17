import { TouchableOpacityProps } from "react-native";

// Base props that are always required
interface BaseTabBarDuoProps {
    principalRoute: string;
    secondaryRoute: string;
    principalText: string;
    secondaryText: string;
    textColor: string;
    routePrefix: string; // Route prefix like "/(auth)" or "/(navigationBar)/(locations)"
    activeTab: string; // Add activeTab prop to make it controlled
    principalRequiresAuth?: boolean; // Optional: principal tab requires authentication
    secondaryRequiresAuth?: boolean; // Optional: secondary tab requires authentication
}

// Props with both titles provided
interface WithTitles extends BaseTabBarDuoProps {
    principalTitle: string;
    secondaryTitle: string;
}

// Props with no titles
interface WithoutTitles extends BaseTabBarDuoProps {
    principalTitle?: never;
    secondaryTitle?: never;
}

// Union type that enforces the constraint
export type TabBarDuoProps = WithTitles | WithoutTitles;

export interface ButtonProps extends TouchableOpacityProps {
    text: string | React.ReactNode;
    textStyle?: string;
}