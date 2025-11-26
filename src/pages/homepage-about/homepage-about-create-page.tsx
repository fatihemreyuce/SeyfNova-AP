import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateHomePageAbout } from "@/hooks/use-homapage-about";
import type { HomePageAboutRequest } from "@/types/homepage.about.types";
import { ArrowLeft, Save } from "lucide-react";

export default function HomepageAboutCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateHomePageAbout();

	const [formData, setFormData] = useState<HomePageAboutRequest>({
		leftTitle: "",
		leftDescription: "",
		rightTitle: "",
		rightDescription: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createMutation.mutateAsync(formData);
			navigate("/homepage-about");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/homepage-about");
	};

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
						Create Homepage About
					</h1>
					<p className="text-muted-foreground mt-1">
						Add new homepage about content
					</p>
				</div>
			</div>

			{/* Form */}
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle>Homepage About Information</CardTitle>
					<CardDescription>
						Fill in the details below to create a new homepage about entry
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
										disabled={createMutation.isPending}
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
										disabled={createMutation.isPending}
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
										disabled={createMutation.isPending}
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
										disabled={createMutation.isPending}
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
								disabled={createMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={createMutation.isPending}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								{createMutation.isPending ? (
									<>
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Creating...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Create
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

