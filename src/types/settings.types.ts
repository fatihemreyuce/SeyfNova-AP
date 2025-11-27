export interface SettingsRequest {
    phoneNumber: string;
    email: string;
    instagramUrl: string;
    linkedinUrl: string;
    address: string;
    pvivacyText: string;
    privacyPolicy: string;
    contactFromText: string;
    cookiePolicy: string;
    siteLogo?: File;
}

export interface SettingsResponse {
    id: number;
    phoneNumber: string;
    email: string;
    instagramUrl: string;
    linkedinUrl: string;
    address: string;
    pvivacyText: string;
    privacyPolicy: string;
    contactFromText: string;
    cookiePolicy: string;
    siteLogoUrl: string;
    createdAt: string;
    updatedAt: string;
}