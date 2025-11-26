import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePartner } from "@/hooks/use-partners";
import type { PartnerRequest } from "@/types/partners.types";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload, X, Handshake } from "lucide-react";

export default function PartnerCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreatePartner();

	const [logo, setLogo] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	const isSubmitting = createMutation.isPending;

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogo(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveLogo = () => {
		setLogo(null);
		setLogoPreview(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!logo || !name.trim() || orderIndex === "" || Number(orderIndex) < 0) {
			return;
		}

		try {
			const request: PartnerRequest = {
				logo,
				name: name.trim(),
				orderIndex: Number(orderIndex),
			};
			await createMutation.mutateAsync(request);
			navigate("/partner");
		} catch {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/partner");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleCancel}
					className="h-9 w-9"
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
						Create Partner
					</h1>
					<p className="text-muted-foreground mt-1">
						Add a new partner and their logo
					</p>
				</div>
			</div>

			{/* Form Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<Handshake className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Partner Information</CardTitle>
							<CardDescription>
								Fill in the details to create a new partner
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Logo Upload */}
						<div className="space-y-2">
							<Label htmlFor="logo">Logo *</Label>
							{!logoPreview ? (
								<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
									<input
										type="file"
										id="logo"
										accept="image/*"
										onChange={handleLogoChange}
										className="hidden"
										required
										disabled={isSubmitting}
									/>
									<label
										htmlFor="logo"
										className="cursor-pointer flex flex-col items-center gap-3"
									>
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
											<Upload className="h-6 w-6 text-primary" />
										</div>
										<div>
											<p className="text-sm font-medium">Click to upload logo</p>
											<p className="text-xs text-muted-foreground mt-1">
												PNG, JPG, SVG up to 5MB
											</p>
										</div>
									</label>
								</div>
							) : (
								<div className="relative">
									<div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
										{logoPreview ? (
											<img
												src={logoPreview}
												alt="Logo preview"
												className="max-h-full max-w-full object-contain"
											/>
										) : (
											<ImageIcon className="h-10 w-10 text-muted-foreground" />
										)}
										<Button
											type="button"
											variant="destructive"
											size="icon"
											onClick={handleRemoveLogo}
											className="absolute top-2 right-2 h-8 w-8"
											disabled={isSubmitting}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
									<input
										type="file"
										id="logo"
										accept="image/*"
										onChange={handleLogoChange}
										className="hidden"
										disabled={isSubmitting}
									/>
									<Button
										type="button"
										variant="outline"
										onClick={() => document.getElementById("logo")?.click()}
										className="mt-2 w-full"
										disabled={isSubmitting}
									>
										<Upload className="h-4 w-4 mr-2" />
										Change Logo
									</Button>
								</div>
							)}
						</div>

						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								placeholder="e.g., Acme Corp"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
						</div>

						{/* Order Index */}
						<div className="space-y-2">
							<Label htmlFor="orderIndex">Order Index *</Label>
							<Input
								id="orderIndex"
								type="number"
								min="0"
								placeholder="e.g., 1"
								value={orderIndex}
								onChange={(e) => {
									const value = e.target.value;
									setOrderIndex(value === "" ? "" : Number(value));
								}}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Lower numbers appear earlier in partner lists
							</p>
						</div>

						{/* Form Actions */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Create Partner
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}


