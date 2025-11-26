import { fetchClient } from "@/utils/fetch-client";
import type { SliderRequest, SliderResponse } from "@/types/sliders.types";
import type { Page } from "@/types/pagination";

export const createSlider = async (request: SliderRequest): Promise<SliderResponse> => {
    return await fetchClient<SliderRequest, SliderResponse>("/admin/sliders", {
        method: "POST",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const updateSlider = async (id: number, request: SliderRequest): Promise<SliderResponse> => {
    return await fetchClient<SliderRequest, SliderResponse>(`/admin/sliders/${id}`, {
        method: "PUT",
        body: request,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const deleteSlider = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/sliders/${id}`, {
        method: "DELETE",
    });
}

export const getSliders = async (search: string, page: number, size: number, sort: string): Promise<Page<SliderResponse>> => {
    return await fetchClient<void, Page<SliderResponse>>(`/sliders?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getSliderById = async (id: number): Promise<SliderResponse> => {
    return await fetchClient<void, SliderResponse>(`/sliders/${id}`, {
        method: "GET",
    });
}