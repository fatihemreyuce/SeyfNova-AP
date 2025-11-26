import { fetchClient } from "@/utils/fetch-client";
import type { CircularRequest, CircularResponse } from "@/types/circulars.types";
import type { Page } from "@/types/pagination";

export const createCircular = async (request: CircularRequest): Promise<CircularResponse> => {
    return await fetchClient<CircularRequest, CircularResponse>("/admin/circulars", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const getCirculars = async (search: string, page: number, size: number, sort: string): Promise<Page<CircularResponse>> => {
    return await fetchClient<void, Page<CircularResponse>>(`/circulars?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getCircularById = async (id: number): Promise<CircularResponse> => {
    return await fetchClient<void, CircularResponse>(`/circulars/${id}`, {
        method: "GET",
    });
}

export const updateCircular = async (id: number, request: CircularRequest): Promise<CircularResponse> => {
    return await fetchClient<CircularRequest, CircularResponse>(`/admin/circulars/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteCircular = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/circulars/${id}`, {
        method: "DELETE",
    });
}
