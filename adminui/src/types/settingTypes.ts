export interface WebSetting {
    SettingId: number;
    WebsiteName: string;
    Description: string;
    Country: string;
    Email: string;
    PhoneNumber: string;
    Address1: string;
    Address2: string;
    State: string;
    City: string;
    TimeZoneOffset: string;
    TimeZoneName: string;
    Longitude: number;
    Lattitude: number;
    LogoFile?: File; // For upload
    Logo: string;
    BaseCulture: string;
    BaseCurrency: string;
    CurrencyCode: string;
    GoogleAnalyticScript: string;
    UseHttps: boolean;
    DefaultEmail: string;
    SupportEmail: string;
    SalesEmail: string;
    MarketingEmail: string;
}

export interface CspConfig {
    SupportNonce: boolean;
    Directives: Record<string, string[]>;
}

export interface ApiConfig {
    UseEncryption: boolean;
    UseObfusication: boolean;
}

export interface AppBasicSecurity {
    RequireOTP: boolean;
    RequireDeviceVerification: boolean;
    OTPExpiryTimeInMinutes: number;
    SendOTPFromEmail: boolean;
    SendOTPFromSMS: boolean;
    PasswordLength: number;
    RequireNonAlphanumeric: boolean;
    RequireUppercase: boolean;
    RequireConfirmedEmail: boolean;
}

export interface FileConfig {
    AllowFileTypes: Record<string, string[]>;
}

export interface Country {
    CountryId: number;
    Name: string;
    ISO: string;
    PhoneCode: number;
    Image: string;
}

export interface LocaleRegion {
    LocaleRegionId: number;
    CountryId: number;
    CountryName?: string;
    Culture: string;
    IsActive: boolean;
    IsDefault: boolean;
    Flag?: string;
}

export interface LocaleResource {
    LocaleResourceId: number;
    Name: string;
    Value: string;
    BaseValue?: string;
    GroupName: string;
    Culture: string;
    LocaleRegionId?: number;
}

export interface LocalizationImportRequest {
    ImportFile: File;
}

export interface SetDefaultLocaleRequest {
    LocaleRegionId: number;
    Culture: string;
}

export interface SetLanguageRequest {
    Culture: string;
}
