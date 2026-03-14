import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import { trekAPI, useGetTrekDetailByUrlQuery } from '../redux/api/trekAPI';
import { bookingAPI, useOpenUserBookingMutation } from '../redux/api/bookingAPI';
import { useGetAllCountriesQuery } from '../redux/api/miscAPI';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';

// import Input from '../components/form/input/InputField';
import { UserBookingOpenRequest, BookingTravellerDto, LeadCustomerDto } from '../redux/api/bookingAPI';
import { toast } from 'react-toastify'; // Assuming react-toastify is available or use alert
import { getCDNUrl } from '../utils/helpers';

// Local Input Component to match specific design requirements
const BookingInput = ({ labelName, error, errorMsg, className, ...props }: any) => (
    <div className="w-full">
        {labelName && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{labelName}</label>}
        <input
            className={`mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} ${className || ''}`}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
    </div>
);

// Phone Input Component using Controller
const BookingPhoneInput = ({ control, name, labelName, rules, error, errorMsg, className }: any) => (
    <div className="w-full">
        {labelName && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{labelName}</label>}
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <PhoneInput
                    international
                    defaultCountry="US"
                    value={value}
                    onChange={onChange}
                    className={`mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-700 focus-within:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none ${error ? 'border-red-500 focus-within:border-red-500' : 'border-gray-300'} ${className || ''}`}
                />
            )}
        />
        {error && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
    </div>
);

// React Select Component using Controller
const BookingSelect = ({ control, name, labelName, options, rules, error, errorMsg, className, placeholder }: any) => (
    <div className="w-full">
        {labelName && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{labelName}</label>}
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value, ref } }) => (
                <Select
                    ref={ref}
                    options={options}
                    value={options.find((c: any) => c.value === value) || null}
                    onChange={(val: any) => onChange(val?.value)}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    className={`mt-1 block w-full text-gray-900 ${className || ''}`}
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            borderColor: error ? '#ef4444' : (state.isFocused ? '#1d4ed8' : '#d1d5db'),
                            boxShadow: state.isFocused ? (error ? '0 0 0 1px #ef4444' : '0 0 0 1px #1d4ed8') : 'none',
                            '&:hover': {
                                borderColor: error ? '#ef4444' : (state.isFocused ? '#1d4ed8' : '#9ca3af')
                            },
                            padding: '2px',
                            backgroundColor: state.isDisabled ? '#f3f4f6' : 'white',
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 9999
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#1d4ed8' : (state.isFocused ? '#bfdbfe' : 'white'),
                            color: state.isSelected ? 'white' : 'black',
                        })
                    }}
                />
            )}
        />
        {error && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
    </div>
);


interface ConfirmationProps {
    bookingId: string | number;
    email: string;
    trekName?: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({ bookingId, email, trekName }) => {
    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-900">
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg">
                        <div className="w-24 h-24 bg-green-100 text-green-600 text-5xl rounded-full flex items-center justify-center mx-auto mb-6">
                            ✓
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">Booking Confirmed!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Thank you for booking <strong>{trekName}</strong> with Territory Himalayas. Your adventure awaits! A confirmation email with all your trip details has been sent to <strong>{email}</strong>.
                        </p>
                        <div className="text-left bg-gray-50 dark:bg-gray-700 p-6 rounded-md border dark:border-gray-600 mb-8">
                            <h3 className="text-xl font-bold dark:text-gray-200 mb-4">Next Steps</h3>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p><strong>Booking ID:</strong> {bookingId}</p>
                                <p>Please check your email for the complete itinerary and important travel documents.</p>
                            </div>
                        </div>
                        <a href="/" className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                            Back to Home
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

const Booking: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: trekData, isLoading: isTrekLoading, error: trekError } = useGetTrekDetailByUrlQuery(slug || '', {
        skip: !slug
    });

    // Fetch Countries
    const { data: countryData } = useGetAllCountriesQuery({});

    // Memoize country options and lookup map for easier syncing
    const { countryOptions, countryLookup } = useMemo(() => {
        if (!countryData || !countryData.Data) return { countryOptions: [], countryLookup: {} };

        const options = countryData.Data.map((c: any) => ({
            label: c.Name,
            value: c.ISO // Using ISO (e.g. "AF") as value for compatibility
        }));

        // Map ISO -> Full Country Object for quick access
        const lookup: Record<string, any> = {};
        countryData.Data.forEach((c: any) => {
            if (c.ISO) lookup[c.ISO] = c;
        });

        return { countryOptions: options, countryLookup: lookup };
    }, [countryData]);


