import { fetchClient } from "@/utils/fetch-client";
import type { TrackRequest, TrackResponse, dashboard ,active, topPages, dailyStats, conversion} from "@/types/analytics.types";
import type { Page } from "@/types/pagination";

export const createTrack = (request: TrackRequest , visitorId: string, sessionId: string): Promise<TrackResponse> => {
    return fetchClient<TrackRequest, TrackResponse>(`/analytics/track?visitorId=${visitorId}&sessionId=${sessionId}`, {
        method: "POST",
        body: request,
    });
}


export const getDashboard = (days: number): Promise<Page<dashboard>> => {
    return fetchClient<void, Page<dashboard>>(`/admin/analytics/dashboard?days=${days}`);
}

export const getActive = (): Promise<Page<active>> => {
    return fetchClient<void, Page<active>>("/admin/analytics/active");  
}

export const getTopPages = (days: number): Promise<Page<topPages>> => {
    return fetchClient<void, Page<topPages>>(`/admin/analytics/top-pages?days=${days}`);
}

export const getDailyStats = (days: number): Promise<Page<dailyStats>   > => {
    return fetchClient<void, Page<dailyStats>>(`/admin/analytics/daily-stats?days=${days}`);
}

export const getConversion = (days: number): Promise<Page<conversion>> => {
    return fetchClient<void, Page<conversion>>(`/admin/analytics/conversion?days=${days}`);
}