import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";

const Header = ({
  title,
  description,
  paddingTop,
  imgSrc,
  paddingX,
  descriptionStyle,
  onDescriptionPress,
}: {
  title: string;
  description?: string;
  paddingTop?: string;
  paddingX?: string;
  imgSrc?: string;
  descriptionStyle?: string;
  onDescriptionPress?: () => void;
}) => {
  return (
    <View className={`pb-5 ${paddingX} ${paddingTop}`}>
      <View className="flex-row justify-between items-start">
        <View className="items-start flex-1">
          <Text className="font-['poppins-regular'] text-xl font-light text-[#492800]">
            {title}
          </Text>
          {onDescriptionPress ? (
            <TouchableOpacity onPress={onDescriptionPress}>
              <Text
                className={
                  descriptionStyle
                    ? descriptionStyle
                    : "font-['poppins-regular'] text-sm font-light text-[#492800] opacity-70"
                }
              >
                {description}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              className={
                descriptionStyle
                  ? descriptionStyle
                  : "font-['poppins-regular'] text-sm font-light text-[#492800] opacity-70"
              }
            >
              {description}
            </Text>
          )}
        </View>
        {imgSrc && (
          <View className="w-12 h-12 rounded-full overflow-hidden border border-[#D38B5D]">
            <Image
              source={{
                uri: (process.env.EXPO_PUBLIC_API_BASE_URL ?? "") + imgSrc,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;
