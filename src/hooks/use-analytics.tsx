import { useAuthQuery } from "./use-auth-query";
import { trackPageView, getActiveVisitors, getTopPages, getDashboard, getDailyStats, getConversion } from "@/services/analytics-service";
import type { TrackRequest } from "@/types/analytics.types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTrackPageView = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: TrackRequest) => trackPageView(request),
        onSuccess: () => {
            toast.success("Sayfa görüntüleme başarıyla izlendi");
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
        onError: () => {
            toast.error("Sayfa görüntüleme izlenirken hata oluştu");
        },
    });
}

export const useGetActiveVisitors = () => {
    return useAuthQuery({
        queryKey: ["active-visitors"],
        queryFn: () => getActiveVisitors(),
    });
}

export const useGetTopPages = () => {
    return useAuthQuery({
        queryKey: ["top-pages"],
        queryFn: () => getTopPages(),
    });
}

export const useGetDashboard = () => {
    return useAuthQuery({
        queryKey: ["dashboard"],
        queryFn: () => getDashboard(),
    });
}

export const useGetDailyStats = () => {
    return useAuthQuery({
        queryKey: ["daily-stats"],
        queryFn: () => getDailyStats(),
    });
}

export const useGetConversion = () => {
    return useAuthQuery({
        queryKey: ["conversion"],
        queryFn: () => getConversion(),
    });
}

