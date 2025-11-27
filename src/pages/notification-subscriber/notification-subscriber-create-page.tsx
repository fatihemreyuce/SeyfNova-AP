import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCreateNotificationSubscriber } from "@/hooks/use-notifications-subscribers";
import type { NotificationSubscriberRequest } from "@/types/notifications.subscribers.types";
import { ArrowLeft, Users, Loader2, Save, Mail, User, Building2, Briefcase } from "lucide-react";

export default function NotificationSubscriberCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateNotificationSubscriber();

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [title, setTitle] = useState("");

	const isSubmitting = createMutation.isPending;
	const isFormValid =
		email.trim() !== "" &&
		name.trim() !== "" &&
		surname.trim() !== "" &&
		companyName.trim() !== "" &&
		title.trim() !== "";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isFormValid) return;

		try {
			const request: NotificationSubscriberRequest = {
				email: email.trim(),
				name: name.trim(),
				surname: surname.trim(),
				companyName: companyName.trim(),
				title: title.trim(),
			};
			await createMutation.mutateAsync(request);
			navigate("/notification-subscriber");
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
						onClick={() => navigate("/notification-subscriber")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Create Subscriber
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								Add a new notification subscriber
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
								Subscriber Details
							</CardTitle>
							<CardDescription className="text-base">
								Fill in the fields below to create a new notification subscriber
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6 px-8 pb-8">
							{/* Email */}
							<div className="space-y-3">
								<Label
									htmlFor="email"
									className="text-base font-medium flex items-center gap-2"
								>
									<Mail className="h-4 w-4 text-primary/70" />
									<span>Email</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="e.g., john.doe@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Name */}
							<div className="space-y-3">
								<Label
									htmlFor="name"
									className="text-base font-medium flex items-center gap-2"
								>
									<User className="h-4 w-4 text-primary/70" />
									<span>Name</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="name"
									placeholder="e.g., John"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Surname */}
							<div className="space-y-3">
								<Label
									htmlFor="surname"
									className="text-base font-medium flex items-center gap-2"
								>
									<User className="h-4 w-4 text-primary/70" />
									<span>Surname</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="surname"
									placeholder="e.g., Doe"
									value={surname}
									onChange={(e) => setSurname(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Company Name */}
							<div className="space-y-3">
								<Label
									htmlFor="companyName"
									className="text-base font-medium flex items-center gap-2"
								>
									<Building2 className="h-4 w-4 text-primary/70" />
									<span>Company Name</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="companyName"
									placeholder="e.g., Acme Corporation"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Title */}
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-base font-medium flex items-center gap-2"
								>
									<Briefcase className="h-4 w-4 text-primary/70" />
									<span>Title</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									placeholder="e.g., Software Engineer"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/notification-subscriber")}
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
										Create Subscriber
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

