import { Middleware } from '@reduxjs/toolkit';
import { userAPI } from '../user/userAPI';

const CACHE_KEY = 'userProfileCache';
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

interface CachedData {
    data: any;
    timestamp: number;
}

/**
 * Middleware to cache user profile data in localStorage
 * Cache duration: 1 minute
 */
export const userProfileCacheMiddleware: Middleware = () => (next) => (action: any) => {
    // Check if this is a fulfilled getUserProfile query
    if (userAPI.endpoints.getUserProfile.matchFulfilled(action)) {
        const cacheData: CachedData = {
            data: action.payload,
            timestamp: Date.now(),
        };

        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Failed to cache user profile:', error);
        }
    }

    // Check if user logs out or profile is invalidated
    if (action.type === 'userAPI/invalidateTags' || action.type?.includes('logout')) {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (error) {
            console.error('Failed to clear user profile cache:', error);
        }
    }

    return next(action);
};

/**
 * Get cached user profile data if valid
 * @returns Cached data or null if expired/invalid
 */
export const getCachedUserProfile = (): any | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp }: CachedData = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid (within 1 minute)
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
    } catch (error) {
        console.error('Failed to read cached user profile:', error);
        return null;
    }
};

/**
 * Clear user profile cache
 */
export const clearUserProfileCache = (): void => {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.error('Failed to clear user profile cache:', error);
    }
};
