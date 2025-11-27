import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUsefulInformation, deleteUsefulInformation, getUsefulInformation, getUsefulInformationById, updateUsefulInformation } from "@/services/useful-information-service";
import type { UsefulInformationRequest } from "@/types/useful.information.types";
import { toast } from "sonner";
import { useAuthQuery } from "./use-auth-query";

export const useUsefulInformation = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["useful-information", page, size, sort],
        queryFn: () => getUsefulInformation(page, size, sort),
    });
}

export const useCreateUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: UsefulInformationRequest) => createUsefulInformation(request),
        onSuccess: () => {
            toast.success("Useful information created successfully");
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
        },
        onError: () => {
            toast.error("Failed to create useful information");
        },
    });
}

export const useDeleteUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteUsefulInformation(id),
        onSuccess: () => {
            toast.success("Useful information deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
        },
        onError: () => {
            toast.error("Failed to delete useful information");
        },
    });
}

export const useUpdateUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: UsefulInformationRequest }) => updateUsefulInformation(id, request),
        onSuccess: () => {
            toast.success("Useful information updated successfully");
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
        },
        onError: () => {
            toast.error("Failed to update useful information");
        },
    });
}

export const useGetUsefulInformationById = (id: number) => {
    return useAuthQuery({
        queryKey: ["useful-information", id],
        queryFn: () => getUsefulInformationById(id),
    });
}