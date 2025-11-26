import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

export default function ServiceStatsDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetServiceStatsById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service stat data");
			navigate("/service-stats");
		}
	}, [error, navigate]);

	const renderIcon = (iconName: string) => {
		try {
			const IconComponent = (LucideIcons as any)[iconName];
			if (IconComponent) {
				return <IconComponent className="h-8 w-8" />;
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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
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
							Service Stat Details
						</h1>
						<p className="text-muted-foreground mt-1">
							View service statistic information (ID: {id})
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate(`/service-stats/edit/${id}`)}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Pencil className="h-4 w-4 mr-2" />
					Edit
				</Button>
			</div>

			{/* Details Card */}
			<Card className="max-w-2xl border-border/50 shadow-lg shadow-primary/5">
				<CardHeader>
					<CardTitle>Service Stat Information</CardTitle>
					<CardDescription>
						Detailed information about this service statistic
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Icon */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Icon</Label>
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center h-16 w-16 rounded-lg bg-primary/10 text-primary">
								{renderIcon(data.iconName)}
							</div>
							<div>
								<p className="font-mono text-sm text-muted-foreground">
									{data.iconName}
								</p>
							</div>
						</div>
					</div>

					{/* Title */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Title</Label>
						<p className="text-base font-semibold">{data.title}</p>
					</div>

					{/* Number Value */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Number Value</Label>
						<p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
							{data.numberValue.toLocaleString()}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

