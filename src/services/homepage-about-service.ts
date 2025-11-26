import { fetchClient } from "@/utils/fetch-client";
import type { Page } from "@/types/pagination";
import type { HomePageAboutResponse ,HomePageAboutRequest} from "@/types/homepage.about.types";

export const createHomePageAbout =  (request: HomePageAboutRequest): Promise<HomePageAboutResponse> => {
    return  fetchClient<HomePageAboutRequest, HomePageAboutResponse>("/admin/homepage-about", {
        method: "POST",
        body: request,
    });
}

export const updateHomePageAbout =  (id: number, request: HomePageAboutRequest): Promise<HomePageAboutResponse> => {
    return  fetchClient<HomePageAboutRequest, HomePageAboutResponse>(`/admin/homepage-about/${id}`, {
        method: "PUT",
        body: request,
    });
}

export const deleteHomePageAbout =  (id: number): Promise<void> => {
    return  fetchClient(`/admin/homepage-about/${id}`, {
        method: "DELETE",
    });
}

export const getHomePageAbout =  (search:string, page:number, size:number, sort:string): Promise<Page<HomePageAboutResponse>> => {
    return  fetchClient<void, Page<HomePageAboutResponse>>(`/homepage-about?search=${search}&page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getHomePageAboutById =  (id: number): Promise<HomePageAboutResponse> => {
    return  fetchClient<void, HomePageAboutResponse>(`/homepage-about/${id}`, {
        method: "GET",
    });
}