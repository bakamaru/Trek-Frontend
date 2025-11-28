import React, { useState, useEffect } from "react";
import { TrekImageSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekGalleryMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface GalleryTabProps {
    trekId: number;
    detailData: any;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ trekId, detailData }) => {
    const [images, setImages] = useState<TrekImageSaveRequest[]>([]);
    const [saveGallery, { isLoading: isSaving }] = useSaveTrekGalleryMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const galleryData = detailData.data?.images || detailData.data?.gallery || [];
            setImages(galleryData);
        }
    }, [detailData]);

    const handleAddImage = () => {
        setImages([
            ...images,
            {
                trekImageId: 0,
                imagePath: "",
                isLandscape: false,
                isBannerType: false,
                isVertical: false,
            },
        ]);
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleImageChange = (index: number, field: keyof TrekImageSaveRequest, value: any) => {
        const updated = [...images];
        updated[index] = { ...updated[index], [field]: value };
        setImages(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveGallery({ trekId, data: images }).unwrap();
            if (response.code === 200) {
                toaster.success("Gallery saved successfully!");
            } else {
                toaster.error("Failed to save gallery.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Gallery Images</h3>
                <button
                    onClick={handleAddImage}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Image
                </button>
            </div>

            {images.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No images added yet.</p>
                    <button
                        onClick={handleAddImage}
                        className="mt-2 text-xs text-gray-700 underline hover:text-gray-900"
                    >
                        Add your first image
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {images.map((image, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Image Path/URL</label>
                                    <input
                                        type="text"
                                        value={image.imagePath || ""}
                                        onChange={(e) => handleImageChange(index, "imagePath", e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={image.isLandscape || false}
                                            onChange={(e) => handleImageChange(index, "isLandscape", e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="ml-2 text-xs text-gray-700">Landscape</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={image.isBannerType || false}
                                            onChange={(e) => handleImageChange(index, "isBannerType", e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="ml-2 text-xs text-gray-700">Banner</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={image.isVertical || false}
                                            onChange={(e) => handleImageChange(index, "isVertical", e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />
                                        <span className="ml-2 text-xs text-gray-700">Vertical</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="text-xs text-red-600 hover:text-red-800"
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Gallery"}
                </button>
            </div>
        </div>
    );
};

export default GalleryTab;
