export type offersCategory = {
    id: number;
    name: string;
    offerCount: number;
    createdAt: string;
    updatedAt: string;
};

export type offersItemCore = {
    id: number;
    name: string;
    image: string;
    startDate: string;
    endDate: string;
    location: {
        id: number;
        name: string;
        address: string;
        type: string;
    };

    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export interface offersItem extends offersItemCore {
    category: {
        id: number;
        name: string;
    };
    discount: number;
    description: string;
}



export interface OffersCore<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    status: number;
    data: T;
}

export type HomePageOffersResponseType = ApiResponse<offersItemCore[]>;
export type OfferDetailResponseType = ApiResponse<offersItem>;
export type OffersCategoriesResponseType = ApiResponse<offersCategory[]>;

export interface OffersState {
    offers: offersItemCore[];
    isLoading: boolean;
    error: string | null;
    offerDetail: offersItem | null;
    isLoadingDetail: boolean;
    errorDetail: string | null;
    offersCategories: offersCategory[];
    isLoadingCategories: boolean;
    errorCategories: string | null;
}

export interface OffersActions {
    fetchOffers: () => Promise<void>;
    clearOffers: () => void;
    fetchOfferById: (id: string) => Promise<void>;
    clearOfferDetail: () => void;
    fetchOffersCategories: () => Promise<void>;
    clearOffersCategories: () => void;
}

export interface OffersStore extends OffersState, OffersActions { }