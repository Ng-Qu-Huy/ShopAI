import { create } from 'zustand';

// Type sản phẩm yêu thích (dùng chung với CartStore)
export type FavoriteProduct = {
    id: number;
    name: string;
    price: string | number;
    rawPrice: number;
    image: any;
    rating?: number;
    sold?: number;
};

interface FavoritesState {
    favorites: FavoriteProduct[];
    addFavorite: (product: FavoriteProduct) => void;
    removeFavorite: (id: number) => void;
    toggleFavorite: (product: FavoriteProduct) => void;
    isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: [],

    addFavorite: (product) => set((state) => {
        // Nếu đã có rồi thì không thêm nữa
        const alreadyExists = state.favorites.some(f => f.id === product.id);
        if (alreadyExists) return state;
        return { favorites: [...state.favorites, product] };
    }),

    removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== id),
    })),

    toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.some(f => f.id === product.id);
        if (exists) {
            get().removeFavorite(product.id);
        } else {
            get().addFavorite(product);
        }
    },

    isFavorite: (id) => get().favorites.some(f => f.id === id),
}));
