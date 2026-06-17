import { Animated, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { MessageCodeFieldProps } from "@/types/auth";

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 4;
const CELL_SIZE = 55;
const CELL_BORDER_RADIUS = 8;
const DEFAULT_CELL_BG_COLOR = "#fff";
const NOT_EMPTY_CELL_BG_COLOR = "#000000";
const ACTIVE_CELL_BG_COLOR = "#f7fafe";

const animateCell = ({
  hasValue,
  index,
  isFocused,
  animationsColor,
  animationsScale,
}: {
  hasValue: boolean;
  index: number;
  isFocused: boolean;
  animationsColor: Animated.Value[];
  animationsScale: Animated.Value[];
}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
    }),
  ]).start();
};

// Custom hook to handle cell animations - moved outside component
const useCellAnimation = (
  symbol: string,
  isFocused: boolean,
  index: number,
  animationsColor: Animated.Value[],
  animationsScale: Animated.Value[]
) => {
  useEffect(() => {
    const hasValue = Boolean(symbol);
    animateCell({
      hasValue,
      index,
      isFocused,
      animationsColor,
      animationsScale,
    });
  }, [symbol, isFocused, index, animationsColor, animationsScale]);
};

export default function MessageCodeField({
  value: propValue,
  onChangeText,
  error,
  autoFocus = false,
}: MessageCodeFieldProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = propValue !== undefined ? propValue : internalValue;
  const setValue = onChangeText || setInternalValue;

  // Create independent animation arrays for each component instance
  const animationsColor = useRef(
    [...new Array(CELL_COUNT)].map(() => new Value(0))
  ).current;
  const animationsScale = useRef(
    [...new Array(CELL_COUNT)].map(() => new Value(1))
  ).current;

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number;
    symbol: string;
    isFocused: boolean;
  }) => {
    // Use the custom hook to handle animations
    useCellAnimation(
      symbol,
      isFocused,
      index,
      animationsColor,
      animationsScale
    );

    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    return (
      <AnimatedText
        key={index}
        style={[
          {
            marginHorizontal: 8,
            height: CELL_SIZE,
            width: CELL_SIZE,
            lineHeight: CELL_SIZE - 5,
            fontSize: 30,
            textAlign: "center",
            borderRadius: CELL_BORDER_RADIUS,
            color: "#000000",
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          },
          animatedCellStyle,
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <View>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        rootStyle={{
          height: CELL_SIZE,
          marginTop: 10,
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
        renderCell={renderCell}
      />
      {error && (
        <Text className="text-red-500 text-sm text-center mt-2">{error}</Text>
      )}
    </View>
  );
}
