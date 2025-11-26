import { fetchClient } from "@/utils/fetch-client";
import type { FaqRequest, FaqResponse } from "@/types/faqs.types";
import type { Page } from "@/types/pagination";

export const createFaq = async (request: FaqRequest): Promise<FaqResponse> => {
    return await fetchClient<FaqRequest, FaqResponse>("/admin/faqs", {
        method: "POST",
        body: request,
    });
}

export const updateFaq = async (id: number, request: FaqRequest): Promise<FaqResponse> => {
    return await fetchClient<FaqRequest, FaqResponse>(`/admin/faqs/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deleteFaq = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/faqs/${id}`, {
        method: "DELETE",
    });
}

export const getFaqs = async (search: string, page: number, size: number, sort: string): Promise<Page<FaqResponse>> => {
    return await fetchClient<void, Page<FaqResponse>>(`/faqs?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getFaqById = async (id: number): Promise<FaqResponse> => {
    return await fetchClient<void, FaqResponse>(`/faqs/${id}`, {
        method: "GET",
    });
}