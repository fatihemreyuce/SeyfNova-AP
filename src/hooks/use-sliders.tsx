import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSlider, updateSlider, deleteSlider, getSliders, getSliderById } from "@/services/sliders-service";
import type { SliderRequest } from "@/types/sliders.types";
import { toast } from "sonner";

export const useSliders = (search: string, page: number, size: number, sort: string) => {
    return useQuery({
        queryKey: ["sliders", search, page, size, sort],
        queryFn: () => getSliders(search, page, size, sort),
    });
}

export const useCreateSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: SliderRequest) => createSlider(request),
        onSuccess: () => {
            toast.success("Slider başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["sliders"] });
        },
        onError: () => {
            toast.error("Slider oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: SliderRequest }) => updateSlider(id, request),
        onSuccess: () => {
            toast.success("Slider başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["sliders"] });
        },
        onError: () => {
            toast.error("Slider güncellenirken hata oluştu");
        },
    });
}

export const useDeleteSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteSlider(id),
        onSuccess: () => {
            toast.success("Slider başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["sliders"] });
        },
        onError: () => {
            toast.error("Slider silinirken hata oluştu");
        },
    });
}

export const useGetSliderById = (id: number) => {
    return useQuery({
        queryKey: ["slider", id],
        queryFn: () => getSliderById(id),
    });
}