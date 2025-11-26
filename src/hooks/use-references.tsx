import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReference, updateReference, deleteReference, getReferences, getReferenceById } from "@/services/references-service";
import type { ReferenceRequest } from "@/types/references.types";
import { toast } from "sonner";

export const useReferences = (search: string, page: number, size: number, sort: string) => {
	return useQuery({
		queryKey: ["references", search, page, size, sort],
		queryFn: () => getReferences(search, page, size, sort),
	});
};

export const useCreateReference = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: ReferenceRequest) => createReference(request),
		onSuccess: () => {
			toast.success("Reference created successfully");
			queryClient.invalidateQueries({ queryKey: ["references"] });
		},
		onError: () => {
			toast.error("Failed to create reference");
		},
	});
};

export const useUpdateReference = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, request }: { id: number; request: ReferenceRequest }) => updateReference(id, request),
		onSuccess: () => {
			toast.success("Reference updated successfully");
			queryClient.invalidateQueries({ queryKey: ["references"] });
		},
		onError: () => {
			toast.error("Failed to update reference");
		},
	});
};

export const useDeleteReference = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteReference(id),
		onSuccess: () => {
			toast.success("Reference deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["references"] });
		},
		onError: () => {
			toast.error("Failed to delete reference");
		},
	});
};

export const useGetReferenceById = (id: number) => {
	return useQuery({
		queryKey: ["references", id],
		queryFn: () => getReferenceById(id),
	});
};
