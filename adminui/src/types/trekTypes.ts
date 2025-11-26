export interface AccessibilitySaveRequest {
    accessibilityId?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
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
    productType: string;
    productId?: number;
    adult?: number;
    children?: number;
    preferedStartDate?: string | null;
    arrivalDate?: string | null;
    departureDate?: string | null;
    firstName: string;
    middleName?: string;
    lastName?: string;
    gender?: string;
    dob?: string | null;
    nationality?: string;
    email?: string;
    homePhoneNumber?: string;
    workPhoneNumber?: string;
    modeOfPayment?: string;
    paymentReference?: string;
    totalAmount?: number;
    flightName?: string;
    flightNumber?: string;
    airportPickUp?: boolean;
    specialRequest?: string;
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
