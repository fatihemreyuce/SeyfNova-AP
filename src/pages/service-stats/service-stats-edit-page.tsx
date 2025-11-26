import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateServiceStats, useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Popular Lucide icons for service stats
const popularIcons = [
	"BarChart3",
	"TrendingUp",
	"Users",
	"Award",
	"Star",
	"Target",
	"Zap",
	"Rocket",
	"ThumbsUp",
	"CheckCircle",
	"Heart",
	"Smile",
	"Trophy",
	"Gift",
	"Shield",
	"Globe",
	"Building",
	"Briefcase",
	"Mail",
	"Phone",
	"MessageSquare",
	"Clock",
	"Calendar",
	"Folder",
	"FileText",
] as const;

export default function ServiceStatsEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateServiceStats();
	const { data, isLoading, error } = useGetServiceStatsById(Number(id));

	const [icon, setIcon] = useState<string>("BarChart3");
	const [title, setTitle] = useState("");
	const [numberValue, setNumberValue] = useState<number | "">("");

	// Helper function to extract icon name from URL
	const extractIconNameFromUrl = (iconValue: string | null | undefined): string => {
		if (!iconValue) {
			return "BarChart3";
		}

		// If it's a URL, extract icon name from it
		if (iconValue.includes("http://") || iconValue.includes("https://")) {
			// URL format: https://localhost:8080/uploads/uuid IconName
			const parts = iconValue.trim().split(/\s+/);
			if (parts.length > 1) {
				// Last part should be the icon name
				const iconName = parts[parts.length - 1];
				if (iconName && /^[A-Z][a-zA-Z0-9]*$/.test(iconName)) {
					return iconName;
				}
			}
			return "BarChart3";
		}

		// If it's already a clean icon name, return it
		return iconValue.trim();
	};

	useEffect(() => {
		if (data) {
			setIcon(extractIconNameFromUrl(data.iconName) || "BarChart3");
			setTitle(data.title || "");
			setNumberValue(data.numberValue || "");
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service stat data");
			navigate("/service-stats");
		}
	}, [error, navigate]);

	// Helper function to convert icon string to File
	const iconStringToFile = (iconName: string): File => {
		const blob = new Blob([iconName], { type: 'text/plain' });
		return new File([blob], iconName, { type: 'text/plain' });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !icon || !title || numberValue === "" || numberValue < 0) {
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: {
					icon: iconStringToFile(icon),
					title,
					numberValue: Number(numberValue),
				},
			});
			navigate("/service-stats");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const renderIcon = (iconName: string) => {
		try {
			const IconComponent = (LucideIcons as any)[iconName];
			if (IconComponent) {
				return <IconComponent className="h-5 w-5" />;
			}
		} catch (error) {
			// Icon not found
		}
		return null;
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
					<p className="text-muted-foreground">Service stat not found</p>
					<Button onClick={() => navigate("/service-stats")} className="mt-4">
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	const isFormValid = icon && title.trim() && numberValue !== "" && numberValue >= 0;
	const isSubmitting = updateMutation.isPending;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/service-stats")}
					className="h-9 w-9"
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
						Edit Service Stat
					</h1>
					<p className="text-muted-foreground mt-1">
						Update service statistic (ID: {id})
					</p>
				</div>
			</div>

			{/* Form */}
			<Card className="max-w-2xl border-border/50 shadow-lg shadow-primary/5">
				<form onSubmit={handleSubmit}>
					<CardHeader>
						<CardTitle>Service Stat Details</CardTitle>
						<CardDescription>
							Update the information below to modify this service stat
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Icon Selection */}
						<div className="space-y-2">
							<Label htmlFor="icon">Icon *</Label>
							<Select value={icon} onValueChange={setIcon}>
								<SelectTrigger id="icon" className="h-11">
									<div className="flex items-center gap-2">
										{renderIcon(icon) && (
											<div className="flex items-center justify-center h-6 w-6 rounded bg-primary/10 text-primary">
												{renderIcon(icon)}
											</div>
										)}
										<SelectValue placeholder="Select an icon" />
									</div>
								</SelectTrigger>
								<SelectContent>
									{popularIcons.map((iconName) => {
										const IconComponent = (LucideIcons as any)[iconName];
										return (
											<SelectItem key={iconName} value={iconName}>
												<div className="flex items-center gap-2">
													{IconComponent && (
														<div className="flex items-center justify-center h-5 w-5">
															<IconComponent className="h-4 w-4" />
														</div>
													)}
													<span>{iconName}</span>
												</div>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								Choose an icon to represent this statistic
							</p>
						</div>

						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								placeholder="e.g., Happy Customers"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
						</div>

						{/* Number Value */}
						<div className="space-y-2">
							<Label htmlFor="numberValue">Number Value *</Label>
							<Input
								id="numberValue"
								type="number"
								placeholder="e.g., 1000"
								value={numberValue}
								onChange={(e) => {
									const value = e.target.value;
									setNumberValue(value === "" ? "" : Number(value));
								}}
								min="0"
								required
								disabled={isSubmitting}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Enter a positive number
							</p>
						</div>
					</CardContent>
					<CardFooter className="flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/service-stats")}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!isFormValid || isSubmitting}
							className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									Update Service Stat
								</>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

