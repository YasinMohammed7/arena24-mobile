import { View, Text } from "react-native";
import React, { useState, useCallback, useRef, useEffect } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { sliderProps } from "@/types/slider";
import CustomMarker from "./CustomMarker";

const Slider = ({
  min,
  max,
  rangeArr,
  um,
  value: controlledValue,
  onValueChange,
}: sliderProps) => {
  const [internalRange, setInternalRange] =
    useState<[number, number]>(rangeArr);
  const [displayRange, setDisplayRange] = useState<[number, number]>(
    controlledValue !== undefined ? controlledValue : rangeArr
  );

  // Debounce timer ref
  const debounceTimer = useRef<number | null>(null);

  // Update display range when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setDisplayRange(controlledValue);
    }
  }, [controlledValue]);

  // Debounced function to update the store
  const debouncedUpdate = useCallback(
    (newRange: [number, number]) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (controlledValue !== undefined && onValueChange) {
          onValueChange(newRange);
        } else {
          setInternalRange(newRange);
        }
      }, 150); // 150ms debounce
    },
    [controlledValue, onValueChange]
  );

  // Immediate handler for UI feedback
  const handleChange = useCallback(
    (values: number[]) => {
      const newRange: [number, number] = [values[0], values[1]];

      // Update display immediately for smooth UI
      setDisplayRange(newRange);

      // Debounce the actual state update
      debouncedUpdate(newRange);
    },
    [debouncedUpdate]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <View className="w-full px-4">
      <MultiSlider
        values={displayRange}
        min={min}
        max={max}
        step={5} // Increased step size for better performance
        sliderLength={300}
        onValuesChange={handleChange}
        selectedStyle={{ backgroundColor: "#D38B5D" }}
        unselectedStyle={{ backgroundColor: "#D38B5D36" }}
        trackStyle={{ height: 3, borderRadius: 2 }}
        customMarker={({ currentValue }) => (
          <CustomMarker currentValue={currentValue} um={um} />
        )}
        enabledOne={true}
        enabledTwo={true}
        allowOverlap={false}
        snapped={true}
      />
    </View>
  );
};

export default Slider;
