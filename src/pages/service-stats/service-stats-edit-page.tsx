import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateServiceStats, useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Loader2, Save, Sparkles, TrendingUp, Check, Info } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ServiceStatsEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateServiceStats();
	const { data, isLoading, error } = useGetServiceStatsById(Number(id));

	const [icon, setIcon] = useState<string>("BarChart3");
	const [title, setTitle] = useState("");
	const [numberValue, setNumberValue] = useState<number | "">("");

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !icon || !title || numberValue === "" || numberValue < 0) {
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: {
					icon,
					title,
					numberValue: Number(numberValue),
				},
			});
			navigate("/service-stats");
		} catch (error) {
			// Error handled by mutation
		}
	};

	// Icon render helper
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
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="text-muted-foreground text-lg">Loading service stat data...</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
				<Card className="max-w-md border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
					<CardContent className="pt-6 text-center space-y-4">
						<div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
							<Info className="h-8 w-8 text-destructive" />
						</div>
						<p className="text-lg font-semibold text-foreground">Service stat not found</p>
						<p className="text-sm text-muted-foreground">The service statistic you're looking for doesn't exist or has been removed.</p>
						<Button 
							onClick={() => navigate("/service-stats")} 
							className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isFormValid = icon && title.trim() && numberValue !== "" && numberValue >= 0;
	const isSubmitting = updateMutation.isPending;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/service-stats")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
								<Sparkles className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
									Edit Service Stat
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Update service statistic (ID: {id})
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					{/* Decorative gradient bar */}
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-6 pt-8 px-8">
							<div className="flex items-start gap-4">
								<div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
									<TrendingUp className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-2xl font-semibold mb-2">
										Service Stat Details
									</CardTitle>
									<CardDescription className="text-base">
										Update the information below to modify this service stat
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Icon Selection */}
							<div className="space-y-3">
								<Label htmlFor="icon" className="text-base font-medium flex items-center gap-2">
									<span>Icon</span>
									<span className="text-destructive">*</span>
								</Label>
								<Select value={icon} onValueChange={setIcon}>
									<SelectTrigger 
										id="icon" 
										className="h-12 border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
									>
										<div className="flex items-center gap-3 w-full">
											{renderIcon(icon) && (
												<div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm">
													{renderIcon(icon)}
												</div>
											)}
											<SelectValue placeholder="Select an icon" className="text-base" />
										</div>
									</SelectTrigger>
									<SelectContent className="max-h-[300px]">
										{popularIcons.map((iconName) => {
											const IconComponent = (LucideIcons as any)[iconName];
											return (
												<SelectItem 
													key={iconName} 
													value={iconName}
													className="cursor-pointer hover:bg-muted/80 transition-colors"
												>
													<div className="flex items-center gap-3 py-1">
														{IconComponent && (
															<div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary">
																<IconComponent className="h-4 w-4" />
															</div>
														)}
														<span className="font-medium">{iconName}</span>
													</div>
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Choose an icon to represent this statistic
								</p>
							</div>

							{/* Divider */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

							{/* Title */}
							<div className="space-y-3">
								<Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
									<span>Title</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									placeholder="e.g., Happy Customers"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Divider */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

							{/* Number Value */}
							<div className="space-y-3">
								<Label htmlFor="numberValue" className="text-base font-medium flex items-center gap-2">
									<span>Number Value</span>
									<span className="text-destructive">*</span>
								</Label>
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
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Enter a positive number
								</p>
							</div>
						</CardContent>
						
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/service-stats")}
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
										Updating...
									</>
								) : (
									<>
										<Check className="h-4 w-4 mr-2" />
										Update Service Stat
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

