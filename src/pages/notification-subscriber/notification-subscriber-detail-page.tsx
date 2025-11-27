import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useNotificationSubscribers } from "@/hooks/use-notifications-subscribers";
import { ArrowLeft, Users, Loader2, Info, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function NotificationSubscriberDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	
	// Since there's no getById endpoint, we'll fetch all and find the one we need
	// In a real scenario, you'd want to add a getById endpoint
	const { data, isLoading, error } = useNotificationSubscribers(0, 1000, "id,asc");
	
	const subscriber = data?.content?.find((item) => item.id === Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load subscriber data");
			navigate("/notification-subscriber");
		}
	}, [error, navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="text-muted-foreground text-lg">Loading subscriber details...</p>
				</div>
			</div>
		);
	}

	if (!subscriber) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
				<Card className="max-w-md border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
					<CardContent className="pt-6 text-center space-y-4">
						<div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
							<Info className="h-8 w-8 text-destructive" />
						</div>
						<p className="text-lg font-semibold text-foreground">Subscriber not found</p>
						<p className="text-sm text-muted-foreground">
							The subscriber you're looking for doesn't exist or has been removed.
						</p>
						<Button
							onClick={() => navigate("/notification-subscriber")}
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
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/notification-subscriber")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Subscriber Details
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								View subscriber information (ID: {id})
							</p>
						</div>
					</div>
				</div>

				{/* Detail Card */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					<CardHeader className="pb-6 pt-8 px-8">
						<CardTitle className="text-2xl font-semibold mb-2">
							Subscriber Information
						</CardTitle>
						<CardDescription className="text-base">
							Detailed information about this notification subscriber
						</CardDescription>
					</CardHeader>
					<CardContent className="px-8 pb-8 space-y-8">
						{/* Name */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<User className="h-4 w-4 text-primary/70" />
								<span>Name</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-lg font-semibold text-foreground">
									{subscriber.name}
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Surname */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<User className="h-4 w-4 text-primary/70" />
								<span>Surname</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-lg font-semibold text-foreground">
									{subscriber.surname}
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Email */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<Mail className="h-4 w-4 text-primary/70" />
								<span>Email</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-base text-foreground">
									{subscriber.email}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