    const trek = trekData?.Data;

    const [openBooking, { isLoading: isSubmitting }] = useOpenUserBookingMutation();

    const [currentStep, setCurrentStep] = useState(0);
    const [fromReview, setFromReview] = useState(false); // Track if editing from review
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

    // Form setup
    const { register, control, handleSubmit, watch, setValue, getValues, trigger, formState: { errors } } = useForm<UserBookingOpenRequest>({
        defaultValues: {
            Product: {
                ProductType: 'Trek',
                Name: trek?.Name,
                ProductId: trek?.Id,
                AdultCount: 1,
                ChildrenCount: 0,
                PreferedStartDate: new Date().toISOString().split('T')[0],
                DurationDays: trek?.DurationDays
            },
            Travellers: [],
            LeadCustomer: {
                FirstName: '',
                LastName: '',
                Email: '',
                Phone: '',
                Nationality: '',
                PassportNumber: ''
            },
            EmergencyContact: {
                FirstName: '',
                LastName: '',
                RelationShip: '',
                PersonalNumber: '',
                Email: ''
            } as any,
            Pricing: {
                CurrencyCode: 'USD',
                CurrencyId: 1 // Default
            } as any
        },
        mode: 'onChange' // Changed from onBlur to onChange for better Select validation feedback
    });

    const { fields: travelerFields, replace: replaceTravelers, remove: removeTraveler } = useFieldArray({
        control,
        name: "Travellers"
    });

    // Watchers for calculations & sync
    const adultCount = watch("Product.AdultCount");
    const childrenCount = watch("Product.ChildrenCount");
    const startDate = watch("Product.PreferedStartDate");

    const watchedNationality = watch("LeadCustomer.Nationality");
    const watchedPhone = watch("LeadCustomer.Phone");

    // Sync Logic: Nationality -> Phone Context
    useEffect(() => {
        if (watchedNationality) {
            // Find the country object using the selected ISO (watchedNationality)
            const countryObj = countryLookup[watchedNationality];

            if (countryObj && countryObj.PhoneCode) {
                // Check if current phone matches this country calling code
                // Ideally we only update if the phone is empty or has a different international code
                // But simply forcing it to start with the new code is safer for "on selection" behavior

                let shouldUpdate = true;
                if (watchedPhone) {
                    // Check existing phone number's country to avoid overwriting if user is just typing
                    // But here user explicitly changed Nationality
                    const parsed = parsePhoneNumber(watchedPhone);
                    // If parsed country ISO matches watchedNationality, we might not need to update.
                    // But if they just selected "Afghanistan", and phone is "+1...", parsed.country is "US".
                    // We want to change it to "+93".
                    if (parsed && parsed.country === watchedNationality) {
                        shouldUpdate = false;
                    }
                }

                if (shouldUpdate) {
                    setValue("LeadCustomer.Phone", `+${countryObj.PhoneCode}`);
                }
            }
        }
    }, [watchedNationality, countryLookup, setValue]); // Deliberately exclude watchedPhone

    // Sync Logic: Phone -> Nationality
    useEffect(() => {
        if (watchedPhone) {
            try {
                const parsed = parsePhoneNumber(watchedPhone);
                if (parsed && parsed.country) {
                    // parsed.country is ISO-2 (e.g. "AF")
                    // If this differs from current nationality, update it
                    if (watchedNationality !== parsed.country) {
                        // verify it exists in our options
                        if (countryLookup[parsed.country]) {
                            setValue("LeadCustomer.Nationality", parsed.country);
                        }
                    }
                }
            } catch (e) {
                // ignore
            }
        }
    }, [watchedPhone, setValue, countryLookup]); // Deliberately exclude watchedNationality

