import { fetchClient } from "@/utils/fetch-client";
import type { PartnerRequest, PartnerResponse } from "@/types/partners.types";
import type { Page } from "@/types/pagination";


export const createPartner = async (
	request: PartnerRequest,
): Promise<PartnerResponse> => {
	return await fetchClient<PartnerRequest, PartnerResponse>("/admin/partners", {
		method: "POST",
		body: request,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};


export const updatePartner = async (
	id: number,
	request: PartnerRequest,
): Promise<PartnerResponse> => {
	return await fetchClient<PartnerRequest, PartnerResponse>(
		`/admin/partners/${id}`,
		{
			method: "PUT",
			body: request,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);
};


export const deletePartner = async (id: number): Promise<void> => {
	return await fetchClient<void, void>(`/admin/partners/${id}`, {
		method: "DELETE",
	});
};


export const getPartners = async (
	search: string,
	page: number,
	size: number,
	sort: string,
): Promise<Page<PartnerResponse>> => {
	return await fetchClient<void, Page<PartnerResponse>>(
		`/partners?search=${search}&page=${page}&size=${size}&sort=${sort}`,
		{
			method: "GET",
		},
	);
};


export const getPartnerById = async (id: number): Promise<PartnerResponse> => {
	return await fetchClient<void, PartnerResponse>(`/partners/${id}`, {
		method: "GET",
	});
};


