import { useState, useCallback } from 'react';

interface UseRefreshProps {
    onRefresh: () => Promise<void> | void;
}

export const useRefresh = ({ onRefresh }: UseRefreshProps) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [onRefresh]);

    return { refreshing, onRefresh: handleRefresh };
};
