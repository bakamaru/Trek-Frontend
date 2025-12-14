export interface AppUser {
    AppUserId?: number;
    IdentityUserId?: number;
    FirstName?: string;
    LastName?: string;
    UserName?: string;
    Email?: string;
    PhoneNumber?: string;
    Address?: string;
    Gender?: string;
    DOB?: string; // DateTime
    ProfilePicture?: string;
    IsActive?: boolean;
    Token?: string;
    RefreshToken?: string;
    Bio?: string;
}

export interface LoginDto {
    UserName: string;
    Password?: string;
    DeviceId?: string;
    Version?: string;
    DeviceOS?: string;
}

export interface NewUserDto {
    Email: string;
    Password?: string;
    FirstName?: string;
    LastName?: string;
    UserName?: string; // Optional in some flows, but logically needed
    PhoneNumber?: string;
    [key: string]: any;
}

export interface OtpCheck {
    Otp: string;
    Uniqueid?: string;
}

export interface ChangePhoneDto {
    Otp: string;
    PhoneNumber: string;
}

export interface ProfilePictureUpdateDto {
    IdentityUserId: number;
    ImagePath: string;
}

export interface ChangePasswordDto {
    OldPassword?: string;
    NewPassword?: string;
    ConfirmPassword?: string;
}

export interface RefreshTokenDto {
    RefreshToken: string;
}

export interface EmailOtp {
    Email: string;
}

export interface PhoneDto {
    PhoneNumber: string;
}

export interface TokenResponseDto {
    AccessToken: string;
    RefreshToken: string;
    Error?: string;
    ErrorDescription?: string;
    ExpiresIn?: number;
}