    // Initialize/Update form data when trek loads
    useEffect(() => {
        if (trek) {
            setValue("Product.ProductId", trek?.TrekId || 0);
            setValue("Product.Name", trek?.Name || '');
            setValue("Product.DurationDays", trek?.DurationDays || 0);
            setValue("Product.UrlSlug", slug || '');

            // Initial pricing
            const price = trek?.PriceInUSD || 0; // Default logic
            setValue("Pricing.AdultPricePerPerson", price);
            setValue("Pricing.ChildPricePerPerson", price); // Assuming same for now unless logic exists
        }
    }, [trek, setValue, slug]);

    // Update Travellers array when counts change
    useEffect(() => {
        const totalTravelers = (parseInt(adultCount as any) || 0) + (parseInt(childrenCount as any) || 0);

        // Use getValues to ensure we have the latest data from inputs, 
        // avoiding overwrite with stale 'fields' from render scope.
        // We fallback to empty array if undefined
        const currentTravellers = getValues("Travellers") || [];
        const currentLength = currentTravellers.length;

        if (totalTravelers > currentLength) {
            const toAdd = totalTravelers - currentLength;
            // Append new empty travelers while preserving existing ones
            // We need to use valid data structure compatible with the form type
            const newItems = Array(toAdd).fill({
                FirstName: '', LastName: '', Gender: 'Male', Nationality: '', TravellerType: 'Adult'
            });
            const newTravelers = [...currentTravellers, ...newItems];

            // We use replace to update the field array
            // Note: replace causes a re-render of the list
            replaceTravelers(newTravelers);
        } else if (totalTravelers < currentLength) {
            // Truncate
            replaceTravelers(currentTravellers.slice(0, totalTravelers));
        }

    }, [adultCount, childrenCount, replaceTravelers, getValues]);

    const handleRemoveTraveler = (index: number) => {
        removeTraveler(index);

        // Update counts to stay in sync
        const currentAdults = parseInt(adultCount as any) || 0;
        const currentChildren = parseInt(childrenCount as any) || 0;

        if (currentAdults > 1) {
            setValue("Product.AdultCount", currentAdults - 1);
        } else if (currentChildren > 0) {
            setValue("Product.ChildrenCount", currentChildren - 1);
        }
    };

    // Calculate Pricing
    const totalPrice = useMemo(() => {
        if (!trek) return 0;
        const ac = parseInt(adultCount as any) || 0;
        const cc = parseInt(childrenCount as any) || 0;
        const price = trek.PriceInUSD || 0;
        // Simple calculation
        return (ac + cc) * price;
    }, [trek, adultCount, childrenCount]);

    useEffect(() => {
        setValue("Pricing.Total", totalPrice);
        setValue("Pricing.Subtotal", totalPrice);
        setValue("Pricing.AdultCount", parseInt(adultCount as any) || 0);
        setValue("Pricing.ChildrenCount", parseInt(childrenCount as any) || 0);
    }, [totalPrice, setValue, adultCount, childrenCount]);


    // Step Navigation
    const nextStep = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        let fieldsToValidate: string[] = [];
        if (currentStep === 0) {
            fieldsToValidate = ['Product.PreferedStartDate', 'Product.AdultCount'];
        } else if (currentStep === 1) {
            fieldsToValidate = ['LeadCustomer.FirstName', 'LeadCustomer.LastName', 'LeadCustomer.Email', 'LeadCustomer.Phone', 'LeadCustomer.Nationality'];
        } else if (currentStep === 2) {
            // Validate all travellers
            const result = await trigger('Travellers');
            if (!result) return;
            if (fromReview) {
                setCurrentStep(4);
                setFromReview(false);
                return;
            }
            setCurrentStep(prev => prev + 1);
            return;
        } else if (currentStep === 3) {
            fieldsToValidate = ['EmergencyContact.FirstName', 'EmergencyContact.PersonalNumber', 'EmergencyContact.RelationShip'];
        }

