import { useMemo } from "react";

export type Painting = {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  sortOrder?: number;
};

export type Artist = {
  nameAr: string;
  nameEn: string;
  specialty: string;
  photoUrl?: string;
  bio: string;
  instagram?: string;
  twitter?: string;
  email?: string;
};

const defaultPaintings: Painting[] = [];
const defaultArtist: Artist = {
  nameAr: "",
  nameEn: "",
  specialty: "",
  bio: "",
};

export function useListPaintings() {
  return useMemo(
    () => ({ data: defaultPaintings, isLoading: false, error: null }),
    []
  );
}

export function useCreatePainting() {
  return useMemo(
    () => ({ mutate: (_: { data: Partial<Painting> }, options?: any) => options?.onSuccess?.() }),
    []
  );
}

export function useUpdatePainting() {
  return useMemo(
    () => ({ mutate: (_: { id: number; data: Partial<Painting> }, options?: any) => options?.onSuccess?.() }),
    []
  );
}

export function useDeletePainting() {
  return useMemo(
    () => ({ mutate: (_: { id: number }, options?: any) => options?.onSuccess?.() }),
    []
  );
}

export function useGetArtist() {
  return useMemo(
    () => ({ data: defaultArtist, isLoading: false, error: null }),
    []
  );
}

export function useUpdateArtist() {
  return useMemo(
    () => ({ mutate: (_: { data: Partial<Artist> }, options?: any) => options?.onSuccess?.() }),
    []
  );
}

export function getListPaintingsQueryKey() {
  return ["paintings"] as const;
}

export function getGetArtistQueryKey() {
  return ["artist"] as const;
}
