import type { ContactRequest, ContactResponse } from "@/types/contact.types";
import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";

export const createContact = async (request: ContactRequest): Promise<ContactResponse> => {
    return await fetchClient<ContactRequest, ContactResponse>("/contact", {
        method: "POST",
        body: request,
    });
}

export const getContacts = async (page: number, size: number, sort: string): Promise<Page<ContactResponse>> => {
    return await fetchClient<void, Page<ContactResponse>>(`/admin/contact?page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const deleteContact = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/contact/${id}`, {
        method: "DELETE",
    });
}

export const getContactById = async (id: number): Promise<ContactResponse> => {
    return await fetchClient<void, ContactResponse>(`/admin/contact/${id}`, {
        method: "GET",
    });
}