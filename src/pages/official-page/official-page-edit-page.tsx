import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateOfficalPage, useOfficalPage } from "@/hooks/use-official-page";
import type { OfficalPageRequest, OfficalPageDocumentRequest, QualificationRequest } from "@/types/offical.page.types";
import { ArrowLeft, Save, FileText, Award, Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function OfficialPageEditPage() {
	const navigate = useNavigate();
	const updateMutation = useUpdateOfficalPage();
	const { data, isLoading } = useOfficalPage();

	const [description, setDescription] = useState("");
	const [documents, setDocuments] = useState<OfficalPageDocumentRequest[]>([]);
	const [qualifications, setQualifications] = useState<QualificationRequest[]>([]);

	useEffect(() => {
		const officialPage = data?.content?.[0] || (data as any);
		
		if (officialPage) {
			setDescription(officialPage.description || "");
			
			// API'den documents (çoğul) veya document (tekil) gelebilir
			// Hem Page formatını hem de direkt array formatını destekle
			const documents = Array.isArray(officialPage.documents) 
				? officialPage.documents 
				: Array.isArray(officialPage.document)
				? officialPage.document
				: officialPage.documents?.content || officialPage.document?.content || [];
			setDocuments(documents);

			// API'den qualityPolitics veya qualification gelebilir
			// Hem Page formatını hem de direkt array formatını destekle
			const qualifications = Array.isArray(officialPage.qualityPolitics) 
				? officialPage.qualityPolitics 
				: Array.isArray(officialPage.qualification)
				? officialPage.qualification
				: officialPage.qualityPolitics?.content || officialPage.qualification?.content || [];
			setQualifications(qualifications);
		}
	}, [data]);

	const handleAddDocument = () => {
		setDocuments([
			...documents,
			{
				id: 0,
				name: "",
				asset: "",
			},
		]);
	};

	const handleRemoveDocument = (index: number) => {
		setDocuments(documents.filter((_, i) => i !== index));
	};

	const handleDocumentChange = (index: number, field: keyof OfficalPageDocumentRequest, value: string | number) => {
		const updated = [...documents];
		updated[index] = { ...updated[index], [field]: value };
		setDocuments(updated);
	};

	const handleAddQualification = () => {
		setQualifications([
			...qualifications,
			{
				text: "",
				orderNumber: "",
			},
		]);
	};

	const handleRemoveQualification = (index: number) => {
		setQualifications(qualifications.filter((_, i) => i !== index));
	};

	const handleQualificationChange = (index: number, field: keyof QualificationRequest, value: string) => {
		const updated = [...qualifications];
		updated[index] = { ...updated[index], [field]: value };
		setQualifications(updated);
	};

	const isSubmitting = updateMutation.isPending;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!description.trim()) {
			toast.error("Açıklama alanı zorunludur");
			return;
		}

		// Validate documents
		const validDocuments = documents.filter(
			(doc) => doc.name.trim() !== "" && doc.asset.trim() !== ""
		);

		// Validate qualifications
		const validQualifications = qualifications.filter(
			(qual) => qual.text.trim() !== "" && qual.orderNumber.trim() !== ""
		);

		try {
			const request: OfficalPageRequest = {
				description: description.trim(),
				document: validDocuments,
				qualification: validQualifications,
			};
			
			await updateMutation.mutateAsync(request);
			navigate("/official-page");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/official-page");
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
						{Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						))}
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-32 w-full" />
						</div>
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
						Resmi Sayfa Düzenle
					</h1>
					<p className="text-muted-foreground mt-1">
						Resmi sayfa bilgilerini güncelle
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Description Card */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="border-b border-border/50">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
								<FileText className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<CardTitle className="text-xl">Açıklama</CardTitle>
								<CardDescription>
									Resmi sayfa açıklamasını girin
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="space-y-2">
							<Label htmlFor="description">Açıklama *</Label>
							<Textarea
								id="description"
								placeholder="Detaylı bir açıklama girin..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								disabled={isSubmitting}
								rows={6}
								className="resize-none"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Documents Card */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="border-b border-border/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
									<FileText className="h-5 w-5 text-primary-foreground" />
								</div>
								<div>
									<CardTitle className="text-xl">Dokümanlar</CardTitle>
									<CardDescription>
										Resmi sayfa dokümanlarını yönetin
									</CardDescription>
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddDocument}
								disabled={isSubmitting}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Doküman Ekle
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-6">
						{documents.length > 0 ? (
							<div className="space-y-4">
								{documents.map((doc, index) => (
									<div
										key={index}
										className="p-4 border rounded-lg bg-muted/30 space-y-4"
									>
										<div className="flex items-center justify-between">
											<h4 className="font-medium">Doküman {index + 1}</h4>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => handleRemoveDocument(index)}
												disabled={isSubmitting}
												className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor={`doc-name-${index}`}>İsim *</Label>
												<Input
													id={`doc-name-${index}`}
													placeholder="Doküman ismi"
													value={doc.name}
													onChange={(e) => handleDocumentChange(index, "name", e.target.value)}
													disabled={isSubmitting}
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor={`doc-asset-${index}`}>Dosya URL/Path *</Label>
												<Input
													id={`doc-asset-${index}`}
													placeholder="Dosya URL veya path"
													value={doc.asset}
													onChange={(e) => handleDocumentChange(index, "asset", e.target.value)}
													disabled={isSubmitting}
													className="h-11"
												/>
											</div>
										</div>
										{doc.id > 0 && (
											<div className="space-y-2">
												<Label htmlFor={`doc-id-${index}`}>ID</Label>
												<Input
													id={`doc-id-${index}`}
													type="number"
													value={doc.id}
													onChange={(e) => handleDocumentChange(index, "id", Number(e.target.value))}
													disabled={isSubmitting}
													className="h-11"
												/>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Henüz doküman eklenmedi</p>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleAddDocument}
									disabled={isSubmitting}
									className="mt-4 gap-2"
								>
									<Plus className="h-4 w-4" />
									İlk Dokümanı Ekle
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Qualifications Card */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="border-b border-border/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
									<Award className="h-5 w-5 text-primary-foreground" />
								</div>
								<div>
									<CardTitle className="text-xl">Nitelikler</CardTitle>
									<CardDescription>
										Resmi sayfa niteliklerini yönetin
									</CardDescription>
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddQualification}
								disabled={isSubmitting}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Nitelik Ekle
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-6">
						{qualifications.length > 0 ? (
							<div className="space-y-4">
								{qualifications.map((qual, index) => (
									<div
										key={index}
										className="p-4 border rounded-lg bg-muted/30 space-y-4"
									>
										<div className="flex items-center justify-between">
											<h4 className="font-medium">Nitelik {index + 1}</h4>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => handleRemoveQualification(index)}
												disabled={isSubmitting}
												className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor={`qual-text-${index}`}>Metin *</Label>
												<Input
													id={`qual-text-${index}`}
													placeholder="Nitelik metni"
													value={qual.text}
													onChange={(e) => handleQualificationChange(index, "text", e.target.value)}
													disabled={isSubmitting}
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor={`qual-order-${index}`}>Sıra Numarası *</Label>
												<Input
													id={`qual-order-${index}`}
													placeholder="Sıra numarası"
													value={qual.orderNumber}
													onChange={(e) => handleQualificationChange(index, "orderNumber", e.target.value)}
													disabled={isSubmitting}
													className="h-11"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Henüz nitelik eklenmedi</p>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleAddQualification}
									disabled={isSubmitting}
									className="mt-4 gap-2"
								>
									<Plus className="h-4 w-4" />
									İlk Niteliği Ekle
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Form Actions */}
				<div className="flex items-center justify-end gap-3 pt-4 border-t">
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						disabled={isSubmitting}
					>
						İptal
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Güncelleniyor...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Resmi Sayfayı Güncelle
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}

