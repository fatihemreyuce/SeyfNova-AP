import { fetchClient } from "@/utils/fetch-client";
import type { UsefulInformationRequest, UsefulInformationResponse } from "@/types/useful.information.types";
import type { Page } from "@/types/pagination";

export const createUsefulInformation = async (request: UsefulInformationRequest): Promise<UsefulInformationResponse> => {
    return await fetchClient<UsefulInformationRequest, UsefulInformationResponse>("/admin/useful-information", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const getUsefulInformation = async (page: number, size: number, sort: string): Promise<Page<UsefulInformationResponse>> => {
    return await fetchClient<void, Page<UsefulInformationResponse>>(`/useful-information?page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const deleteUsefulInformation = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/useful-information/${id}`, {
        method: "DELETE",
    });
}

export const updateUsefulInformation = async (id: number, request: UsefulInformationRequest): Promise<UsefulInformationResponse> => {
    return await fetchClient<UsefulInformationRequest, UsefulInformationResponse>(`/admin/useful-information/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const getUsefulInformationById = async (id: number): Promise<UsefulInformationResponse> => {
    return await fetchClient<void, UsefulInformationResponse>(`/useful-information/${id}`, {
        method: "GET",
    });
}