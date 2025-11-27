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
            toast.success("Hizmet başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            toast.error("Hizmet oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: ServiceRequest }) => updateService(id, request),
        onSuccess: () => {
            toast.success("Hizmet başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            toast.error("Hizmet güncellenirken hata oluştu");
        },
    });
}

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteService(id),
        onSuccess: () => {
            toast.success("Hizmet başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: () => {
            toast.error("Hizmet silinirken hata oluştu");
        },
    });
}

export const useGetServiceById = (id: number) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id),
    });
}