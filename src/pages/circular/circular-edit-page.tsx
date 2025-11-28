import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateCircular, useGetCircularById } from "@/hooks/use-circulars";
import type { CircularRequest } from "@/types/circulars.types";
import { normalizeImageUrl } from "@/utils/image-url";
import { ArrowLeft, FileText, Save, Upload, X, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CircularEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateCircular();
	const { data, isLoading, error } = useGetCircularById(Number(id));

	const [file, setFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState<string>("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (data) {
			setTitle(data.title || "");
			setDescription(data.description || "");
			if (data.fileUrl) {
				const url = normalizeImageUrl(data.fileUrl);
				if (url) {
					const urlParts = url.split("/");
					setFileName(urlParts[urlParts.length - 1] || "Current file");
				}
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load circular data");
			navigate("/circular");
		}
	}, [error, navigate]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setFileName(selectedFile.name);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		if (data?.fileUrl) {
			const url = normalizeImageUrl(data.fileUrl);
			if (url) {
				const urlParts = url.split("/");
				setFileName(urlParts[urlParts.length - 1] || "Current file");
			}
		} else {
			setFileName("");
		}
	};

	const isSubmitting = updateMutation.isPending;
	const isFormValid =
		title.trim() !== "" &&
		description.trim() !== "" &&
		(file !== null || data?.fileUrl);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !isFormValid) return;

		try {
			const request: CircularRequest = {
				file: file || (data?.fileUrl || ""),
				title: title.trim(),
				description: description.trim(),
			};
			await updateMutation.mutateAsync({
				id: Number(id),
				request,
			});
			navigate("/circular");
		} catch {
			// handled in mutation
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
				<div className="max-w-3xl mx-auto space-y-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-40" />
								<Skeleton className="h-4 w-48" />
							</div>
						</div>
					</div>
					<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
						<Skeleton className="h-1.5 w-full" />
						<CardHeader className="pb-6 pt-8 px-4 sm:px-8">
							<Skeleton className="h-7 w-48 mb-2" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>
						<CardContent className="px-4 sm:px-8 pb-8 space-y-8">
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-24 w-full rounded-lg" />
							</div>
							{Array.from({ length: 2 }).map((_, index) => (
								<div key={index} className="space-y-3">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</CardContent>
						<CardFooter className="px-4 sm:px-8 pb-8 pt-6">
							<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4 w-full">
								<Skeleton className="h-11 w-24" />
								<Skeleton className="h-11 w-32" />
							</div>
						</CardFooter>
					</Card>
				</div>
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
						onClick={() => navigate("/circular")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<FileText className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Genelge Düzenle
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								Genelge bilgilerini güncelle (ID: {id})
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
								Genelge Detayları
							</CardTitle>
							<CardDescription className="text-base">
								Bu genelgeyi değiştirmek için aşağıdaki alanları güncelleyin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8 px-8 pb-8">
							{/* File Upload */}
							<div className="space-y-3">
								<Label
									htmlFor="file"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>File</span>
									{!file && !data?.fileUrl && <span className="text-destructive">*</span>}
								</Label>
								{data?.fileUrl && !file && (
									<div className="mb-3 p-4 rounded-lg border border-border/50 bg-muted/30">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
												<FileText className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">Mevcut dosya</p>
												<p className="text-xs text-muted-foreground">Değiştirmek için aşağıya tıklayın</p>
											</div>
											<a
												href={normalizeImageUrl(data.fileUrl)}
												target="_blank"
												rel="noopener noreferrer"
												className="flex-shrink-0"
											>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="gap-2"
												>
													<Download className="h-4 w-4" />
													Görüntüle
												</Button>
											</a>
										</div>
									</div>
								)}
								{!file && !data?.fileUrl ? (
									<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
										<input
											type="file"
											id="file"
											accept=".pdf,.doc,.docx"
											onChange={handleFileChange}
											className="hidden"
											disabled={isSubmitting}
										/>
										<label
											htmlFor="file"
											className="cursor-pointer flex flex-col items-center gap-3"
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
												<Upload className="h-6 w-6 text-primary" />
											</div>
											<div>
												<p className="text-sm font-medium">Dosya yüklemek için tıklayın</p>
												<p className="text-xs text-muted-foreground mt-1">
													PDF, DOC, DOCX, 10MB'a kadar
												</p>
											</div>
										</label>
									</div>
								) : (
									<div className="relative">
										<div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-muted/50">
											<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
												<FileText className="h-6 w-6 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">{fileName}</p>
												<p className="text-xs text-muted-foreground">
													{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Mevcut dosya"}
												</p>
											</div>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={handleRemoveFile}
												className="h-8 w-8 flex-shrink-0"
												disabled={isSubmitting}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
										<input
											type="file"
											id="file"
											accept=".pdf,.doc,.docx"
											onChange={handleFileChange}
											className="hidden"
											disabled={isSubmitting}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => document.getElementById("file")?.click()}
											className="mt-2 w-full"
											disabled={isSubmitting}
										>
											<Upload className="h-4 w-4 mr-2" />
											Dosyayı Değiştir
										</Button>
									</div>
								)}
							</div>

							{/* Title */}
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Başlık</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									placeholder="Örn: Yıllık Rapor 2024"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Description */}
							<div className="space-y-3">
								<Label
									htmlFor="description"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Açıklama</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="description"
									placeholder="Genelge için bir açıklama verin..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[120px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/circular")}
								disabled={isSubmitting}
								className="h-11 px-6 font-medium border-2 hover:bg-muted/80 transition-all duration-200"
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={!isFormValid || isSubmitting}
								className="h-11 px-8 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Güncelleniyor...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Genelgeyi Güncelle
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

