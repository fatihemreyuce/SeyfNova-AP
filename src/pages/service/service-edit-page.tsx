import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateService, useGetServiceById } from "@/hooks/use-service";
import type { ServiceRequest } from "@/types/service.types";
import { ArrowLeft, Save, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function ServiceEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateService();
	const { data, isLoading, error } = useGetServiceById(Number(id));

	const [categoryId, setCategoryId] = useState<number | "">("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	useEffect(() => {
		if (data) {
			setCategoryId(data.categoryId || "");
			setTitle(data.title || "");
			setDescription(data.description || "");
			setOrderIndex(data.orderIndex || "");
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service data");
			navigate("/service");
		}
	}, [error, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!id ||
			categoryId === "" ||
			!title.trim() ||
			!description.trim() ||
			orderIndex === "" ||
			Number(orderIndex) < 0 ||
			Number(categoryId) < 0
		) {
			return;
		}

		try {
			const request: ServiceRequest = {
				categoryId: Number(categoryId),
				title: title.trim(),
				description: description.trim(),
				orderIndex: Number(orderIndex),
			};
			await updateMutation.mutateAsync({
				id: Number(id),
				request,
			});
			navigate("/service");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/service");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">Loading service data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleCancel}
					className="h-9 w-9"
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
						Edit Service
					</h1>
					<p className="text-muted-foreground mt-1">
						Update service information
					</p>
				</div>
			</div>

			{/* Form Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<Briefcase className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Service Information</CardTitle>
							<CardDescription>
								Update the details of this service
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Category ID */}
						<div className="space-y-2">
							<Label htmlFor="categoryId">Category ID *</Label>
							<Input
								id="categoryId"
								type="number"
								min="0"
								placeholder="e.g., 1"
								value={categoryId}
								onChange={(e) => {
									const value = e.target.value;
									setCategoryId(value === "" ? "" : Number(value));
								}}
								required
								disabled={updateMutation.isPending}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Enter the category ID for this service
							</p>
						</div>

						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								placeholder="e.g., Web Development"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								disabled={updateMutation.isPending}
								className="h-11"
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description *</Label>
							<Textarea
								id="description"
								placeholder="Enter a detailed description..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								disabled={updateMutation.isPending}
								rows={6}
								className="resize-none"
							/>
						</div>

						{/* Order Index */}
						<div className="space-y-2">
							<Label htmlFor="orderIndex">Order Index *</Label>
							<Input
								id="orderIndex"
								type="number"
								min="0"
								placeholder="e.g., 1"
								value={orderIndex}
								onChange={(e) => {
									const value = e.target.value;
									setOrderIndex(value === "" ? "" : Number(value));
								}}
								required
								disabled={updateMutation.isPending}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Lower numbers appear first in the list
							</p>
						</div>

						{/* Form Actions */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={updateMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={updateMutation.isPending}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								{updateMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Update Service
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

