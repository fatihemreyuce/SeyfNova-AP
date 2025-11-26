import { fetchClient } from "@/utils/fetch-client";
import type { ReferenceRequest, ReferenceResponse } from "@/types/references.types";
import type { Page } from "@/types/pagination";

export const createReference = async (request: ReferenceRequest): Promise<ReferenceResponse> => {
    return await fetchClient<ReferenceRequest, ReferenceResponse>("/admin/references", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const getReferences = async (search: string, page: number, size: number, sort: string): Promise<Page<ReferenceResponse>> => {
    return await fetchClient<void, Page<ReferenceResponse>>(`/references?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getReferenceById = async (id: number): Promise<ReferenceResponse> => {
    return await fetchClient<void, ReferenceResponse>(`/references/${id}`, {
        method: "GET",
    });
}

export const updateReference = async (id: number, request: ReferenceRequest): Promise<ReferenceResponse> => {
    return await fetchClient<ReferenceRequest, ReferenceResponse>(`/admin/references/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteReference = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/references/${id}`, {
        method: "DELETE",
    });
}