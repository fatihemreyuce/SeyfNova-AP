import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createServiceStats, updateServiceStats, deleteServiceStats, getServiceStats, getServiceStatsById } from "@/services/service-stats-service";
import type { ServiceStatsRequest} from "@/types/service.stats.types";
import { toast } from "sonner";

export const useServiceStats = (
    search:string,
    page:number,
    size:number,
    sort:string
) => {
    return useQuery({
        queryKey: ["service-stats", search, page, size, sort],
        queryFn: () => getServiceStats(search, page, size, sort),
    });
}

export const useCreateServiceStats = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ServiceStatsRequest) => createServiceStats(request),
        onSuccess: () => {
            toast.success("Service stats created successfully");
            queryClient.invalidateQueries({ queryKey: ["service-stats"] });
        },
        onError: () => {
            toast.error("Failed to create service stats");
        },
    });
}

export const useUpdateServiceStats = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ServiceStatsRequest }) => updateServiceStats(id, request),
        onSuccess: () => {
            toast.success("Service stats updated successfully");
            queryClient.invalidateQueries({ queryKey: ["service-stats"] });
        },
        onError: () => {
            toast.error("Failed to update service stats");
        },
    });
}

export const useDeleteServiceStats = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteServiceStats(id),
        onSuccess: () => {
            toast.success("Service stats deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["service-stats"] });
        },
        onError: () => {
            toast.error("Failed to delete service stats");
        },
    });
}

export const useGetServiceStatsById = (id: number) => {
    return useQuery({
        queryKey: ["service-stats", id],
        queryFn: () => getServiceStatsById(id),
    });
}