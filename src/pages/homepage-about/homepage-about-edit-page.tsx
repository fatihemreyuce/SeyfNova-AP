import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateHomePageAbout, useGetHomePageAboutById } from "@/hooks/use-homapage-about";
import type { HomePageAboutRequest } from "@/types/homepage.about.types";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HomepageAboutEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateHomePageAbout();
	const { data, isLoading, error } = useGetHomePageAboutById(Number(id));

	const [formData, setFormData] = useState<HomePageAboutRequest>({
		leftTitle: "",
		leftDescription: "",
		rightTitle: "",
		rightDescription: "",
	});

	useEffect(() => {
		if (data) {
			setFormData({
				leftTitle: data.leftTitle || "",
				leftDescription: data.leftDescription || "",
				rightTitle: data.rightTitle || "",
				rightDescription: data.rightDescription || "",
			});
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load homepage about data");
			navigate("/homepage-about");
		}
	}, [error, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: formData,
			});
			navigate("/homepage-about");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/homepage-about");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<p className="text-muted-foreground">Homepage about not found</p>
					<Button onClick={handleCancel} className="mt-4">
						Go Back
					</Button>
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
						Edit Homepage About
					</h1>
					<p className="text-muted-foreground mt-1">
						Update homepage about content (ID: {id})
					</p>
				</div>
			</div>

			{/* Form */}
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle>Homepage About Information</CardTitle>
					<CardDescription>
						Update the details below to modify this homepage about entry
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Left Side */}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="leftTitle" className="text-sm font-medium">
										Left Title *
									</Label>
									<Input
										id="leftTitle"
										value={formData.leftTitle}
										onChange={(e) =>
											setFormData({ ...formData, leftTitle: e.target.value })
										}
										placeholder="Enter left title"
										required
										disabled={updateMutation.isPending}
										className="h-11"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="leftDescription" className="text-sm font-medium">
										Left Description *
									</Label>
									<Textarea
										id="leftDescription"
										value={formData.leftDescription}
										onChange={(e) =>
											setFormData({
												...formData,
												leftDescription: e.target.value,
											})
										}
										placeholder="Enter left description"
										rows={6}
										required
										disabled={updateMutation.isPending}
										className="resize-none"
									/>
								</div>
							</div>

							{/* Right Side */}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="rightTitle" className="text-sm font-medium">
										Right Title *
									</Label>
									<Input
										id="rightTitle"
										value={formData.rightTitle}
										onChange={(e) =>
											setFormData({ ...formData, rightTitle: e.target.value })
										}
										placeholder="Enter right title"
										required
										disabled={updateMutation.isPending}
										className="h-11"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="rightDescription" className="text-sm font-medium">
										Right Description *
									</Label>
									<Textarea
										id="rightDescription"
										value={formData.rightDescription}
										onChange={(e) =>
											setFormData({
												...formData,
												rightDescription: e.target.value,
											})
										}
										placeholder="Enter right description"
										rows={6}
										required
										disabled={updateMutation.isPending}
										className="resize-none"
									/>
								</div>
							</div>
						</div>

						{/* Actions */}
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
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Updating...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Update
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

