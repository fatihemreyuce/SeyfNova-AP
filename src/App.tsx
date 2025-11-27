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
import ServiceCategoryListPage from "./pages/service-category/service-category-list-page";
import ServiceCategoryCreatePage from "./pages/service-category/service-category-create-page";
import ServiceCategoryEditPage from "./pages/service-category/service-category-edit-page";
import ServiceCategoryDetailPage from "./pages/service-category/service-category-detail-page";
import ReferenceListPage from "./pages/reference/reference-list-page";
import ReferenceCreatePage from "./pages/reference/reference-create-page";
import ReferenceEditPage from "./pages/reference/reference-edit-page";
import ReferenceDetailPage from "./pages/reference/reference-detail-page";
import CircularListPage from "./pages/circular/circular-list-page";
import CircularCreatePage from "./pages/circular/circular-create-page";
import CircularEditPage from "./pages/circular/circular-edit-page";
import CircularDetailPage from "./pages/circular/circular-detail-page";
import NotificationListPage from "./pages/notification/notification-list-page";
import NotificationCreatePage from "./pages/notification/notification-create-page";
import NotificationEditPage from "./pages/notification/notification-edit-page";
import NotificationDetailPage from "./pages/notification/notification-detail-page";
import NotificationSubscriberListPage from "./pages/notification-subscriber/notification-subscriber-list-page";
import NotificationSubscriberCreatePage from "./pages/notification-subscriber/notification-subscriber-create-page";
import NotificationSubscriberDetailPage from "./pages/notification-subscriber/notification-subscriber-detail-page";
import UsefulInformationListPage from "./pages/useful-information/useful-information-list-page";
import UsefulInformationCreatePage from "./pages/useful-information/useful-information-create-page";
import UsefulInformationEditPage from "./pages/useful-information/useful-information-edit-page";
import UsefulInformationDetailPage from "./pages/useful-information/useful-information-detail-page";
import SettingsListPage from "./pages/settings/settings-list-page";
import SettingsCreatePage from "./pages/settings/settings-create-page";
import SettingsEditPage from "./pages/settings/settings-edit-page";
import SettingsDetailPage from "./pages/settings/settings-detail-page";
import OfficialPageDetailPage from "./pages/official-page/official-page-detail-page";
import OfficialPageEditPage from "./pages/official-page/official-page-edit-page";
import ContactListPage from "./pages/contact/contact-list-page";
import ContactCreatePage from "./pages/contact/contact-create-page";
import ContactDetailPage from "./pages/contact/contact-detail-page";


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
								{/* Service Category Routes */}
								<Route path="/service-category/create" element={<ServiceCategoryCreatePage />} />
								<Route path="/service-category/edit/:id" element={<ServiceCategoryEditPage />} />
								<Route path="/service-category" element={<ServiceCategoryListPage />} />
								<Route path="/service-category/:id" element={<ServiceCategoryDetailPage />} />
								{/* Reference Routes */}
								<Route path="/reference/create" element={<ReferenceCreatePage />} />
								<Route path="/reference/edit/:id" element={<ReferenceEditPage />} />
								<Route path="/reference" element={<ReferenceListPage />} />
								<Route path="/reference/:id" element={<ReferenceDetailPage />} />
								{/* Circular Routes */}
								<Route path="/circular/create" element={<CircularCreatePage />} />
								<Route path="/circular/edit/:id" element={<CircularEditPage />} />
								<Route path="/circular" element={<CircularListPage />} />
								<Route path="/circular/:id" element={<CircularDetailPage />} />
								{/* Notification Routes */}
								<Route path="/notification/create" element={<NotificationCreatePage />} />
								<Route path="/notification/edit/:id" element={<NotificationEditPage />} />
								<Route path="/notification" element={<NotificationListPage />} />
								<Route path="/notification/:id" element={<NotificationDetailPage />} />
								{/* Notification Subscriber Routes */}
								<Route path="/notification-subscriber/create" element={<NotificationSubscriberCreatePage />} />
								<Route path="/notification-subscriber" element={<NotificationSubscriberListPage />} />
								<Route path="/notification-subscriber/:id" element={<NotificationSubscriberDetailPage />} />
								{/* Useful Information Routes */}
								<Route path="/useful-information/create" element={<UsefulInformationCreatePage />} />
								<Route path="/useful-information/edit/:id" element={<UsefulInformationEditPage />} />
								<Route path="/useful-information" element={<UsefulInformationListPage />} />
								<Route path="/useful-information/:id" element={<UsefulInformationDetailPage />} />
								{/* Settings Routes */}
								<Route path="/settings/create" element={<SettingsCreatePage />} />
								<Route path="/settings/edit/:id" element={<SettingsEditPage />} />
								<Route path="/settings" element={<SettingsListPage />} />
								<Route path="/settings/:id" element={<SettingsDetailPage />} />
								{/* Official Page Routes */}
								<Route path="/official-page/edit" element={<OfficialPageEditPage />} />
								<Route path="/official-page" element={<OfficialPageDetailPage />} />
								{/* Contact Routes */}
								<Route path="/contact/create" element={<ContactCreatePage />} />
								<Route path="/contact/:id" element={<ContactDetailPage />} />
								<Route path="/contact" element={<ContactListPage />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
