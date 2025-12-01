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
	BarChart3,
	Target,
	MessageSquare,
	Loader2,
	ArrowUpRight,
	ArrowDownRight,
	Activity,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
	visitors: {
		label: "Ziyaretçiler",
		color: "hsl(var(--chart-1))",
	},
	views: {
		label: "Görüntülemeler",
		color: "hsl(var(--chart-2))",
	},
	conversion: {
		label: "Dönüşüm Oranı",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

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

	// Günlük istatistikler için chart verisi hazırla
	const dailyStatsData = dashboard.dailyStats?.slice(0, 7).reverse().map((stat: any) => ({
		tarih: new Date(stat.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
		ziyaretçiler: stat.uniqueVisitors || 0,
		görüntülemeler: stat.totalPageViews || 0,
		ortalama: stat.avgPagePerVisitor || 0,
	})) || [];

	// Top pages için chart verisi hazırla
	const topPagesData = dashboard.topPages?.slice(0, 5).map((page: any, index: number) => ({
		sayfa: page.pagePath?.split("/").pop() || `Sayfa ${index + 1}`,
		görüntüleme: page.viewCount || 0,
		ziyaretçi: page.uniqueVisitors || 0,
	})) || [];

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">Analitik Kontrol Paneli</h1>
				<p className="text-muted-foreground">
					Web sitenizin performans metriklerini görüntüleyin ve analiz edin
				</p>
			</div>

			{/* Main Metrics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Active Visitors */}
				<Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Aktif Ziyaretçiler</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.activeVisitors || 0}</div>
						<p className="text-xs text-muted-foreground mt-1">Şu anda sitede</p>
					</CardContent>
				</Card>

				{/* Today Unique Visitors */}
				<Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Bugünkü Ziyaretçiler</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.todayUniqueVisitors || 0}</div>
						<div className="flex items-center gap-1 mt-1">
							{isPositive ? (
								<ArrowUpRight className="h-3 w-3 text-green-500" />
							) : (
								<ArrowDownRight className="h-3 w-3 text-red-500" />
							)}
							<p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
								{Math.abs(percentageChange).toFixed(1)}% dün ile karşılaştırıldığında
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Today Views */}
				<Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Bugünkü Görüntülemeler</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.todayPageViews || dashboard.todayUniqueViews || 0}</div>
						<p className="text-xs text-muted-foreground mt-1">Bugün toplam görüntüleme</p>
					</CardContent>
				</Card>

				{/* Yesterday Comparison */}
				<Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Dünkü Ziyaretçiler</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{dashboard.yesterdayUniqueVisitors || 0}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{dashboard.yesterdayPageViews || dashboard.yesterdayUniqueViews || 0} görüntüleme
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Daily Stats Chart */}
				<Card className="border-border/50 shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Son 7 Günün Performansı
						</CardTitle>
						<CardDescription>Ziyaretçi ve görüntüleme trendleri</CardDescription>
					</CardHeader>
					<CardContent>
						{dailyStatsData.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[300px]">
								<AreaChart data={dailyStatsData}>
									<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
									<XAxis
										dataKey="tarih"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										className="text-xs"
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										className="text-xs"
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area
										type="monotone"
										dataKey="ziyaretçiler"
										stroke="hsl(var(--chart-1))"
										fill="hsl(var(--chart-1))"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
									<Area
										type="monotone"
										dataKey="görüntülemeler"
										stroke="hsl(var(--chart-2))"
										fill="hsl(var(--chart-2))"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</AreaChart>
							</ChartContainer>
						) : (
							<div className="flex h-[300px] items-center justify-center text-muted-foreground">
								<p>Henüz veri yok</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Top Pages Chart */}
				<Card className="border-border/50 shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							En Çok Görüntülenen Sayfalar
						</CardTitle>
						<CardDescription>Top 5 sayfa performansı</CardDescription>
					</CardHeader>
					<CardContent>
						{topPagesData.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[300px]">
								<BarChart data={topPagesData} layout="vertical">
									<CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
									<XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
									<YAxis
										type="category"
										dataKey="sayfa"
										tickLine={false}
										axisLine={false}
										width={80}
										className="text-xs"
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="görüntüleme"
										fill="hsl(var(--chart-2))"
										radius={[0, 4, 4, 0]}
									/>
								</BarChart>
							</ChartContainer>
						) : (
							<div className="flex h-[300px] items-center justify-center text-muted-foreground">
								<p>Henüz veri yok</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Conversion Metrics */}
			{dashboard.conversion && dashboard.conversion.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{dashboard.conversion.map((conv: any, index: number) => (
						<Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
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

			{/* Detailed Tables Row */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Top Pages Table */}
				<Card className="border-border/50 shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							En Çok Görüntülenen Sayfalar
						</CardTitle>
						<CardDescription>Detaylı sayfa istatistikleri</CardDescription>
					</CardHeader>
					<CardContent>
						{dashboard.topPages && dashboard.topPages.length > 0 ? (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Sayfa</TableHead>
											<TableHead className="text-right">Görüntüleme</TableHead>
											<TableHead className="text-right">Benzersiz Ziyaretçi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{dashboard.topPages.slice(0, 10).map((page: any, index: number) => (
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

				{/* Daily Stats Table */}
				<Card className="border-border/50 shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Günlük İstatistikler
						</CardTitle>
						<CardDescription>Son günlerin performans metrikleri</CardDescription>
					</CardHeader>
					<CardContent>
						{dashboard.dailyStats && dashboard.dailyStats.length > 0 ? (
							<div className="rounded-md border">
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
										{dashboard.dailyStats.slice(0, 10).reverse().map((stat: any, index: number) => (
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
													{stat.avgPagePerVisitor
														? stat.avgPagePerVisitor.toFixed(2)
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
				<Card className="border-border/50 shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="h-5 w-5" />
							İletişim Formu İstatistikleri
						</CardTitle>
						<CardDescription>Form dönüşüm metrikleri ve detayları</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{dashboard.conversion.map((conv: any, index: number) => (
								<div key={index} className="space-y-2 rounded-lg border p-4">
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

