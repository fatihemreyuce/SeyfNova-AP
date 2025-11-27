import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCircular, updateCircular, deleteCircular, getCirculars, getCircularById } from "@/services/circulars-service";
import type { CircularRequest } from "@/types/circulars.types";
import { toast } from "sonner";

export const useCirculars = (search: string, page: number, size: number, sort: string) => {
	return useQuery({
		queryKey: ["circulars", search, page, size, sort],
		queryFn: () => getCirculars(search, page, size, sort),
	});
};

export const useCreateCircular = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: CircularRequest) => createCircular(request),
		onSuccess: () => {
			toast.success("Genelge başarıyla oluşturuldu");
			queryClient.invalidateQueries({ queryKey: ["circulars"] });
		},
		onError: () => {
			toast.error("Genelge oluşturulurken hata oluştu");
		},
	});
};

export const useUpdateCircular = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, request }: { id: number; request: CircularRequest }) => updateCircular(id, request),
		onSuccess: () => {
			toast.success("Genelge başarıyla güncellendi");
			queryClient.invalidateQueries({ queryKey: ["circulars"] });
		},
		onError: () => {
			toast.error("Genelge güncellenirken hata oluştu");
		},
	});
};

export const useDeleteCircular = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteCircular(id),
		onSuccess: () => {
			toast.success("Genelge başarıyla silindi");
			queryClient.invalidateQueries({ queryKey: ["circulars"] });
		},
		onError: () => {
			toast.error("Genelge silinirken hata oluştu");
		},
	});
};

export const useGetCircularById = (id: number) => {
	return useQuery({
		queryKey: ["circulars", id],
		queryFn: () => getCircularById(id),
	});
};

