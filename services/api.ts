import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base configuration  
const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL as string,
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT as string),
    headers: {
        'Content-Type': 'application/json',
        // Skip ngrok browser warning for development
        // 'ngrok-skip-browser-warning': 'true',
    },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Get auth token from AsyncStorage
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting access token:', error);
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('user');
            // Don't clear data for temporary AsyncStorage errors
            // Let the response interceptor handle authentication issues
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 || error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from AsyncStorage
                const refreshToken = await AsyncStorage.getItem('refreshToken');

                if (!refreshToken) {
                    console.log('No refresh token available, clear storage and reject');
                    // No refresh token available, clear storage and reject
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    await AsyncStorage.removeItem('user');
                    return Promise.reject(error);
                }

                // Make refresh token request directly
                const refreshResponse = await apiClient.post(
                    '/api/auth/refresh-token',
                    { refreshToken }
                );

                // Update stored tokens
                await AsyncStorage.setItem('accessToken', refreshResponse.data.access_token);
                if (refreshResponse.data.refresh_token) {
                    await AsyncStorage.setItem('refreshToken', refreshResponse.data.refresh_token);
                }

                // const user = await AsyncStorage.getItem('user');
                // console.log("test dan borascu", user)
                // Decode JWT token to extract user data
                // if (refreshResponse.data.access_token) {
                //     await decodeAndSaveUserData(refreshResponse.data.access_token);
                // }

                // Update the authorization header for the original request
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
                // console.log('refreshResponse.data.access_token', refreshResponse.data.access_token);
                // Token refresh completed successfully
                // Retry the original request with new token
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Refresh failed, clear storage
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                await AsyncStorage.removeItem('user');

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to decode JWT and save user data
// async function decodeAndSaveUserData(accessToken: string): Promise<void> {
//     try {
//         const tokenParts = accessToken.split('.');
//         if (tokenParts.length === 3) {
//             const payload = JSON.parse(atob(tokenParts[1]));
//             const userData = {
//                 id: payload.sub,
//                 email: payload.email,
//                 name: payload.email?.split('@')[0] || 'User',
//                 phone: payload.phone || '',
//                 imageUrl: payload.imageUrl || '',
//             };

//             const user = await apiClient.get(`/api/users/${userData.id}`);
//             userData.name = user.data.name;
//             userData.phone = user.data.phone;
//             userData.imageUrl = user.data.imageUrl;
//             await AsyncStorage.setItem('user', JSON.stringify(userData));
//             console.log('User data restored from JWT token during refresh');
//         }
//     } catch (decodeError) {
//         console.warn('Could not decode user data from token:', decodeError);
//     }
// }

export default apiClient;