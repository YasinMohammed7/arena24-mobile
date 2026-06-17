import { Text } from "react-native";
import { FieldError } from "react-hook-form";

interface FormLabelProps {
  label: string;
  error?: FieldError;
  className?: string;
}

const FormLabel = ({ label, error, className = "" }: FormLabelProps) => {
  return (
    <Text
      className={`font-['DM Sans'] text-sm mb-2 ml-3 ${
        error ? "text-[#E50101]" : "text-black"
      } ${className}`}
    >
      {label}
    </Text>
  );
};

export default FormLabel;
