import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Loader2, Pencil, Sparkles, Info, TrendingUp } from "lucide-react";
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
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="text-muted-foreground text-lg">Loading service stat details...</p>
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigate("/service-stats")}
							className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
								<Sparkles className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
									Service Stat Details
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									View service statistic information (ID: {id})
								</p>
							</div>
						</div>
					</div>
					<Button
						onClick={() => navigate(`/service-stats/edit/${id}`)}
						className="h-11 px-6 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
					>
						<Pencil className="h-4 w-4 mr-2" />
						Edit
					</Button>
				</div>

				{/* Details Card */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					{/* Decorative gradient bar */}
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					
					<CardHeader className="pb-6 pt-8 px-8">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
								<TrendingUp className="h-6 w-6 text-primary" />
							</div>
							<div className="flex-1">
								<CardTitle className="text-2xl font-semibold mb-2">
									Service Stat Information
								</CardTitle>
								<CardDescription className="text-base">
									Detailed information about this service statistic
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					
					<CardContent className="px-8 pb-8 space-y-8">
						{/* Icon */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Icon</span>
							</Label>
							<div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
								<div className="flex items-center justify-center h-20 w-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary border-2 border-primary/20 shadow-lg shadow-primary/10">
									{renderIcon(data.iconName) || (
										<Info className="h-10 w-10" />
									)}
								</div>
								<div className="flex-1">
									<p className="font-mono text-sm font-semibold text-foreground mb-1">
										Icon Name
									</p>
									<p className="font-mono text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-md border border-border/50 inline-block">
										{data.iconName}
									</p>
								</div>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Title */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Title</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-lg font-semibold text-foreground">{data.title}</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Number Value */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Number Value</span>
							</Label>
							<div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg shadow-primary/10">
								<p className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
									{data.numberValue.toLocaleString()}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

