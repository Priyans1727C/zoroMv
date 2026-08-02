// hooks/useContinueWatching.js

import { useCallback } from "react";

const STORAGE_KEY = "continue_watching";
const MAX_ITEMS = 50;

export default function useContinueWatching() {
    const getStorage = useCallback(() => {
        if (typeof window === "undefined") return {};

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return {};
        }
    }, []);

    const saveStorage = useCallback((storage) => {
        const entries = Object.entries(storage)
            .sort(([, a], [, b]) => b.lastWatched - a.lastWatched)
            .slice(0, MAX_ITEMS);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(Object.fromEntries(entries))
        );
    }, []);

    const save = useCallback(
        (item) => {
            const storage = getStorage();

            const key = `${item.mediaType}-${item.id}`;

            storage[key] = {
                ...storage[key],
                ...item,
                lastWatched: Date.now(),
            };

            saveStorage(storage);
        },
        [getStorage, saveStorage]
    );

    const remove = useCallback(
        (id, mediaType) => {
            const storage = getStorage();

            delete storage[`${mediaType}-${id}`];

            saveStorage(storage);
        },
        [getStorage, saveStorage]
    );

    const clear = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const getAll = useCallback(() => {
        return getStorage();
    }, [getStorage]);

    const getSorted = useCallback(() => {
        return Object.values(getStorage()).sort(
            (a, b) => b.lastWatched - a.lastWatched
        );
    }, [getStorage]);

    const getById = useCallback(
        (id, mediaType) => {
            return getStorage()[`${mediaType}-${id}`] ?? null;
        },
        [getStorage]
    );

    return {
        save,
        remove,
        clear,
        getAll,
        getSorted,
        getById,
    };
}