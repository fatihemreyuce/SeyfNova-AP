import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginState } from "@/hooks/use-login-state";
import type { LoginRequest } from "@/types/auth.types";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import DarkModeToggle from "@/components/dark-mode-toggle";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const { login, isLoading, isLoggedIn } = useLoginState();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
		}
	}, [isLoggedIn, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const loginRequest: LoginRequest = {
				email,
				password,
			};

			await login(loginRequest);
			navigate("/");
		} catch (err: any) {
			toast.error("Invalid email or password. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormDisabled = isLoading || isSubmitting;

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4 py-10 relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
			<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

			{/* Theme Toggle in top right */}
			<div className="absolute top-6 right-6 z-10">
				<DarkModeToggle />
			</div>

			<Card className="relative w-full max-w-md border border-border/50 shadow-2xl shadow-primary/5 bg-card/95 backdrop-blur-sm">
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl pointer-events-none" />

				<CardHeader className="relative space-y-3 text-center pb-6">
					{/* Logo */}
					<div className="flex justify-center mb-2">
						<div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
							<span className="text-xl font-bold text-primary-foreground">SN</span>
						</div>
					</div>
					<CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
						Seyf Nova
					</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Welcome back! Sign in to your account
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="relative space-y-5">
						{/* Email Input */}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">
								Email
							</Label>
							<div className="relative group">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									autoComplete="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isFormDisabled}
									className="pl-11 h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
								/>
							</div>
						</div>

						{/* Password Input */}
						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">
								Password
							</Label>
							<div className="relative group">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									disabled={isFormDisabled}
									className="pl-11 pr-11 h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isFormDisabled}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-1"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
									) : (
										<Eye className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<p className="text-sm text-destructive mt-1 animate-in fade-in duration-200">{error}</p>
						)}
					</CardContent>

					<CardFooter className="relative pt-2">
						<Button 
							type="submit" 
							className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300" 
							disabled={isFormDisabled} 
							aria-busy={isFormDisabled}
						>
							{isFormDisabled ? (
								<>
									<span className="mr-2">Signing in...</span>
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								</>
							) : (
								"Sign in"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
