import { fetchClient } from "@/utils/fetch-client";
import type { TrackRequest, TrackResponse, ActiveResponse, topPages, dashboard, dailyStats, conversion } from "@/types/analytics.types";
import type { Page } from "@/types/pagination";

export const trackPageView = async (request: TrackRequest): Promise<TrackResponse> => {
    return await fetchClient<TrackRequest, TrackResponse>("/analytics/track", {
        method: "POST",
        body: request,
    });
}

export const getActiveVisitors = async (): Promise<Page<ActiveResponse>> => {
    return await fetchClient<void, Page<ActiveResponse>>("/admin/analytics/active", {
        method: "GET",
    });
}

export const getTopPages = async (): Promise<Page<topPages>> => {
    return await fetchClient<void, Page<topPages>>("/admin/analytics/top-pages", {
        method: "GET",
    });
}

export const getDashboard = async (): Promise<Page<dashboard>> => {
    return await fetchClient<void, Page<dashboard>>("/admin/analytics/dashboard", {
        method: "GET",
    });
}

export const getDailyStats = async (): Promise<Page<dailyStats>> => {
    return await fetchClient<void, Page<dailyStats>>("/admin/analytics/daily-stats", {
        method: "GET",
    });
}

export const getConversion = async (): Promise<Page<conversion>> => {
    return await fetchClient<void, Page<conversion>>("/admin/analytics/conversion", {
        method: "GET",
    });
}

