import type { OfficalPageRequest, OfficalPageResponse } from "@/types/offical.page.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const getOfficalPage = async (): Promise<Page<OfficalPageResponse>> => {
    return await fetchClient<void, Page<OfficalPageResponse>>("/official-page", {
        method: "GET",
    });
}

export const updateOfficalPage = async (request: OfficalPageRequest): Promise<OfficalPageResponse> => {
    return await fetchClient<OfficalPageRequest, OfficalPageResponse>("/admin/official-page", {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteOfficalPage = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/official-page/${id}`, {
        method: "DELETE",
    });
}