import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetHomePageAboutById } from "@/hooks/use-homapage-about";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HomepageAboutDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetHomePageAboutById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load homepage about data");
			navigate("/homepage-about");
		}
	}, [error, navigate]);

	const handleEdit = () => {
		navigate(`/homepage-about/edit/${id}`);
	};

	const handleBack = () => {
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
					<Button onClick={handleBack} className="mt-4">
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleBack}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Homepage About Details
						</h1>
						<p className="text-muted-foreground mt-1">
							View homepage about content (ID: {id})
						</p>
					</div>
				</div>
				<Button
					onClick={handleEdit}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Pencil className="h-4 w-4 mr-2" />
					Edit
				</Button>
			</div>

			{/* Content */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left Side Card */}
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-primary" />
							Left Section
						</CardTitle>
						<CardDescription>Left side content information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-semibold text-muted-foreground">
								Title
							</Label>
							<p className="text-base font-medium">{data.leftTitle || "N/A"}</p>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-semibold text-muted-foreground">
								Description
							</Label>
							<p className="text-base text-muted-foreground whitespace-pre-wrap">
								{data.leftDescription || "N/A"}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Right Side Card */}
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-primary" />
							Right Section
						</CardTitle>
						<CardDescription>Right side content information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-semibold text-muted-foreground">
								Title
							</Label>
							<p className="text-base font-medium">{data.rightTitle || "N/A"}</p>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-semibold text-muted-foreground">
								Description
							</Label>
							<p className="text-base text-muted-foreground whitespace-pre-wrap">
								{data.rightDescription || "N/A"}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Metadata Card */}
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle>Metadata</CardTitle>
					<CardDescription>Additional information</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-semibold text-muted-foreground">
								ID
							</Label>
							<p className="text-base font-mono">{data.id}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

