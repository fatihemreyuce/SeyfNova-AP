import { useAuthQuery } from "./use-auth-query";
import {
	createTrack,
	getDashboard,
	getActive,
	getTopPages,
	getDailyStats,
	getConversion,
} from "@/services/analytics-service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TrackRequest } from "@/types/analytics.types";

export const useCreateTrack = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ request, visitorId, sessionId }: { request: TrackRequest; visitorId: string; sessionId: string }) =>
			createTrack(request, visitorId, sessionId),
		onSuccess: () => {
			toast.success("Track başarıyla oluşturuldu");
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["active-visitors"] });
			queryClient.invalidateQueries({ queryKey: ["top-pages"] });
			queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
			queryClient.invalidateQueries({ queryKey: ["conversion"] });
		},
	});
};

export const useGetDashboard = (days: number = 7) => {
	return useAuthQuery({
		queryKey: ["dashboard", days],
		queryFn: () => getDashboard(days),
	});
};

export const useGetActive = () => {
	return useAuthQuery({
		queryKey: ["active-visitors"],
		queryFn: () => getActive(),
	});
};

export const useGetTopPages = (days: number = 7) => {
	return useAuthQuery({
		queryKey: ["top-pages", days],
		queryFn: () => getTopPages(days),
	});
};

export const useGetDailyStats = (days: number = 7) => {
	return useAuthQuery({
		queryKey: ["daily-stats", days],
		queryFn: () => getDailyStats(days),
	});
};

export const useGetConversion = (days: number = 7) => {
	return useAuthQuery({
		queryKey: ["conversion", days],
		queryFn: () => getConversion(days),
	});
};