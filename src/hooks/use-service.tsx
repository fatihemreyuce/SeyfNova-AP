import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createService, updateService, deleteService, getServices, getServiceById } from "@/services/service-service";
import type { ServiceRequest} from "@/types/service.types";
import { toast } from "sonner";

export const useServices = (search: string, page: number, size: number, sort: string) => {
    return useQuery({
        queryKey: ["services", search, page, size, sort],
        queryFn: () => getServices(search, page, size, sort),
    });
}

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ServiceRequest) => createService(request),
        onSuccess: () => {
            toast.success("Service created successfully");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            toast.error("Failed to create service");
        },
    });
}

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ServiceRequest }) => updateService(id, request),
        onSuccess: () => {
            toast.success("Service updated successfully");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            toast.error("Failed to update service");
        },
    });
}

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteService(id),
        onSuccess: () => {
            toast.success("Service deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            toast.error("Failed to delete service");
        },
    });
}

export const useGetServiceById = (id: number) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id),
    });
}