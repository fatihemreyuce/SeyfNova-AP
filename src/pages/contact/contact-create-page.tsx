import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateContact } from "@/hooks/use-contact";
import type { ContactRequest } from "@/types/contact.types";
import { ArrowLeft, Save, Loader2, MessageSquare } from "lucide-react";

export default function ContactCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateContact();

	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");
	const [phone, setPhone] = useState("");

	const isSubmitting = createMutation.isPending;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (
			!name.trim() ||
			!surname.trim() ||
			!subject.trim() ||
			!description.trim() ||
			!phone.trim()
		) {
			return;
		}

		try {
			const request: ContactRequest = {
				name: name.trim(),
				surname: surname.trim(),
				subject: subject.trim(),
				description: description.trim(),
				phone: phone.trim(),
			};
			await createMutation.mutateAsync(request);
			navigate("/contact");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/contact");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
						<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							İletişim Mesajı Oluştur
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Yeni bir iletişim mesajı ekleyin
						</p>
					</div>
				</div>
			</div>

			{/* Form Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<MessageSquare className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">İletişim Bilgileri</CardTitle>
							<CardDescription>
								Yeni bir iletişim mesajı oluşturmak için detayları doldurun
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name and Surname */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Ad *</Label>
								<Input
									id="name"
									placeholder="Örn: Ahmet"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									disabled={isSubmitting}
									className="h-11"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="surname">Soyad *</Label>
								<Input
									id="surname"
									placeholder="Örn: Yılmaz"
									value={surname}
									onChange={(e) => setSurname(e.target.value)}
									required
									disabled={isSubmitting}
									className="h-11"
								/>
							</div>
						</div>

						{/* Phone */}
						<div className="space-y-2">
							<Label htmlFor="phone">Telefon *</Label>
							<Input
								id="phone"
								placeholder="Örn: +90 555 123 45 67"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
						</div>

						{/* Subject */}
						<div className="space-y-2">
							<Label htmlFor="subject">Konu *</Label>
							<Input
								id="subject"
								placeholder="Örn: Genel Bilgi"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
						</div>

						{/* Description */}
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

						{/* Form Actions */}
						<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isSubmitting}
								className="w-full sm:w-auto"
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 w-full sm:w-auto"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										<span className="hidden sm:inline">Oluşturuluyor...</span>
										<span className="sm:hidden">Yükleniyor...</span>
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										<span className="hidden sm:inline">İletişim Mesajı Oluştur</span>
										<span className="sm:hidden">Oluştur</span>
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

