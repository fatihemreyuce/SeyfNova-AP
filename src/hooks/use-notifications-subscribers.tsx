import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotificationSubscriber, deleteNotificationSubscriber, getNotificationSubscribers } from "@/services/notifications-subscribers-service";
import type { NotificationSubscriberRequest } from "@/types/notifications.subscribers.types";
import { toast } from "sonner";
import { useAuthQuery } from "./use-auth-query";

export const useNotificationSubscribers = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["notifications-subscribers", page, size, sort],
        queryFn: () => getNotificationSubscribers(page, size, sort),
    });
}

export const useCreateNotificationSubscriber = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: NotificationSubscriberRequest) => createNotificationSubscriber(request),
        onSuccess: () => {
            toast.success("Bildirim abonesi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["notifications-subscribers"] });
        },
        onError: () => {
            toast.error("Bildirim abonesi oluşturulurken hata oluştu");
        },
    });
}

export const useDeleteNotificationSubscriber = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteNotificationSubscriber(id),
        onSuccess: () => {
            toast.success("Bildirim abonesi başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["notifications-subscribers"] });
        },
        onError: () => {
            toast.error("Bildirim abonesi silinirken hata oluştu");
        },
    });
}