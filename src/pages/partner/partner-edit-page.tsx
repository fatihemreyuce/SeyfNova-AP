import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdatePartner, useGetPartnerById } from "@/hooks/use-partners";
import type { PartnerRequest } from "@/types/partners.types";
import { normalizeImageUrl } from "@/utils/image-url";
import { ArrowLeft, Save, Image as ImageIcon, Upload, X, Handshake, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PartnerEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdatePartner();
	const { data, isLoading, error } = useGetPartnerById(Number(id));

	const [logo, setLogo] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	useEffect(() => {
		if (data) {
			setName(data.name || "");
			setOrderIndex(data.orderIndex || "");
			if (data.logoUrl) {
				setLogoPreview(normalizeImageUrl(data.logoUrl) ?? null);
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load partner data");
			navigate("/partner");
		}
	}, [error, navigate]);

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
		if (data?.logoUrl) {
			setLogoPreview(normalizeImageUrl(data.logoUrl) ?? null);
		} else {
			setLogoPreview(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !name.trim() || orderIndex === "" || Number(orderIndex) < 0) {
			return;
		}

		try {
			const request: PartnerRequest = {
				logo: logo || (data?.logoUrl || ""),
				name: name.trim(),
				orderIndex: Number(orderIndex),
			};
			await updateMutation.mutateAsync({
				id: Number(id),
				request,
			});
			navigate("/partner");
		} catch {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/partner");
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<Skeleton className="h-9 w-9 rounded" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-4 w-64" />
					</div>
				</div>
				<Card className="shadow-lg border-border/50">
					<CardHeader className="border-b border-border/50">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-64" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-6 space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-40 w-full max-w-xs rounded-lg" />
						</div>
						{Array.from({ length: 2 }).map((_, index) => (
							<div key={index} className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						))}
						<div className="flex items-center justify-end gap-3 pt-4 border-t">
							<Skeleton className="h-10 w-20" />
							<Skeleton className="h-10 w-24" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

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
						Partner Düzenle
					</h1>
					<p className="text-muted-foreground mt-1">
						Partner bilgilerini güncelle
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
							<CardTitle className="text-xl">Partner Bilgileri</CardTitle>
							<CardDescription>
								Bu partnerin detaylarını güncelleyin
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Logo Upload */}
						<div className="space-y-2">
							<Label htmlFor="logo">Logo {!logoPreview && "*"}</Label>
							{!logoPreview ? (
								<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
									<input
										type="file"
										id="logo"
										accept="image/*"
										onChange={handleLogoChange}
										className="hidden"
										disabled={updateMutation.isPending}
									/>
									<label
										htmlFor="logo"
										className="cursor-pointer flex flex-col items-center gap-3"
									>
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
											<Upload className="h-6 w-6 text-primary" />
										</div>
										<div>
											<p className="text-sm font-medium">Logo yüklemek için tıklayın</p>
											<p className="text-xs text-muted-foreground mt-1">
												PNG, JPG, SVG, 5MB'a kadar
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
												alt="Logo Önizleme"
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
											disabled={updateMutation.isPending}
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
										disabled={updateMutation.isPending}
									/>
									<Button
										type="button"
										variant="outline"
										onClick={() => document.getElementById("logo")?.click()}
										className="mt-2 w-full"
										disabled={updateMutation.isPending}
									>
										<Upload className="h-4 w-4 mr-2" />
										Logoyu Değiştir
									</Button>
								</div>
							)}
						</div>

						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">İsim *</Label>
							<Input
								id="name"
								placeholder="Örn: Acme Corp"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={updateMutation.isPending}
								className="h-11"
							/>
						</div>

						{/* Order Index */}
						<div className="space-y-2">
							<Label htmlFor="orderIndex">Sıra *</Label>
							<Input
								id="orderIndex"
								type="number"
								min="0"
								placeholder="Örn: 1"
								value={orderIndex}
								onChange={(e) => {
									const value = e.target.value;
									setOrderIndex(value === "" ? "" : Number(value));
								}}
								required
								disabled={updateMutation.isPending}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Düşük sayılar partner listelerinde daha önce görünür
							</p>
						</div>

						{/* Form Actions */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={updateMutation.isPending}
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={updateMutation.isPending}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								{updateMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Güncelleniyor...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Partneri Güncelle
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