        const isValid = await trigger(fieldsToValidate as any);
        if (isValid) {
            if (fromReview) {
                setCurrentStep(4);
                setFromReview(false);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleEditStep = (stepIndex: number) => {
        setFromReview(true);
        setCurrentStep(stepIndex);
    };

    const onSubmit: SubmitHandler<UserBookingOpenRequest> = async (data) => {
        try {
            // Prepare payload adjustments if needed
            const payload = { ...data };
            payload.Pricing.Total = totalPrice;

            const res: any = await openBooking(payload).unwrap();
            if (res.Code == 200) {
                // console.log("Booking Success", res);
                // navigate to success or payment
                toast.success("Booking sucessfully, Soon our team will contact you!");
                setConfirmedBookingData(res.Data);
                setBookingSuccess(true);
                window.scrollTo(0, 0);
            } else {
                toast.error(res.Message);
                //toast.success("Booking sucessfully,Soon our team will contact you!");
            }


        } catch (err) {
            console.error("Booking Error", err);
            toast.error("Failed to create booking.Please try again later.");
        }
    };


    if (bookingSuccess && confirmedBookingData) {
        return (
            <Confirmation
                bookingId={confirmedBookingData.BookingId || confirmedBookingData.bookingId || "N/A"}
                email={confirmedBookingData.ContactEmail || confirmedBookingData.email || getValues("LeadCustomer.Email")}
                trekName={trek?.Name}
            />
        );
    }

    if (isTrekLoading) return <div className="pt-32 text-center"><h1 className="text-xl">Loading Trek Details...</h1></div>;
    if (!trek) return <div className="pt-32 text-center"><h1 className="text-xl">Trek Not Found</h1></div>;

    const steps = [
        "Trip Details",
        "Primary Contact",
        "Traveler Info",
        "Emergency Info",
        "Review"
    ];

    // Helper for Review Section
    const ReviewSectionHeader = ({ title, onEdit }: { title: string, onEdit: () => void }) => (
        <div className="flex justify-between items-center border-b dark:border-gray-600 pb-2 mb-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h3>
            <button
                type="button"
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm font-medium transition-colors"
            >
                <FiEdit className="mr-1 w-4 h-4" /> Edit
            </button>
        </div>
    );

    return (
        <div className="pt-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <section className="py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-12">
                        Complete Your Adventure Booking
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                            {/* Stepper */}
                            <div className="flex justify-center mb-8">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={`flex items-center ${idx < steps.length - 1 ? 'w-full' : ''} last:w-auto`}>
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                                            ${idx <= currentStep ? 'bg-blue-700 border-blue-700 text-white' : 'border-gray-300 text-gray-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <span className={`ml-2 hidden sm:block ${idx <= currentStep ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>{step}</span>
                                        {idx < steps.length - 1 && (
                                            <div className={`flex-auto border-t-2 mx-4 ${idx < currentStep ? 'border-blue-700' : 'border-gray-300'}`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}
                            // onKeyDown={(e) => {
                            //     if (e.key === 'Enter') {
                            //         e.preventDefault();
                            //         e.stopPropagation();
                            //     }
                            // }}
                            >
                                {/* Step 0: Trip Details */}
                                {currentStep === 0 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold dark:text-white mb-4">Trip Itinerary & Composition</h2>
                                        <BookingInput
                                            labelName="Departure Date"
                                            type="date"
                                            {...register("Product.PreferedStartDate", { required: "Departure date is required" })}
                                            error={!!errors.Product?.PreferedStartDate}
                                            errorMsg={errors.Product?.PreferedStartDate?.message}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <BookingInput
                                                labelName="Adults"
                                                type="number"
                                                min="1"
                                                {...register("Product.AdultCount", { required: true, min: 1 })}
                                            />
                                            <BookingInput
                                                labelName="Children"
                                                type="number"
                                                min="0"
                                                {...register("Product.ChildrenCount", { min: 0 })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 1: Lead Customer */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold dark:text-white mb-4">Primary Contact Details</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <BookingInput labelName="First Name" {...register("LeadCustomer.FirstName", { required: "First Name is required" })} error={!!errors.LeadCustomer?.FirstName} errorMsg={errors.LeadCustomer?.FirstName?.message} />
                                            <BookingInput labelName="Last Name" {...register("LeadCustomer.LastName", { required: "Last Name is required" })} error={!!errors.LeadCustomer?.LastName} errorMsg={errors.LeadCustomer?.LastName?.message} />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <BookingInput labelName="Email" type="email" {...register("LeadCustomer.Email", { required: "Email is required" })} error={!!errors.LeadCustomer?.Email} errorMsg={errors.LeadCustomer?.Email?.message} />
                                            <BookingSelect
                                                name="LeadCustomer.Nationality"
                                                control={control}
                                                labelName="Nationality"
                                                options={countryOptions}
                                                placeholder="Select Nationality"
                                                rules={{ required: "Nationality is required" }}
                                                error={!!errors.LeadCustomer?.Nationality}
                                                errorMsg={errors.LeadCustomer?.Nationality?.message}
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <BookingPhoneInput
                                                control={control}
                                                name="LeadCustomer.Phone"
                                                labelName="Phone"
                                                rules={{ required: "Phone is required" }}
                                                error={!!errors.LeadCustomer?.Phone}
                                                errorMsg={errors.LeadCustomer?.Phone?.message}
                                            />
                                            <BookingInput labelName="Passport Number" {...register("LeadCustomer.PassportNumber")} />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Travelers */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold dark:text-white mb-4">Traveler Information (Total: {travelerFields.length})</h2>
                                        {travelerFields.map((field, index) => (
                                            <div key={field.id} className="p-4 border rounded-md dark:border-gray-700 mb-4 bg-gray-50 dark:bg-gray-700/50 relative">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-semibold dark:text-gray-200">Traveler {index + 1}</h3>
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTraveler(index)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                            title="Remove Traveler"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <BookingInput labelName="First Name" {...register(`Travellers.${index}.FirstName` as const, { required: true })} error={!!errors.Travellers?.[index]?.FirstName} />
                                                    <BookingInput labelName="Last Name" {...register(`Travellers.${index}.LastName` as const, { required: true })} error={!!errors.Travellers?.[index]?.LastName} />
                                                    <BookingInput labelName="Gender" {...register(`Travellers.${index}.Gender` as const)} placeholder="M/F/O" />
                                                    <BookingSelect
                                                        name={`Travellers.${index}.Nationality` as const}
                                                        control={control}
                                                        labelName="Nationality"
                                                        options={countryOptions}
                                                        placeholder="Select Nationality"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => setValue("Product.AdultCount", (parseInt(adultCount as any) || 0) + 1)}
                                            className="px-4 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 dark:text-blue-400 dark:border-blue-400 font-medium transition-colors"
                                        >
                                            + Add Traveler
                                        </button>
                                    </div>
                                )}

                                {/* Step 3: Emergency Contact */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold dark:text-white mb-4">Emergency Contact Information</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <BookingInput labelName="Contact Name" {...register("EmergencyContact.FirstName", { required: "Name is required" })} error={!!errors.EmergencyContact?.FirstName} errorMsg={errors.EmergencyContact?.FirstName?.message} />
                                            <BookingInput labelName="Relationship" {...register("EmergencyContact.RelationShip", { required: "Relation is required" })} error={!!errors.EmergencyContact?.RelationShip} />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <BookingPhoneInput
                                                control={control}
                                                name="EmergencyContact.PersonalNumber"
                                                labelName="Phone Number"
                                                rules={{ required: "Phone is required" }}
                                                error={!!errors.EmergencyContact?.PersonalNumber}
                                                errorMsg={errors.EmergencyContact?.PersonalNumber?.message}
                                            />
                                            <BookingInput labelName="Email Address" type="email" {...register("EmergencyContact.Email")} />
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review */}
                                {currentStep === 4 && (
                                    <div className="space-y-8">
                                        <h2 className="text-2xl font-bold dark:text-white mb-6">Review & Confirm Your Adventure</h2>

                                        {/* Trip Details Section */}
                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border dark:border-gray-700">
                                            <ReviewSectionHeader title="Trip Summary" onEdit={() => handleEditStep(0)} />
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Trek Name</p>
                                                    <p className="font-medium text-base">{trek.Name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Departure Date</p>
                                                    <p className="font-medium text-base">{startDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                                                    <p className="font-medium text-base">{trek.DurationDays} Days</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Group Size</p>
                                                    <p className="font-medium text-base">
                                                        {(parseInt(adultCount as any) || 0) + (parseInt(childrenCount as any) || 0)} Travelers
                                                        <span className="text-xs text-gray-500 font-normal ml-1">
                                                            ({adultCount} Adults, {childrenCount} Children)
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Primary Contact Section */}
                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border dark:border-gray-700">
                                            <ReviewSectionHeader title="Primary Contact" onEdit={() => handleEditStep(1)} />
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Full Name</p>
                                                    <p className="font-medium text-base">{watch("LeadCustomer.FirstName")} {watch("LeadCustomer.LastName")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Nationality</p>
                                                    <p className="font-medium text-base">{watch("LeadCustomer.Nationality")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Email Check</p>
                                                    <p className="font-medium text-base break-words">{watch("LeadCustomer.Email")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                                                    <p className="font-medium text-base">{watch("LeadCustomer.Phone")}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Travelers Section */}
                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border dark:border-gray-700">
                                            <ReviewSectionHeader title="Travelers List" onEdit={() => handleEditStep(2)} />
                                            <div className="space-y-3">
                                                {travelerFields.map((field, idx) => (
                                                    <div key={field.id} className="flex justify-between items-center text-sm border-b dark:border-gray-600 last:border-0 pb-2 last:pb-0">
                                                        <div className="font-medium text-gray-800 dark:text-gray-200">
                                                            {idx + 1}. {watch(`Travellers.${idx}.FirstName`)} {watch(`Travellers.${idx}.LastName`)}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                                                            {watch(`Travellers.${idx}.Gender`) || 'N/A'}, {watch(`Travellers.${idx}.Nationality`) || 'N/A'}
                                                        </div>
                                                    </div>
                                                ))}
                                                {travelerFields.length === 0 && <p className="text-gray-500">No additional travelers.</p>}
                                            </div>
                                        </div>

                                        {/* Emergency Contact Section */}
                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border dark:border-gray-700">
                                            <ReviewSectionHeader title="Emergency Contact" onEdit={() => handleEditStep(3)} />
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
                                                    <p className="font-medium text-base">{watch("EmergencyContact.FirstName")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Relationship</p>
                                                    <p className="font-medium text-base">{watch("EmergencyContact.RelationShip")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                                    <p className="font-medium text-base">{watch("EmergencyContact.PersonalNumber")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                                            <p className="font-bold">Payment Information</p>
                                            <p className="text-sm">Once booking is confirmed with our team, payment will be processed through our secure payment gateway.</p>
                                        </div>
                                        <div className="mt-6 border-t dark:border-gray-700 pt-4">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                By clicking <strong>Confirm Booking</strong>, you agree to our Terms and Conditions. An account will be automatically created using your provided email to help you manage this booking.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="mt-8 flex justify-between">
                                    {currentStep > 0 && (
                                        <button type="button" onClick={prevStep} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white transition-colors">
                                            Back
                                        </button>
                                    )}
                                    {currentStep < 4 ? (
                                        <button type="button" onClick={nextStep} className="ml-auto px-6 py-4 bg-blue-700 text-white rounded-md font-bold hover:bg-blue-800 transition-colors w-full sm:w-auto shadow-md hover:shadow-lg">
                                            Next
                                        </button>
                                    ) : (
                                        <button type="submit" disabled={isSubmitting} className="ml-auto px-6 py-4 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50 shadow-md hover:shadow-lg">
                                            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Your Booking Summary</h2>

                                <img src={getCDNUrl(trek.Gallery[0].ImagePath)} alt={trek.Name} className="rounded-lg mb-4 w-full h-auto object-cover aspect-video" />

                                <h3 className="text-xl font-bold dark:text-gray-200 mb-4">{trek.Name}</h3>
                                <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                                    <p className="flex justify-between"><span>Region:</span> <span className="font-semibold">{trek.Region}</span></p>
                                    <p className="flex justify-between"><span>Activity:</span> <span className="font-semibold">{trek.Activity || 'Trekking'}</span></p>
                                </div>
                                <div className="space-y-3 my-4 text-gray-600 dark:text-gray-300 text-sm border-t dark:border-gray-700 pt-4">
                                    <p className="flex justify-between"><span>Duration:</span> <span className="font-semibold">{trek.DurationDays} Days</span></p>
                                    <p className="flex justify-between"><span>Price per person:</span> <span className="font-semibold">${trek.PriceInUSD}</span></p>
                                    <p className="flex justify-between"><span>Travelers:</span> <span className="font-semibold">{(parseInt(adultCount as any) || 0) + (parseInt(childrenCount as any) || 0)}</span></p>
                                </div>
                                <div className="border-t dark:border-gray-700 pt-4 mt-6">
                                    <p className="flex justify-between text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        <span>Total:</span>
                                        <span>${totalPrice.toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Booking;