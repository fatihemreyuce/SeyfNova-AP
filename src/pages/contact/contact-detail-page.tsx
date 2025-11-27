import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetContactById } from "@/hooks/use-contact";
import { ArrowLeft, MessageSquare, Loader2, Phone, User, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ContactDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetContactById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("İletişim mesajı verileri yüklenirken hata oluştu");
			navigate("/contact");
		}
	}, [error, navigate]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">İletişim mesajı verileri yükleniyor...</p>
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
						onClick={() => navigate("/contact")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							İletişim Mesajı Detayları
						</h1>
						<p className="text-muted-foreground mt-1">
							Bu iletişim mesajı hakkında detaylı bilgi görüntüle
						</p>
					</div>
				</div>
			</div>

			{/* Detail Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<MessageSquare className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">{data.subject}</CardTitle>
							<CardDescription>
								İletişim Mesajı ID: {data.id}
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

					{/* Name and Surname */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<User className="h-4 w-4" />
								Ad
							</label>
							<div className="text-base font-semibold">{data.name}</div>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<User className="h-4 w-4" />
								Soyad
							</label>
							<div className="text-base font-semibold">{data.surname}</div>
						</div>
					</div>

					{/* Phone */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Phone className="h-4 w-4" />
							Telefon
						</label>
						<div className="text-base">{data.phone}</div>
					</div>

					{/* Subject */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Mail className="h-4 w-4" />
							Konu
						</label>
						<div className="text-base font-semibold">{data.subject}</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Açıklama</label>
						<div className="text-base whitespace-pre-wrap bg-muted/50 rounded-lg p-4 border border-border/50">
							{data.description}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

