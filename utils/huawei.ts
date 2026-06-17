import * as Device from 'expo-device';

export const isHuaweiDevice = (): boolean => {
    return Device.brand?.toLowerCase() === 'huawei' ||
        Device.manufacturer?.toLowerCase() === 'huawei' ||
        Device.brand?.toLowerCase() === 'honor' ||
        Device.manufacturer?.toLowerCase() === 'honor';
};

export const getDeviceInfo = () => {
    return {
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
    };
};