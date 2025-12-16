
export interface TrekCategorySaveRequest {
    trekCategoryId: number; // 0 or missing/0 => insert, >0 => update
    name: string;
    description: string;
    isActive: boolean;
}

export interface TrekCategory {
    trekCategoryId: number;
    name: string;
    description: string;
    isActive: boolean;
    // add more if you ever need audit fields on FE:
    // isDeleted: boolean;
    // addedOn: string;
    // ...
}

export interface TrekRegionSaveRequest {
    trekRegionId: number;
    name: string;
    description: string;
    isActive: boolean;
}

export interface TrekRegion {
    trekRegionId: number;
    name: string;
    description: string;
    isActive: boolean;
}
export interface AccessibilitySaveRequest {
    accessibilityId?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
    accessibilityLevelId?: number; // Added to match DTO if needed later or remove if strict
}

export interface ActivityLevelSaveRequest {
    activityLevelId?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface ActivityTypeSaveRequest {
    activityTypeId?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface BookingBasicSaveRequest {
    bookingId?: number;
    userId?: number;
    trekId?: number;
    trekDepartureId?: number;
    productType: string;
    productId?: number;
    adult?: number;
    children?: number;
    preferedStartDate?: string | null;
    arrivalDate?: string | null;
    departureDate?: string | null;
    bookingDate?: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    gender?: string;
    dob?: string | null;
    nationality?: string;
    email?: string;
    homePhoneNumber?: string;
    workPhoneNumber?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    modeOfPayment?: string;
    paymentReference?: string;
    totalAmount?: number;
    currency?: string;
    flightName?: string;
    flightNumber?: string;
    airportPickUp?: boolean;
    specialRequest?: string;
    specialRequests?: string;
    bookingStatus?: string;
}

export interface BookingChangeStatusRequest {
    bookingId?: number;
    newStatus: string;
    cancelReason?: string;
}

export interface BookingChangeTravelDateRequest {
    bookingId?: number;
    preferedStartDate?: string | null;
    arrivalDate?: string | null;
    departureDate?: string | null;
}

export interface BookingEmergencyContactSaveRequest {
    emergencyContactId?: number;
    bookingId?: number;
    firstName: string;
    middleName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    relationShip?: string;
    email?: string;
    homePhoneNumber?: string;
    personalNumber?: string;
}

export interface BookingHealthInfoSaveRequest {
    bookingHealthInfoId?: number;
    bookingTravellerId?: number;
    medicalConditions?: string;
    allergies?: string;
    fitnessLevel?: string;
    insuranceProvider?: string;
    insurancePolicyNo?: string;
    emergencyNotes?: string;
}

export interface BookingTravellerSaveRequest {
    bookingTravellerId?: number;
    bookingId?: number;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dob?: string | null;
    nationality?: string;
    passportNumber?: string;
    passportIssuedDate?: string | null;
    passportExpiryDate?: string | null;
    travellerType: string;
}

export interface BookingDetail {
    BookingId?: number;
    BookingStatus?: string;
    PaymentStatus?: string;
    ProductType?: string;
    ProductId?: number;
    ProductName?: string;
    TrekName?: string;
    ContactName?: string;
    ContactEmail?: string;
    ContactPhone?: string;
    StartDate?: string;
    EndDate?: string;
    Adults?: number;
    Children?: number;
    TotalAmount?: number;
    PaidAmount?: number;
    DueAmount?: number;
    BookingDate?: string;
    SpecialRequest?: string;
    CancellationReason?: string;
}


export interface CitySaveRequest {
    cityId?: number;
    countryId?: number;
    name?: string;
    stateProvince?: string;
    latitude?: number;
    longitude?: number;
    isSystem?: boolean;
    isActive?: boolean;
}

export interface CurrencySaveRequest {
    currencyId?: number;
    code?: string;
    name?: string;
    symbol?: string;
    decimalPlaces?: number;
    isSystem?: boolean;
    isActive?: boolean;
}

export interface EquipmentCategorySaveRequest {
    equipmentCategoryId?: number;
    name?: string;
    description?: string;
    tag?: string;
    isActive?: boolean;
}

export interface EquipmentSaveRequest {
    equipmentId?: number;
    equipmentCategoryId?: number;
    name?: string;
    description?: string;
    tag?: string;
    isActive?: boolean;
}

export interface InExServiceSaveRequest {
    inExServiceId?: number;
    name?: string;
    description?: string;
    isIncluded?: boolean;
    isActive?: boolean;
}

export interface ItinerarySaveRequest {
    itineraryId?: number;
    dayNumber?: number;
    dayTitle?: string;
    startLocation?: string;
    overnightLocation?: string;
    startLocationId?: number;
    endLocationId?: number;
    trekTimeHours?: number;
    trekDistanceKM?: number;
    transportMethod?: string;
    accommodationType?: string;
    mealsIncluded?: string;
    dailyActivityDetails?: string;
}

export interface PermitSaveRequest {
    permitId?: number;
    permitName?: string;
    fullPermitName?: string;
    costNPR?: number;
    costUSD?: number;
    requiredDocument?: string;
    agencyHandles?: boolean;
    agencyContactNo?: string;
    agencyContactPerson?: string;
    agencyContantEmail?: string;
}

export interface TourTypeSaveRequest {
    tourTypeId?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface TrekBasicSaveRequest {
    trekId?: number;
    trekCategoryId?: number;
    trekRegionId?: number;
    name?: string;
    url?: string;
    description?: string;
    activityTypeId?: number;
    activityLevelId?: number;
    durationDays?: number;
    priceInUSD?: number;
    priceInNrs?: number;
    maxAltitudeMeters?: number;
    maxAltitudeFeet?: number;
    startingPoint?: string;
    endingPoint?: string;
    overviewDescription?: string;
    baseAccommodationType?: string;
    startCityId?: number;
    endCityId?: number;
    defaultCurrencyId?: number;
    trekMap?: string;
    isVerified?: boolean;
    isSystem?: boolean;
    isActive?: boolean;
}

export interface TrekDepartureSaveRequest {
    trekDepartureId?: number;
    startDate?: string;
    endDate?: string;
    seatsTotal?: number;
    seatsSold?: number;
    basePrice?: number;
    currencyId?: number;
    closed?: boolean;
}

export interface TrekFAQSaveRequest {
    trekFAQId?: number;
    category?: string;
    question?: string;
    solution?: string;
    priority?: number;
}

export interface TrekGuideSaveRequest {
    trekAvailableGuideId?: number;
    guideId?: number;
    isRecommended?: boolean;
}

export interface TrekHighLightSaveRequest {
    trekHighLightId?: number;
    description?: string;
    displayOrder?: number;
}

export interface TrekImageSaveRequest {
    trekImageId?: number;
    imagePath?: string;
    isLandscape?: boolean;
    isBannerType?: boolean;
    isVertical?: boolean;
}

export interface TrekInclusionExclusionSaveRequest {
    trekInclusionExclusionId?: number;
    description?: string;
    isIncluded?: boolean;
    isOptional?: boolean;
    optionalCostDetails?: string;
}

export interface TrekRecommendedSessionSaveRequest {
    trekRecommendedSessionId?: number;
    trekSessionId?: number;
}

export interface TrekReviewSaveRequest {
    trekReviewId?: number;
    star?: number;
    review?: string;
    reviewedByName?: string;
    isApproved?: boolean;
}

export interface TrekWhyUsSaveRequest {
    trekWhyUsId?: number;
    description?: string;
    displayOrder?: number;
}

// Common params
export interface PaginationParams {
    offset?: number;
    limit?: number;
    query?: string;
}

export interface ApiResponse<T> {
    Code: number;
    Message: string;
    Data: T;
    Errors: string[];
}

export interface TrekImageDto {
    TrekImageId: number;
    TrekId: number;
    ImagePath: string;
    IsLandscape: boolean;
    IsBannerType: boolean;
    IsVertical: boolean;
}

export interface ItineraryDto {
    ItineraryId: number;
    TrekId: number;
    DayNumber: number;
    DayTitle: string;
    StartLocation: string;
    OvernightLocation: string;
    TrekTimeHours: number;
    TrekDistanceKM: number;
    TransportMethod: string;
    AccommodationType: string;
    MealsIncluded: string;
    DailyActivityDetails: string;
}

export interface TrekInclusionExclusionDto {
    TrekInclusionExclusionId: number;
    TrekId: number;
    Description: string;
    IsIncluded: boolean;
    IsOptional: boolean;
    OptionalCostDetails: string;
}

export interface TrekHighLightDto {
    TrekHighLightId: number;
    TrekId: number;
    Description: string;
    DisplayOrder: number;
}

export interface TrekWhyUsDto {
    TrekWhyUsId: number;
    TrekId: number;
    Description: string;
    DisplayOrder: number;
}

export interface TrekRecommendedSessionDto {
    TrekRecommendedSessionId: number;
    SessionName: string;
}

export interface TrekFAQDto {
    TrekFAQId: number;
    TrekId: number;
    Category: string;
    Question: string;
    Solution: string;
    Priority: number;
}

export interface TrekReviewDto {
    TrekReviewId: number;
    TrekId: number;
    Star: number;
    Review: string;
    ReviewedByName: string;
    // Date not in JSON example but implied by previous interface, keeping simplified if unsure or removing if mismatch. 
    // JSON had "IsApproved": true. 
    IsApproved: boolean;
}

export interface TrekDepartureDto {
    TrekDepartureId: number;
    StartDate: string;
    EndDate: string;
    SeatsTotal: number;
    SeatsSold: number;
    BasePrice: number;
    CurrencyCode: string; // Not in JSON example but inferred or keeping generic
}

export interface TrekGuideDto {
    TrekGuideId: number;
    GuideName: string;
    IsRecommended: boolean;
}

export interface TrekDetailDto {
    TrekId: number;
    TrekCategoryId: number;
    TrekRegionId: number;
    TrekCategoryName: string;
    TrekRegionName: string;
    Name: string;
    Url: string;
    Description: string;
    ActivityTypeId: number;
    ActivityLevelId: number;
    DurationDays: number;
    PriceInUSD: number;
    PriceInNrs: number;
    MaxAltitudeMeters: number;
    MaxAltitudeFeet: number;
    StartingPoint: string;
    EndingPoint: string;
    OverviewDescription: string;
    BaseAccommodationType: string;
    StartCityId: number;
    EndCityId: number;
    DefaultCurrencyId: number;
    TrekMap: string;
    IsVerified: boolean;
    IsSystem: boolean;
    IsActive: boolean;
    Gallery: TrekImageDto[];
    Itineraries: ItineraryDto[];
    InclusionsExclusions: TrekInclusionExclusionDto[];
    Highlights: TrekHighLightDto[];
    WhyUs: TrekWhyUsDto[];
    RecommendedSessions: TrekRecommendedSessionDto[];
    Faqs: TrekFAQDto[];
    Reviews: TrekReviewDto[];
    Departures: TrekDepartureDto[];
    Guides: TrekGuideDto[];
}
