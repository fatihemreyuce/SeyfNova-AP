import { fetchClient } from "@/utils/fetch-client";
import type { ServiceRequest, ServiceResponse } from "@/types/service.types";
import type { Page } from "@/types/pagination";

export const createService = async (request: ServiceRequest): Promise<ServiceResponse> => {
    return await fetchClient<ServiceRequest, ServiceResponse>("/admin/services", {
        method: "POST",
        body: request,
    });
}

export const updateService = async (id: number, request: ServiceRequest): Promise<ServiceResponse> => {
    return await fetchClient<ServiceRequest, ServiceResponse>(`/admin/services/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deleteService = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/services/${id}`, {
        method: "DELETE",
    });
}

export const getServices = async (search: string, page: number, size: number, sort: string): Promise<Page<ServiceResponse>> => {
    return await fetchClient<void, Page<ServiceResponse>>(`/services?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getServiceById = async (id: number): Promise<ServiceResponse> => {
    return await fetchClient<void, ServiceResponse>(`/services/${id}`, {
        method: "GET",
    });
}