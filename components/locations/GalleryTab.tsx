import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, { useState } from 'react';
import { LocationDetail } from '@/types/locations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/hooks/useLanguage';

const screenWidth = Dimensions.get('window').width;
const padding = 18;
const availableWidth = screenWidth - padding * 2;

export default function GalleryTab({
  location,
}: {
  location: LocationDetail | null;
}) {
  const { t } = useLanguage();
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleImageLoad = (id: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [id]: false }));
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageLoadStart = (id: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [id]: true }));
  };

  if (!location?.media || location.media.length === 0) {
    return (
      <SafeAreaView className='flex-1 bg-white pt-4' edges={['left', 'right']}>
        <View className='flex-1 justify-center items-center'>
          <Text className="text-gray-500 font-['poppins-regular'] text-base">
            {t('locations.noImagesAvailable')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderMasonryLayout = () => {
    const images = location.media.filter(
      (item) => item.type === 'gallery' && item.url && !imageErrors[item.id]
    );

    if (images.length === 0) return null;

    return (
      <SafeAreaView className='flex-1 bg-white pt-4' edges={['left', 'right']}>
        {/* First row - Full width image */}
        {images[0] && (
          <TouchableOpacity
            className='mb-2 rounded-[10px] overflow-hidden'
            activeOpacity={0.8}
          >
            <View className='relative'>
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[0].url}`,
                }}
                style={{ width: availableWidth, height: 168 }}
                resizeMode='cover'
                onLoadStart={() => handleImageLoadStart(images[0].id)}
                onLoad={() => handleImageLoad(images[0].id)}
                onError={() => handleImageError(images[0].id)}
              />
              {imageLoadingStates[images[0].id] && (
                <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                  <ActivityIndicator size='small' color='#99621E' />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Second row - Two images with different sizes */}
        {images.length > 1 && (
          <View className='flex-row mb-2' style={{ gap: 10 }}>
            {/* Large image on left */}
            {images[1] && (
              <TouchableOpacity
                className='rounded-[10px] overflow-hidden'
                style={{ width: (availableWidth - 10) * 0.57 }} // ~60% width
                activeOpacity={0.8}
              >
                <View className='relative'>
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[1].url}`,
                    }}
                    style={{ width: (availableWidth - 10) * 0.57, height: 168 }}
                    resizeMode='cover'
                    onLoadStart={() => handleImageLoadStart(images[1].id)}
                    onLoad={() => handleImageLoad(images[1].id)}
                    onError={() => handleImageError(images[1].id)}
                  />
                  {imageLoadingStates[images[1].id] && (
                    <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                      <ActivityIndicator size='small' color='#99621E' />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {/* Small image on right */}
            {images[2] && (
              <TouchableOpacity
                className='rounded-[10px] overflow-hidden'
                style={{ width: (availableWidth - 10) * 0.43 }} // ~40% width
                activeOpacity={0.8}
              >
                <View className='relative'>
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[2].url}`,
                    }}
                    style={{ width: (availableWidth - 10) * 0.43, height: 168 }}
                    resizeMode='cover'
                    onLoadStart={() => handleImageLoadStart(images[2].id)}
                    onLoad={() => handleImageLoad(images[2].id)}
                    onError={() => handleImageError(images[2].id)}
                  />
                  {imageLoadingStates[images[2].id] && (
                    <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                      <ActivityIndicator size='small' color='#99621E' />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Third row - Two images with swapped sizes */}
        {images.length > 3 && (
          <View className='flex-row mb-2' style={{ gap: 10 }}>
            {/* Small image on left */}
            {images[3] && (
              <TouchableOpacity
                className='rounded-[10px] overflow-hidden'
                style={{ width: (availableWidth - 10) * 0.4 }}
                activeOpacity={0.8}
              >
                <View className='relative'>
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[3].url}`,
                    }}
                    style={{ width: (availableWidth - 10) * 0.4, height: 168 }}
                    resizeMode='cover'
                    onLoadStart={() => handleImageLoadStart(images[3].id)}
                    onLoad={() => handleImageLoad(images[3].id)}
                    onError={() => handleImageError(images[3].id)}
                  />
                  {imageLoadingStates[images[3].id] && (
                    <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                      <ActivityIndicator size='small' color='#99621E' />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {/* Large image on right */}
            {images[4] && (
              <TouchableOpacity
                className='rounded-[10px] overflow-hidden'
                style={{ width: (availableWidth - 10) * 0.6 }}
                activeOpacity={0.8}
              >
                <View className='relative'>
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[4].url}`,
                    }}
                    style={{ width: (availableWidth - 10) * 0.6, height: 168 }}
                    resizeMode='cover'
                    onLoadStart={() => handleImageLoadStart(images[4].id)}
                    onLoad={() => handleImageLoad(images[4].id)}
                    onError={() => handleImageError(images[4].id)}
                  />
                  {imageLoadingStates[images[4].id] && (
                    <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                      <ActivityIndicator size='small' color='#99621E' />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Fourth row - Full width image */}
        {images[5] && (
          <TouchableOpacity
            className='mb-2 rounded-[10px] overflow-hidden'
            activeOpacity={0.8}
          >
            <View className='relative'>
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[5].url}`,
                }}
                style={{ width: availableWidth, height: 168 }}
                resizeMode='cover'
                onLoadStart={() => handleImageLoadStart(images[5].id)}
                onLoad={() => handleImageLoad(images[5].id)}
                onError={() => handleImageError(images[5].id)}
              />
              {imageLoadingStates[images[5].id] && (
                <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                  <ActivityIndicator size='small' color='#99621E' />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Fifth row - Two equal images */}
        {images.length > 6 && (
          <View className='flex-row mb-2' style={{ gap: 10 }}>
            {images[6] && (
              <TouchableOpacity
                className='rounded-[10px] overflow-hidden'
                style={{ width: (availableWidth - 10) / 2 }}
                activeOpacity={0.8}
              >
                <View className='relative'>
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[6].url}`,
                    }}
                    style={{ width: (availableWidth - 10) / 2, height: 168 }}
                    resizeMode='cover'
                    onLoadStart={() => handleImageLoadStart(images[6].id)}
                    onLoad={() => handleImageLoad(images[6].id)}
                    onError={() => handleImageError(images[6].id)}
                  />
                  {imageLoadingStates[images[6].id] && (
                    <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                      <ActivityIndicator size='small' color='#99621E' />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {images[7] && (
              <TouchableOpacity
                className='rounded-[10px] overflow-hidden'
                style={{ width: (availableWidth - 10) / 2 }}
                activeOpacity={0.8}
              >
                <View className='relative'>
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${images[7].url}`,
                    }}
                    style={{ width: (availableWidth - 10) / 2, height: 168 }}
                    resizeMode='cover'
                    onLoadStart={() => handleImageLoadStart(images[7].id)}
                    onLoad={() => handleImageLoad(images[7].id)}
                    onError={() => handleImageError(images[7].id)}
                  />
                  {imageLoadingStates[images[7].id] && (
                    <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                      <ActivityIndicator size='small' color='#99621E' />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Additional images in a simpler grid if there are more */}
        {images.length > 8 && (
          <View>
            {images.slice(8).map((image, index) => {
              if (index % 2 === 0) {
                const nextImage = images[8 + index + 1];
                return (
                  <View
                    key={`row-${index}`}
                    className='flex-row mb-2'
                    style={{ gap: 10 }}
                  >
                    <TouchableOpacity
                      className='rounded-[10px] overflow-hidden'
                      style={{ width: (availableWidth - 10) / 2 }}
                      activeOpacity={0.8}
                    >
                      <View className='relative'>
                        <Image
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${image.url}`,
                          }}
                          style={{
                            width: (availableWidth - 10) / 2,
                            height: 168,
                          }}
                          resizeMode='cover'
                          onLoadStart={() => handleImageLoadStart(image.id)}
                          onLoad={() => handleImageLoad(image.id)}
                          onError={() => handleImageError(image.id)}
                        />
                        {imageLoadingStates[image.id] && (
                          <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                            <ActivityIndicator size='small' color='#99621E' />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>

                    {nextImage && (
                      <TouchableOpacity
                        className='rounded-[10px] overflow-hidden'
                        style={{ width: (availableWidth - 10) / 2 }}
                        activeOpacity={0.8}
                      >
                        <View className='relative'>
                          <Image
                            source={{
                              uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${nextImage.url}`,
                            }}
                            style={{
                              width: (availableWidth - 10) / 2,
                              height: 168,
                            }}
                            resizeMode='cover'
                            onLoadStart={() =>
                              handleImageLoadStart(nextImage.id)
                            }
                            onLoad={() => handleImageLoad(nextImage.id)}
                            onError={() => handleImageError(nextImage.id)}
                          />
                          {imageLoadingStates[nextImage.id] && (
                            <View className='absolute inset-0 bg-gray-200 justify-center items-center'>
                              <ActivityIndicator size='small' color='#99621E' />
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }
              return null;
            })}
          </View>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        className='flex-1'
      >
        {renderMasonryLayout()}
      </ScrollView>
    </SafeAreaView>
  );
}
