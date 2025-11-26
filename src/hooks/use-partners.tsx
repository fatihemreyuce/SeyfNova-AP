import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartner, updatePartner, deletePartner, getPartners, getPartnerById } from "@/services/partners-service";
import type { PartnerRequest } from "@/types/partners.types";
import { toast } from "sonner";

export const usePartners = (search: string, page: number, size: number, sort: string) => {
    return useQuery({
        queryKey: ["partners", search, page, size, sort],
        queryFn: () => getPartners(search, page, size, sort),
    });
}

export const useCreatePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: PartnerRequest) => createPartner(request),
        onSuccess: () => {
            toast.success("Partner created successfully");
            queryClient.invalidateQueries({ queryKey: ["partners"] });
        },
        onError: () => {
            toast.error("Failed to create partner");
        },
    });
}

export const useUpdatePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: PartnerRequest }) => updatePartner(id, request),
        onSuccess: () => {
            toast.success("Partner updated successfully");
            queryClient.invalidateQueries({ queryKey: ["partners"] });
        },
        onError: () => {
            toast.error("Failed to update partner");
        },
    });
}

export const useDeletePartner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePartner(id),
        onSuccess: () => {
            toast.success("Partner deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["partners"] });
        },
        onError: () => {
            toast.error("Failed to delete partner");
        },
    });
}


export const useGetPartnerById = (id: number) => {
    return useQuery({
        queryKey: ["partner", id],
        queryFn: () => getPartnerById(id),
    });
}