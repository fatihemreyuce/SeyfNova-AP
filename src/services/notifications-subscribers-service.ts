import { fetchClient } from "@/utils/fetch-client";
import type { NotificationSubscriberRequest, NotificationSubscriberResponse } from "@/types/notifications.subscribers.types";
import type { Page } from "@/types/pagination";

export const createNotificationSubscriber = async (request: NotificationSubscriberRequest): Promise<NotificationSubscriberResponse> => {
    return await fetchClient<NotificationSubscriberRequest, NotificationSubscriberResponse>("/notification-subscribers", {
        method: "POST",
        body: request,
    });
}

export const getNotificationSubscribers = async (page: number, size: number, sort: string): Promise<Page<NotificationSubscriberResponse>> => {
    return await fetchClient<void, Page<NotificationSubscriberResponse>>(`/admin/notification-subscribers?page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const deleteNotificationSubscriber = async (id: number): Promise<void> => {
    return await fetchClient<void, void>(`/admin/notification-subscribers/${id}`, {
        method: "DELETE",
    });
}