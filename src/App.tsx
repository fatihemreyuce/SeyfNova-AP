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
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
