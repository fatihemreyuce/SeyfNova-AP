import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateServiceStats } from "@/hooks/use-service-stats";
import { ArrowLeft, Loader2, Check } from "lucide-react";
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

export default function ServiceStatsCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateServiceStats();

	const [icon, setIcon] = useState<string>("BarChart3");
	const [title, setTitle] = useState("");
	const [numberValue, setNumberValue] = useState<number | "">("");

	// Helper function to convert icon string to File
	const iconStringToFile = (iconName: string): File => {
		const blob = new Blob([iconName], { type: 'text/plain' });
		return new File([blob], iconName, { type: 'text/plain' });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!icon || !title || numberValue === "" || numberValue < 0) {
			return;
		}

		try {
			await createMutation.mutateAsync({
				icon: iconStringToFile(icon),
				title,
				numberValue: Number(numberValue),
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

	const isFormValid = icon && title.trim() && numberValue !== "" && numberValue >= 0;
	const isLoading = createMutation.isPending;

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
						Create Service Stat
					</h1>
					<p className="text-muted-foreground mt-1">
						Add a new service statistic
					</p>
				</div>
			</div>

			{/* Form */}
			<Card className="max-w-2xl border-border/50 shadow-lg shadow-primary/5">
				<form onSubmit={handleSubmit}>
					<CardHeader>
						<CardTitle>Service Stat Details</CardTitle>
						<CardDescription>
							Fill in the information below to create a new service stat
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
								disabled={isLoading}
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
								disabled={isLoading}
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
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!isFormValid || isLoading}
							className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Check className="h-4 w-4 mr-2" />
									Create Service Stat
								</>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

