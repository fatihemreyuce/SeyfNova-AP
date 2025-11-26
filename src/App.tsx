import { LoginProvider } from "./providers/login-state-provider";
import QueryProvider from "./providers/query-client-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./providers/protected-route";
import AdminLayout from "./components/admin-layout";
import LoginPage from "./pages/login/login-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import HomepageAboutListPage from "./pages/homepage-about/homepage-about-list-page";
import HomepageAboutCreatePage from "./pages/homepage-about/homepage-about-create-page";
import HomepageAboutEditPage from "./pages/homepage-about/homepage-about-edit-page";
import HomepageAboutDetailPage from "./pages/homepage-about/homepage-about-detail-page";
import ServiceStatsListPage from "./pages/service-stats/service-stats-list-page";
import ServiceStatsCreatePage from "./pages/service-stats/service-stats-create-page";
import ServiceStatsEditPage from "./pages/service-stats/service-stats-edit-page";
import ServiceStatsDetailPage from "./pages/service-stats/service-stats-detail-page";
import ServiceListPage from "./pages/service/service-list-page";
import ServiceCreatePage from "./pages/service/service-create-page";
import ServiceEditPage from "./pages/service/service-edit-page";
import ServiceDetailPage from "./pages/service/service-detail-page";
import SliderListPage from "./pages/slider/slider-list-page";
import SliderCreatePage from "./pages/slider/slider-create-page";
import SliderEditPage from "./pages/slider/slider-edit-page";
import SliderDetailPage from "./pages/slider/slider-detail-page";
import PartnerListPage from "./pages/partner/partner-list-page";
import PartnerCreatePage from "./pages/partner/partner-create-page";
import PartnerEditPage from "./pages/partner/partner-edit-page";
import PartnerDetailPage from "./pages/partner/partner-detail-page";
import FaqListPage from "./pages/faq/faq-list-page";
import FaqCreatePage from "./pages/faq/faq-create-page";
import FaqEditPage from "./pages/faq/faq-edit-page";
import FaqDetailPage from "./pages/faq/faq-detail-page";


function App() {
	return (
		<QueryProvider>
			<LoginProvider>
				<BrowserRouter>
					<Toaster />
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/" element={<ProtectedRoute />}>
							<Route path="/" element={<AdminLayout />}>
								<Route path="/" element={<DashboardPage />} />
								{/* Homepage About Routes */}
								<Route path="/homepage-about/create" element={<HomepageAboutCreatePage />} />
								<Route path="/homepage-about/edit/:id" element={<HomepageAboutEditPage />} />
								<Route path="/homepage-about/:id" element={<HomepageAboutDetailPage />} />
								<Route path="/homepage-about" element={<HomepageAboutListPage />} />
								{/* Service Stats Routes */}
								<Route path="/service-stats/create" element={<ServiceStatsCreatePage />} />
								<Route path="/service-stats/edit/:id" element={<ServiceStatsEditPage />} />
								<Route path="/service-stats/:id" element={<ServiceStatsDetailPage />} />
								<Route path="/service-stats" element={<ServiceStatsListPage />} />
								{/* Service Routes */}
								<Route path="/service/create" element={<ServiceCreatePage />} />
								<Route path="/service/edit/:id" element={<ServiceEditPage />} />
								<Route path="/service/:id" element={<ServiceDetailPage />} />
								<Route path="/service" element={<ServiceListPage />} />
								{/* Slider Routes */}
								<Route path="/slider/create" element={<SliderCreatePage />} />
								<Route path="/slider/edit/:id" element={<SliderEditPage />} />
								<Route path="/slider/:id" element={<SliderDetailPage />} />
								<Route path="/slider" element={<SliderListPage />} />
								{/* Partner Routes */}
								<Route path="/partner/create" element={<PartnerCreatePage />} />
								<Route path="/partner/edit/:id" element={<PartnerEditPage />} />
								<Route path="/partner/:id" element={<PartnerDetailPage />} />
								<Route path="/partner" element={<PartnerListPage />} />
								{/* FAQ Routes */}
								<Route path="/faq/create" element={<FaqCreatePage />} />
								<Route path="/faq/edit/:id" element={<FaqEditPage />} />
								<Route path="/faq/:id" element={<FaqDetailPage />} />
								<Route path="/faq" element={<FaqListPage />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
