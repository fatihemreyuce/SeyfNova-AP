import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPartnerById } from "@/hooks/use-partners";
import { ArrowLeft, Edit, Handshake, Loader2 } from "lucide-react";
import { normalizeImageUrl } from "@/utils/image-url";
import { toast } from "sonner";

export default function PartnerDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetPartnerById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load partner data");
			navigate("/partner");
		}
	}, [error, navigate]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">Loading partner data...</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/partner")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Partner Details
						</h1>
						<p className="text-muted-foreground mt-1">
							View detailed information about this partner
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate(`/partner/edit/${id}`)}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Edit className="h-4 w-4 mr-2" />
					Edit Partner
				</Button>
			</div>

			{/* Detail Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<Handshake className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">{data.name}</CardTitle>
							<CardDescription>
								Partner ID: {data.id}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6 space-y-6">
					{/* ID */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">ID</label>
						<div className="text-base font-semibold">{data.id}</div>
					</div>

					{/* Logo */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Logo</label>
						{normalizeImageUrl(data.logoUrl) ? (
							<div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-border/50 bg-white flex items-center justify-center p-4">
								<img
									src={normalizeImageUrl(data.logoUrl)}
									alt={data.name}
									className="max-h-32 max-w-full object-contain"
								/>
							</div>
						) : (
							<div className="flex items-center justify-center h-40 rounded-lg border border-border/50 bg-muted/50">
								<div className="text-center space-y-2">
									<Handshake className="h-12 w-12 text-muted-foreground mx-auto" />
									<p className="text-sm text-muted-foreground">No logo available</p>
								</div>
							</div>
						)}
					</div>

					{/* Name */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Name</label>
						<div className="text-base font-semibold">{data.name}</div>
					</div>

					{/* Order Index */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Order Index</label>
						<div className="text-base">{data.orderIndex}</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


