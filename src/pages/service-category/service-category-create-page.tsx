import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCreateServiceCategory } from "@/hooks/use-service-category";
import { ArrowLeft, FolderTree, Loader2, Save } from "lucide-react";

export default function ServiceCategoryCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateServiceCategory();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	const isSubmitting = createMutation.isPending;
	const isFormValid =
		name.trim() !== "" && description.trim() !== "" && orderIndex !== "" && Number(orderIndex) >= 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isFormValid) return;

		try {
			await createMutation.mutateAsync({
				name: name.trim(),
				description: description.trim(),
				orderIndex: Number(orderIndex),
			});
			navigate("/service-category");
		} catch {
			// handled in mutation
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/service-category")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<FolderTree className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Create Service Category
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								Add a new service category
							</p>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-6 pt-8 px-8">
							<CardTitle className="text-2xl font-semibold mb-2">
								Service Category Details
							</CardTitle>
							<CardDescription className="text-base">
								Fill in the fields below to create a new service category
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Name */}
							<div className="space-y-3">
								<Label
									htmlFor="name"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Name</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="name"
									placeholder="e.g., Web Development"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Description */}
							<div className="space-y-3">
								<Label
									htmlFor="description"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Description</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="description"
									placeholder="Provide a clear description of the service category..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[120px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Order Index */}
							<div className="space-y-3">
								<Label
									htmlFor="orderIndex"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Order Index</span>
									<span className="text-destructive">*</span>
								</Label>
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
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
								<p className="text-sm text-muted-foreground">
									Lower numbers appear earlier in category lists
								</p>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/service-category")}
								disabled={isSubmitting}
								className="h-11 px-6 font-medium border-2 hover:bg-muted/80 transition-all duration-200"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!isFormValid || isSubmitting}
								className="h-11 px-8 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Create Service Category
									</>
								)}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}

