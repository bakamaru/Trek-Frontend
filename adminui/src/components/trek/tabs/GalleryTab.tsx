import React, { useState, useEffect } from "react";
import { TrekImageSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekGalleryMutation, useDeleteTrekGalleryMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface GalleryTabProps {
    trekId: number;
    detailData: any;
}

interface ExtendedTrekImage extends TrekImageSaveRequest {
    imageFile?: File;
    previewUrl?: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ trekId, detailData }) => {
    const [images, setImages] = useState<ExtendedTrekImage[]>([]);
    const [saveGallery, { isLoading: isSaving }] = useSaveTrekGalleryMutation();
    const [deleteGallery] = useDeleteTrekGalleryMutation();

    useEffect(() => {
        if (detailData && detailData.Code === 200) {
            const galleryData = detailData.Data?.Images || detailData.Data?.Gallery || [];
            // Map existing images to include previewUrl from ImagePath
            const mappedImages = galleryData.map((img: any) => ({
                trekImageId: img.TrekImageId,
                imagePath: img.ImagePath,
                isLandscape: img.IsLandscape,
                isBannerType: img.IsBannerType,
                isVertical: img.IsVertical,
                previewUrl: img.ImagePath, // Assuming ImagePath is a full URL or accessible path
            }));
            setImages(mappedImages);
        }
    }, [detailData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages: ExtendedTrekImage[] = [];
            Array.from(e.target.files).forEach((file) => {
                // Validation: Only PNG/JPG
                if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                    toaster.error(`File ${file.name} is not a valid image (PNG/JPG only).`);
                    return;
                }

                newImages.push({
                    trekImageId: 0,
                    imagePath: "", // Will be set by backend
                    isLandscape: false,
                    isBannerType: false,
                    isVertical: false,
                    imageFile: file,
                    previewUrl: URL.createObjectURL(file),
                });
            });

            setImages((prev) => [...prev, ...newImages]);
        }
        // Reset input value to allow selecting the same file again if needed
        e.target.value = "";
    };

    const handleRemoveImage = async (index: number) => {
        const imageToRemove = images[index];

        if (imageToRemove.trekImageId && imageToRemove.trekImageId > 0) {
            if (!window.confirm("Are you sure you want to delete this image?")) return;

            try {
                const response = await deleteGallery({ trekId, trekImageId: imageToRemove.trekImageId }).unwrap();
                if (response.Code === 200) {
                    toaster.success("Image deleted successfully");
                    removeImageFromState(index);
                } else {
                    toaster.error("Failed to delete image");
                }
            } catch (error: any) {
                toaster.error(error?.data?.message || "Error deleting image");
            }
        } else {
            removeImageFromState(index);
        }
    };

    const removeImageFromState = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            // Revoke object URL to avoid memory leaks
            if (newImages[index].previewUrl && newImages[index].imageFile) {
                URL.revokeObjectURL(newImages[index].previewUrl!);
            }
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleImageChange = (index: number, field: keyof TrekImageSaveRequest, value: any) => {
        const updated = [...images];
        updated[index] = { ...updated[index], [field]: value };
        setImages(updated);
    };

    // const handleSave = async () => {
    //     if (trekId === 0) {
    //         toaster.error("Please save basic trek info first.");
    //         return;
    //     }

    //     try {
    //         const formData = new FormData();
    //         images.forEach((img, index) => {
    //             formData.append(`items[${index}].TrekImageId`, img.trekImageId?.toString() || "0");
    //             formData.append(`items[${index}].ImagePath`, img.imagePath || "");
    //             formData.append(`items[${index}].IsLandscape`, img.isLandscape ? "true" : "false");
    //             formData.append(`items[${index}].IsBannerType`, img.isBannerType ? "true" : "false");
    //             formData.append(`items[${index}].IsVertical`, img.isVertical ? "true" : "false");
    //             if (img.imageFile) {
    //                 formData.append(`items[${index}].ImageFile`, img.imageFile);
    //             }
    //         });

    //         const response = await saveGallery({ trekId, data: formData }).unwrap();
    //         if (response.Code === 200) {
    //             toaster.success("Gallery saved successfully!");
    //         } else {
    //             toaster.error("Failed to save gallery.");
    //         }
    //     } catch (error: any) {
    //         toaster.error(error.data?.message || "An error occurred.");
    //     }
    // };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const formData = new FormData();
            images.forEach((img, index) => {
                formData.append(`items[${index}].TrekId`, trekId.toString());
                formData.append(`items[${index}].TrekImageId`, img.trekImageId?.toString() || "0");
                formData.append(`items[${index}].ImagePath`, img.imagePath || "");
                formData.append(`items[${index}].IsLandscape`, img.isLandscape ? "true" : "false");
                formData.append(`items[${index}].IsBannerType`, img.isBannerType ? "true" : "false");
                formData.append(`items[${index}].IsVertical`, img.isVertical ? "true" : "false");
                if (img.imageFile) {
                    formData.append(`items[${index}].ImageFile`, img.imageFile);
                }
            });

            const response = await saveGallery({ trekId, data: formData }).unwrap();
            if (response.Code === 200) {
                toaster.success("Gallery saved successfully!");
            } else {
                toaster.error("Failed to save gallery.");
            }
        } catch (error: any) {
            toaster.error(error?.data?.message || "An error occurred.");
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Gallery Images</h3>
                <div>
                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                    >
                        Add Images
                    </label>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <p className="text-sm text-gray-500">No images added yet.</p>
                    <label
                        htmlFor="file-upload"
                        className="mt-2 cursor-pointer text-xs text-gray-700 underline hover:text-gray-900"
                    >
                        Click to upload images (PNG, JPG)
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => (
                        <div key={index} className="relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                            <div className="aspect-w-16 aspect-h-9 mb-3 w-full overflow-hidden rounded-md bg-gray-100">
                                {image.previewUrl ? (
                                    <img
                                        src={import.meta.env.VITE_API_BASE_URL + image.previewUrl + "?w=400&h=150&mode=crop"}
                                        alt={`Gallery ${index}`}
                                        className="h-40 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 items-center justify-center text-gray-400">
                                        No Preview
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    <label className="flex items-center space-x-2 rounded border border-gray-200 px-2 py-1 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={image.isLandscape || false}
                                            onChange={(e) => handleImageChange(index, "isLandscape", e.target.checked)}
                                            className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="text-xs text-gray-700">Landscape</span>
                                    </label>

                                    <label className="flex items-center space-x-2 rounded border border-gray-200 px-2 py-1 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={image.isBannerType || false}
                                            onChange={(e) => handleImageChange(index, "isBannerType", e.target.checked)}
                                            className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="text-xs text-gray-700">Banner</span>
                                    </label>

                                    <label className="flex items-center space-x-2 rounded border border-gray-200 px-2 py-1 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={image.isVertical || false}
                                            onChange={(e) => handleImageChange(index, "isVertical", e.target.checked)}
                                            className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="text-xs text-gray-700">Vertical</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="mt-2 w-full rounded border border-red-200 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-4 border-t border-gray-100">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving Gallery..." : "Save Gallery Changes"}
                </button>
            </div>
        </div>
    );
};

export default GalleryTab;
