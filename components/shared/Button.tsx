import { Text, TouchableOpacity } from "react-native";
import { ButtonProps } from "@/types/sharedComponents";

export default function Button({ text, textStyle, ...props }: ButtonProps) {
  return (
    <TouchableOpacity {...props}>
      <Text
        className={
          textStyle
            ? textStyle
            : "font-['DM Sans'] text-sm font-semibold text-white"
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
