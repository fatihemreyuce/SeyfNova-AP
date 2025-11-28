import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { useSidebar } from "@/contexts/sidebar-context";
import { LayoutDashboard, LogOut, FileText, BarChart3, Briefcase, Image as ImageIcon, Handshake, FolderTree, Award, Newspaper, Bell, Users, Info, Settings, FileCheck, MessageSquare, PanelLeftClose, PanelLeftOpen, HelpCircle } from "lucide-react";

interface NavItem {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	end?: boolean;
}

const navigationItems: NavItem[] = [
	{
		to: "/",
		label: "Kontrol Paneli",
		icon: LayoutDashboard,
		end: true,
	},
	{
		to: "/homepage-about",
		label: "Ana Sayfa Hakkında",
		icon: FileText,
		end: false,
	},
	{
		to: "/service-stats",
		label: "Hizmet İstatistikleri",
		icon: BarChart3,
		end: false,
	},
	{
		to: "/service",
		label: "Hizmetler",
		icon: Briefcase,
		end: false,
	},
	{
		to: "/service-category",
		label: "Hizmet Kategorileri",
		icon: FolderTree,
		end: false,
	},
	{
		to: "/slider",
		label: "Sliderlar",
		icon: ImageIcon,
		end: false,
	},
	{
		to: "/partner",
		label: "Ortaklar",
		icon: Handshake,
		end: false,
	},
	{
		to: "/reference",
		label: "Referanslar",
		icon: Award,
		end: false,
	},
	{
		to: "/circular",
		label: "Genelgeler",
		icon: Newspaper,
		end: false,
	},
	{
		to: "/notification",
		label: "Bildirimler",
		icon: Bell,
		end: false,
	},
	{
		to: "/notification-subscriber",
		label: "Aboneler",
		icon: Users,
		end: false,
	},
	{
		to: "/useful-information",
		label: "Faydalı Bilgiler",
		icon: Info,
		end: false,
	},
	{
		to: "/official-page",
		label: "Resmi Sayfa",
		icon: FileCheck,
		end: false,
	},
	{
		to: "/contact",
		label: "İletişim Mesajları",
		icon: MessageSquare,
		end: false,
	},
	{
		to: "/faq",
		label: "SSS",
		icon: HelpCircle,
		end: false,
	},
	{
		to: "/settings",
		label: "Ayarlar",
		icon: Settings,
		end: false,
	},
];

export default function Sidebar() {
	const { logout, isActionable, isLoading } = useLoginState();
	const navigate = useNavigate();
	const { isOpen, toggleSidebar, setIsOpen } = useSidebar();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch {
			// noop
		}
	};

	return (
		<>
			{/* Toggle Button - Mobile only, outside sidebar when closed */}
			{!isOpen && (
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
					className="fixed left-4 top-4 z-40 h-10 w-10 rounded-lg bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg hover:bg-accent transition-all duration-300 md:hidden"
					aria-label="Sidebar'ı aç"
				>
					<PanelLeftOpen className="h-5 w-5" />
				</Button>
			)}

			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
					onClick={() => setIsOpen(false)}
					aria-hidden="true"
				/>
			)}

			<aside
				className={`fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg transition-all duration-300 ${
					isOpen
						? "w-64 translate-x-0"
						: "-translate-x-full md:translate-x-0 md:w-16"
				}`}
			>
			{/* Decorative gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
			
			{/* Header */}
			<div className={`relative flex h-16 items-center border-b border-border/50 bg-background/50 transition-all duration-300 ${
				isOpen ? "px-3 md:px-4 justify-between" : "px-2 flex-col justify-center gap-1"
			}`}>
				{/* Logo and Title */}
				<div className={`flex items-center gap-2 md:gap-3 min-w-0 transition-all duration-300 ${
					isOpen ? "flex-1" : "flex-shrink-0 justify-center w-full"
				}`}>
					<div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
						<span className="text-xs md:text-sm font-bold text-primary-foreground">SN</span>
					</div>
					<span className={`font-semibold text-foreground whitespace-nowrap transition-all duration-300 ${
						isOpen ? "opacity-100 max-w-full text-base md:text-lg" : "opacity-0 w-0 overflow-hidden max-w-0"
					}`}>
						Seyf Nova
					</span>
				</div>

				{/* Toggle Button - Desktop always visible, mobile visible when sidebar is open */}
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
					className={`rounded-lg hover:bg-accent/80 transition-all duration-300 flex-shrink-0 ${
						isOpen ? "h-8 w-8 flex md:flex" : "h-7 w-7 hidden md:flex"
					}`}
					aria-label={isOpen ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
					title={isOpen ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
				>
					{isOpen ? (
						<PanelLeftClose className={`text-muted-foreground hover:text-foreground ${
							isOpen ? "h-4 w-4" : "h-3.5 w-3.5"
						}`} />
					) : (
						<PanelLeftOpen className={`text-muted-foreground hover:text-foreground ${
							isOpen ? "h-4 w-4" : "h-3.5 w-3.5"
						}`} />
					)}
				</Button>
			</div>

			{/* Navigation */}
			<nav className={`relative flex flex-col gap-1 mt-2 transition-all duration-300 ${
				isOpen ? "p-4" : "p-2"
			}`}>
				{navigationItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`group relative flex items-center rounded-lg text-sm font-medium transition-all duration-300 ${
									isOpen 
										? `gap-3 px-4 py-2.5 ${
												isActive
													? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
													: "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground hover:translate-x-1"
											}`
										: `justify-center p-2 ${
												isActive
													? "bg-primary text-primary-foreground shadow-md"
													: "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground"
											}`
								}`
							}
							title={!isOpen ? item.label : undefined}
						>
							{({ isActive }) => (
								<>
									{/* Active indicator - only when open */}
									{isActive && isOpen && (
										<div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary-foreground/50" />
									)}
									<Icon className={`transition-transform duration-300 flex-shrink-0 ${
										isOpen ? "h-4 w-4" : "h-5 w-5"
									} ${
										isActive ? "scale-110" : "group-hover:scale-110"
									}`} />
									<span className={`relative z-10 transition-opacity duration-300 whitespace-nowrap ${
										isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
									}`}>
										{item.label}
									</span>
									
									{/* Hover glow effect - only when open */}
									{!isActive && isOpen && (
										<div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
									)}
								</>
							)}
						</NavLink>
					);
				})}
			</nav>

			{/* Footer with dark mode toggle and logout */}
			<div className={`absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 ${
				isOpen ? "p-4 space-y-2" : "p-2 space-y-2"
			}`}>
				{/* Dark Mode Toggle */}
				<div className={`flex items-center transition-all duration-300 ${
					isOpen ? "justify-start" : "justify-center"
				}`}>
					<DarkModeToggle />
				</div>

				{/* Logout Button */}
				<Button
					variant="ghost"
					onClick={handleLogout}
					disabled={!isActionable || isLoading}
					className={`group text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 ${
						isOpen 
							? "w-full justify-start gap-3 px-4 py-2.5 hover:translate-x-1" 
							: "w-full justify-center p-2"
					}`}
					aria-busy={isLoading}
					title={!isOpen ? "Çıkış" : undefined}
				>
					<LogOut className={`transition-transform duration-300 group-hover:rotate-12 flex-shrink-0 ${
						isOpen ? "h-4 w-4" : "h-5 w-5"
					}`} />
					<span className={`transition-opacity duration-300 whitespace-nowrap ${
						isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
					}`}>
						{isLoading ? "Çıkış yapılıyor..." : "Çıkış"}
					</span>
				</Button>
			</div>
		</aside>
		</>
	);
}