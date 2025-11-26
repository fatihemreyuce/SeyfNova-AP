import { fetchClient } from "@/utils/fetch-client";
import type { ServiceCategoryRequest, ServiceCategoryResponse } from "@/types/service.category.types";
import type { Page } from "@/types/pagination";

export const createServiceCategory = async (request: ServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
	return await fetchClient<ServiceCategoryRequest, ServiceCategoryResponse>("/admin/service-categories", {
		method: "POST",
		body: request,
	});
};

export const getServiceCategories = async (search: string, page: number, size: number, sort: string): Promise<Page<ServiceCategoryResponse>> => {
	return await fetchClient<void, Page<ServiceCategoryResponse>>(`/service-categories?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
		method: "GET",
	});
};

export const getServiceCategoryById = async (id: number): Promise<ServiceCategoryResponse> => {
	return await fetchClient<void, ServiceCategoryResponse>(`/service-categories/${id}`, {
		method: "GET",
	});
};

export const updateServiceCategory = async (id: number, request: ServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
	return await fetchClient<ServiceCategoryRequest, ServiceCategoryResponse>(`/admin/service-categories/${id}`, {
		method: "PUT",
		body: request,
	});
};

export const deleteServiceCategory = async (id: number): Promise<void> => {
	return await fetchClient<void, void>(`/admin/service-categories/${id}`, {
		method: "DELETE",
	});
};
