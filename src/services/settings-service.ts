import { fetchClient } from "@/utils/fetch-client";
import type { SettingsRequest, SettingsResponse } from "@/types/settings.types";
import type { Page } from "@/types/pagination";

export const getSettings = async (search: string, page: number, size: number, sort: string): Promise<Page<SettingsResponse>> => {
    return await fetchClient<void, Page<SettingsResponse>>(`/settings?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getSettingsById = async (id: number): Promise<SettingsResponse> => {
    return await fetchClient<void, SettingsResponse>(`/settings/${id}`, {
        method: "GET",
    });
}

export const updateSettings = async (id: number, request: SettingsRequest): Promise<SettingsResponse> => {
    return await fetchClient<SettingsRequest, SettingsResponse>(`/admin/settings/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}


export const deleteSettings =  (id: number): Promise<void> => {
    return  fetchClient<void, void>(`/admin/settings/${id}`, {
        method: "DELETE",
    });
}


export const createSettings =  (request: SettingsRequest): Promise<SettingsResponse> => {
    return  fetchClient<SettingsRequest, SettingsResponse>("/admin/settings", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}