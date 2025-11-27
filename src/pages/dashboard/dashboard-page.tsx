import { useGetDashboard } from "@/hooks/use-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Users,
	Eye,
	TrendingUp,
	TrendingDown,
	BarChart3,
	Target,
	MessageSquare,
	Loader2,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";

export default function DashboardPage() {
	const { data, isLoading, error } = useGetDashboard();

	// API'den Page<dashboard> dönüyor, ilk elemanı al
	const dashboard = data?.content?.[0] || (data as any);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">Dashboard verileri yükleniyor...</p>
				</div>
			</div>
		);
	}

	if (error || !dashboard) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
					<p className="text-muted-foreground">Kontrol paneli verileri yüklenirken hata oluştu</p>
				</div>
			</div>
		);
	}

	const percentageChange = dashboard.percentageChange || 0;
	const isPositive = percentageChange >= 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
					Analitik Kontrol Paneli
				</h1>
				<p className="text-muted-foreground mt-1">
					Web sitenizin performans metriklerini görüntüleyin
				</p>
			</div>

			{/* Main Metrics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Active Visitors */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Aktif Ziyaretçiler</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.activeVisitors || 0}</div>
						<p className="text-xs text-muted-foreground mt-1">Şu anda sitede</p>
					</CardContent>
				</Card>

				{/* Today Unique Visitors */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Bugünkü Ziyaretçiler</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.todayUniqueVisitors || 0}</div>
						<div className="flex items-center gap-1 mt-1">
							{isPositive ? (
								<ArrowUpRight className="h-3 w-3 text-green-500" />
							) : (
								<ArrowDownRight className="h-3 w-3 text-red-500" />
							)}
							<p className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
								{Math.abs(percentageChange).toFixed(1)}% dün ile karşılaştırıldığında
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Today Views */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Bugünkü Görüntülemeler</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.todayUniqueViews || 0}</div>
						<p className="text-xs text-muted-foreground mt-1">Bugün toplam görüntüleme</p>
					</CardContent>
				</Card>

				{/* Yesterday Comparison */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Dünkü Ziyaretçiler</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.yesterdayUniqueVisitors || 0}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{dashboard.yesterdayUniqueViews || 0} görüntüleme
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Conversion Metrics */}
			{dashboard.conversion && dashboard.conversion.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{dashboard.conversion.map((conv, index) => (
						<Card key={index} className="shadow-lg border-border/50">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
								<Target className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{conv.conversionRate ? `${conv.conversionRate.toFixed(2)}%` : "0%"}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{conv.totalContactForms || 0} / {conv.totalVisitors || 0} form
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Top Pages and Daily Stats */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Pages */}
				<Card className="shadow-lg border-border/50">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
								<BarChart3 className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<CardTitle className="text-xl">En Çok Görüntülenen Sayfalar</CardTitle>
								<CardDescription>
									En popüler sayfalarınız
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{dashboard.topPages && dashboard.topPages.length > 0 ? (
							<div className="border rounded-lg">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Sayfa</TableHead>
											<TableHead className="text-right">Görüntüleme</TableHead>
											<TableHead className="text-right">Benzersiz Ziyaretçi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{dashboard.topPages.map((page, index) => (
											<TableRow key={index}>
												<TableCell className="font-medium max-w-[200px] truncate">
													{page.pagePath || "N/A"}
												</TableCell>
												<TableCell className="text-right">{page.viewCount || 0}</TableCell>
												<TableCell className="text-right">{page.uniqueVisitors || 0}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Henüz sayfa görüntüleme verisi yok</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Daily Stats */}
				<Card className="shadow-lg border-border/50">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
								<TrendingUp className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<CardTitle className="text-xl">Günlük İstatistikler</CardTitle>
								<CardDescription>
									Son günlerin performans metrikleri
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{dashboard.dailyStats && dashboard.dailyStats.length > 0 ? (
							<div className="border rounded-lg">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Tarih</TableHead>
											<TableHead className="text-right">Ziyaretçi</TableHead>
											<TableHead className="text-right">Görüntüleme</TableHead>
											<TableHead className="text-right">Ortalama</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{dashboard.dailyStats.map((stat, index) => (
											<TableRow key={index}>
												<TableCell className="font-medium">
													{stat.date
														? new Date(stat.date).toLocaleDateString("tr-TR", {
																day: "2-digit",
																month: "2-digit",
																year: "numeric",
															})
														: "N/A"}
												</TableCell>
												<TableCell className="text-right">
													{stat.uniqueVisitors || 0}
												</TableCell>
												<TableCell className="text-right">
													{stat.totalPageViews || 0}
												</TableCell>
												<TableCell className="text-right">
													{stat.avgPagesPerVisitor
														? stat.avgPagesPerVisitor.toFixed(2)
														: "0.00"}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Henüz günlük istatistik verisi yok</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Conversion Details */}
			{dashboard.conversion && dashboard.conversion.length > 0 && (
				<Card className="shadow-lg border-border/50">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
								<MessageSquare className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<CardTitle className="text-xl">İletişim Formu İstatistikleri</CardTitle>
								<CardDescription>
									Form dönüşüm metrikleri
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{dashboard.conversion.map((conv, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Toplam Ziyaretçi</span>
										<span className="text-sm font-semibold">{conv.totalVisitors || 0}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Toplam Form</span>
										<span className="text-sm font-semibold">{conv.totalContactForms || 0}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Bugünkü Form</span>
										<span className="text-sm font-semibold text-green-500">
											{conv.todayContactForms || 0}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Dünkü Form</span>
										<span className="text-sm font-semibold">{conv.yesterdayContactForms || 0}</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
