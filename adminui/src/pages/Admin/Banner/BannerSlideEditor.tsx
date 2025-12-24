import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    MdAdd,
    MdDeleteOutline,
    MdOutlineEdit,
    MdChevronLeft,
    MdChevronRight,
    MdPlayArrow,
    MdPause,
    MdAutoAwesome,
    MdImage,
    MdVisibility,
    MdRefresh,
    MdArrowUpward,
    MdArrowDownward,
    MdFormatAlignLeft,
    MdFormatAlignCenter,
    MdFormatAlignRight,
    MdLink,
    MdArrowBack,
    MdSave,
    MdUpload,
} from "react-icons/md";
import { FaMagic } from "react-icons/fa";
import toaster from "../../../components/toster";
import {
    useGetBannerByIdQuery,
    useGetBannerItemsByBannerIdQuery,
    useSaveBannerItemMutation,
    useDeleteBannerItemMutation,
    useSortBannerItemsMutation,
} from "../../../redux/trek/bannerAPI";
import { BannerItem, BannerItemSaveRequest } from "../../../types/trekTypes";

// --- Types ---
type AnimationType = "fade" | "slide-up" | "zoom-in" | "slide-right";
type ContentPosition = "left" | "center" | "right";

// Note: Local interface for editor state, maps to API BannerItem
interface SlideState {
    id: string; // Temporary ID for new items or stringified ID for existing
    apiId: number; // 0 for new
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    imageUrl: string;
    animation: AnimationType;
    contentPosition: ContentPosition;
    overlayOpacity: number;
    displayOrder: number;
}

// --- Helper Functions ---
const mapApiToState = (item: BannerItem): SlideState => ({
    id: item.BannerItemId.toString(),
    apiId: item.BannerItemId,
    heading: item.Heading || "",
    subheading: item.SubHeading || "",
    ctaText: item.CTAText || "",
    ctaLink: item.CTALink || "",
    imageUrl: item.ImageUrl || "",
    animation: (item.Animation as AnimationType) || "fade",
    contentPosition: (item.ContentPosition as ContentPosition) || "center",
    overlayOpacity: item.OverlayOpacity ?? 40,
    displayOrder: item.DisplayOrder ?? 0,
});

const mapStateToSaveRequest = (state: SlideState, bannerId: number): BannerItemSaveRequest => ({
    bannerItemId: state.apiId,
    bannerId: bannerId,
    heading: state.heading,
    subheading: state.subheading,
    ctaText: state.ctaText,
    ctaLink: state.ctaLink,
    imageUrl: state.imageUrl,
    animation: state.animation,
    contentPosition: state.contentPosition,
    overlayOpacity: state.overlayOpacity,
    displayOrder: state.displayOrder,
    isActive: true, // Defaulting to true for now
});

export default function BannerSlideEditor() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bannerIdStr = queryParams.get("id");
    const bannerId = bannerIdStr ? parseInt(bannerIdStr, 10) : 0;

    const { data: bannerData } = useGetBannerByIdQuery(bannerId, { skip: !bannerId });
    const { data: itemsData, refetch } = useGetBannerItemsByBannerIdQuery(bannerId, { skip: !bannerId });

    const [saveBannerItem] = useSaveBannerItemMutation();
    const [deleteBannerItem] = useDeleteBannerItemMutation();
    const [sortBannerItems] = useSortBannerItemsMutation();

    const [slides, setSlides] = useState<SlideState[]>([]);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // AI Mock State
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [showAiModal, setShowAiModal] = useState(false);

    const autoPlayRef = useRef<number | null>(null);

    // Initial Load
    useEffect(() => {
        if (itemsData && itemsData.Code === 200) {
            const loadedSlides = itemsData.Data.map(mapApiToState).sort((a: SlideState, b: SlideState) => a.displayOrder - b.displayOrder);
            if (loadedSlides.length > 0) {
                setSlides(loadedSlides);
                if (!editingSlideId) {
                    setEditingSlideId(loadedSlides[0].id);
                }
            } else {
                // Initialize exactly one empty slide if none exist, but don't save it yet.
                // Actually better to let user "Add" one. But standard practice is often to start with one.
                // Let's start empty and assume user clicks "Add".
                // Or we can auto-add one locally.
                const initialSlide: SlideState = {
                    id: Date.now().toString(),
                    apiId: 0,
                    heading: "New Slide",
                    subheading: "Welcome to your new slide",
                    ctaText: "Explore",
                    ctaLink: "#",
                    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2074",
                    animation: "fade",
                    contentPosition: "center",
                    overlayOpacity: 40,
                    displayOrder: 1
                };
                setSlides([initialSlide]);
                setEditingSlideId(initialSlide.id);
            }
        }
    }, [itemsData]);

    useEffect(() => {
        if (isAutoPlay) {
            autoPlayRef.current = window.setInterval(() => {
                setActiveSlideIndex((prev) => (prev + 1) % slides.length);
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlay, slides.length]);

    const activeSlide = slides[activeSlideIndex];
    const editingSlide = slides.find((s) => s.id === editingSlideId) || activeSlide || slides[0];

    const handleNext = () => {
        setActiveSlideIndex((prev) => (prev + 1) % slides.length);
        setIsAutoPlay(false);
    };

    const handlePrev = () => {
        setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlay(false);
    };

    const addNewSlide = () => {
        const newSlide: SlideState = {
            id: Date.now().toString(), // Local temp ID
            apiId: 0,
            heading: "New Headline",
            subheading: "Add a captivating description here.",
            ctaText: "Call to Action",
            ctaLink: "#",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2070",
            animation: "slide-up",
            contentPosition: "center",
            overlayOpacity: 40,
            displayOrder: slides.length + 1
        };
        const newSlides = [...slides, newSlide];
        setSlides(newSlides);
        setActiveSlideIndex(newSlides.length - 1);
        setEditingSlideId(newSlide.id);
        setIsAutoPlay(false);
    };

    const updateSlide = (id: string, updates: Partial<SlideState>) => {
        setSlides((prev) => prev.map((slide) => (slide.id === id ? { ...slide, ...updates } : slide)));
    };

    const handleSaveAll = async () => {
        // Save current editing slide or all? 
        // The user's sample saved all "Simulate API Call". 
        // Real API saves one by one generally, or batch. Our API has `saveBannerItem` (single) and `sortBannerItems` (batch order).
        // Strategy: Save ALL dirty slides? Or just save the current one being edited?
        // Let's implemented "Save Current Slide" logic implicitly or a global save that loops.
        // For simplicity and robustness, let's just save the currently selected/editing slide when "Save" is clicked, or better, loop through all new/modified ones?
        // The safest is to loop through all `slides` and UPSERT them.

        try {
            // 1. Sort call (optional, but good to sync order)
            // 2. Save each item
            const savePromises = slides.map((slide, index) => {
                const req = mapStateToSaveRequest({ ...slide, displayOrder: index + 1 }, bannerId);
                return saveBannerItem(req).unwrap();
            });

            await Promise.all(savePromises);
            toaster.success("All slides saved successfully!");
            refetch(); // Reload to get real IDs
        } catch (e) {
            console.error(e);
            toaster.error("Failed to save slides.");
        }
    };

    const deleteSlide = async (id: string) => {
        if (slides.length <= 1) {
            toaster.error("You need at least one slide.");
            return;
        }
        if (!confirm("Delete this slide?")) return;

        const slideToDelete = slides.find(s => s.id === id);
        if (slideToDelete && slideToDelete.apiId > 0) {
            // Delete from backend
            try {
                await deleteBannerItem(slideToDelete.apiId).unwrap();
            } catch (e) {
                toaster.error("Failed to delete from server");
                return;
            }
        }

        const newSlides = slides.filter((s) => s.id !== id);
        setSlides(newSlides);
        if (activeSlideIndex >= newSlides.length) {
            setActiveSlideIndex(0);
        }
    };

    const moveSlide = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === slides.length - 1) return;

        const newSlides = [...slides];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

        // Update display orders locally
        newSlides.forEach((s, idx) => s.displayOrder = idx + 1);

        setSlides(newSlides);
        setActiveSlideIndex(targetIndex);
    };

    // AI Mock
    const generateContent = () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            if (editingSlideId) {
                updateSlide(editingSlideId, {
                    heading: "Experience the Extraordinary",
                    subheading: `Discover the best of "${aiPrompt}" with our exclusive offers designed just for you.`,
                    ctaText: "Start Journey"
                });
            }
            setIsGenerating(false);
            setShowAiModal(false);
            setAiPrompt("");
            toaster.success("Content generated by AI (Mock)!");
        }, 1500);
    };

    if (!bannerId) return <div>Invalid Banner ID</div>;

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-slate-100 border rounded-xl shadow-sm">
            {/* --- LEFT PANEL: Editor Controls --- */}
            <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col h-full z-20 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                    <button
                        onClick={() => navigate("/superadmin/banner")}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
                    >
                        <MdArrowBack className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {bannerData?.Data?.Key || "..."}
                        </span>
                        <button
                            onClick={handleSaveAll}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                            <MdSave className="w-3.5 h-3.5" /> Save All
                        </button>
                    </div>
                </div>

                {/* Slide List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slides ({slides.length})</h2>
                        <button
                            onClick={addNewSlide}
                            className="text-xs flex items-center gap-1 bg-white border border-indigo-200 text-indigo-600 px-2.5 py-1 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
                        >
                            <MdAdd className="w-3 h-3" /> Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {slides.map((slide, idx) => (
                            <div
                                key={slide.id}
                                onClick={() => {
                                    setActiveSlideIndex(idx);
                                    setEditingSlideId(slide.id);
                                    setIsAutoPlay(false);
                                }}
                                className={`
                  group relative flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all duration-200
                  ${activeSlideIndex === idx
                                        ? "bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md z-10"
                                        : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                                    }
                `}
                            >
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100">
                                    <img src={slide.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute top-0 right-0 bg-black/50 text-white text-[10px] px-1 rounded-bl">
                                        #{idx + 1}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-slate-900 truncate">
                                        {slide.heading || "Untitled Slide"}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 truncate">{slide.subheading || "No description"}</p>
                                </div>
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveSlide(idx, "up");
                                        }}
                                        disabled={idx === 0}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                                    >
                                        <MdArrowUpward className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveSlide(idx, "down");
                                        }}
                                        disabled={idx === slides.length - 1}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                                    >
                                        <MdArrowDownward className="w-3 h-3" />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSlide(slide.id);
                                    }}
                                    className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-md transition-colors ml-1"
                                >
                                    <MdDeleteOutline className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                {editingSlide && (
                    <div className="border-t border-slate-200 bg-white p-5 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20 shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <MdOutlineEdit className="w-3.5 h-3.5 text-indigo-600" />
                                Edit Properties
                            </h3>
                            <button
                                onClick={() => {
                                    setEditingSlideId(activeSlide.id);
                                    setShowAiModal(true);
                                }}
                                className="text-[10px] flex items-center gap-1.5 text-indigo-600 font-bold uppercase tracking-wide bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                            >
                                <MdAutoAwesome className="w-3 h-3" /> AI Assist
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Content Inputs */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSlide.heading}
                                        onChange={(e) => updateSlide(editingSlide.id, { heading: e.target.value })}
                                        className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="Enter main headline"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Subheading
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={editingSlide.subheading}
                                        onChange={(e) => updateSlide(editingSlide.id, { subheading: e.target.value })}
                                        className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300"
                                        placeholder="Enter supporting text"
                                    />
                                </div>
                            </div>

                            {/* Alignment & Animation */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Animation
                                    </label>
                                    <select
                                        value={editingSlide.animation}
                                        onChange={(e) =>
                                            updateSlide(editingSlide.id, { animation: e.target.value as AnimationType })
                                        }
                                        className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="fade">Fade</option>
                                        <option value="slide-up">Slide Up</option>
                                        <option value="slide-right">Slide Right</option>
                                        <option value="zoom-in">Zoom In</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Text Align
                                    </label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                        {(["left", "center", "right"] as ContentPosition[]).map((pos) => (
                                            <button
                                                key={pos}
                                                onClick={() => updateSlide(editingSlide.id, { contentPosition: pos })}
                                                className={`flex-1 flex justify-center py-1.5 rounded-md transition-all ${editingSlide.contentPosition === pos
                                                    ? "bg-white text-indigo-600 shadow-sm"
                                                    : "text-slate-400 hover:text-slate-600"
                                                    }`}
                                            >
                                                {pos === "left" && <MdFormatAlignLeft className="w-4 h-4" />}
                                                {pos === "center" && <MdFormatAlignCenter className="w-4 h-4" />}
                                                {pos === "right" && <MdFormatAlignRight className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Button Controls */}
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                                        <span>Button Label</span>
                                        <span className="text-[10px] normal-case text-slate-400 font-normal">
                                            Leave empty to hide
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSlide.ctaText}
                                        onChange={(e) => updateSlide(editingSlide.id, { ctaText: e.target.value })}
                                        className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 outline-none"
                                        placeholder="e.g. Shop Now"
                                    />
                                </div>
                                {editingSlide.ctaText && (
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <MdLink className="w-3 h-3" /> Target URL
                                        </label>
                                        <input
                                            type="text"
                                            value={editingSlide.ctaLink}
                                            onChange={(e) => updateSlide(editingSlide.id, { ctaLink: e.target.value })}
                                            className="w-full text-sm px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 outline-none font-mono text-xs text-slate-600"
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Image Selection */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                                    <span>Background Image</span>
                                </label>

                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MdImage className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={editingSlide.imageUrl}
                                            onChange={(e) => updateSlide(editingSlide.id, { imageUrl: e.target.value })}
                                            className="w-full text-sm pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm focus:border-indigo-500 outline-none font-mono text-xs text-slate-600 truncate"
                                            placeholder="Image URL"
                                        />
                                    </div>
                                    <label
                                        className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg border border-slate-200 transition-colors flex items-center justify-center"
                                        title="Upload Image"
                                    >
                                        <MdUpload className="w-4 h-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        updateSlide(editingSlide.id, {
                                                            imageUrl: reader.result as string,
                                                        });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                    <button
                                        onClick={() =>
                                            updateSlide(editingSlide.id, {
                                                imageUrl: `https://source.unsplash.com/random/1920x1080?sig=${Date.now()}`,
                                            })
                                        }
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 text-xs font-medium transition-colors"
                                    >
                                        Random
                                    </button>
                                </div>
                            </div>

                            {/* Opacity Slider */}
                            <div className="space-y-2 pt-1">
                                <div className="flex justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    <span>Overlay Darkness</span>
                                    <span>{editingSlide.overlayOpacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="90"
                                    value={editingSlide.overlayOpacity}
                                    onChange={(e) =>
                                        updateSlide(editingSlide.id, { overlayOpacity: parseInt(e.target.value) })
                                    }
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT PANEL: Preview --- */}
            <div className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col">
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-start pointer-events-none">
                    <div className="bg-black/30 backdrop-blur-md text-white/80 px-3 py-1 rounded-full text-xs font-medium border border-white/10 pointer-events-auto">
                        Live Preview
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                        <div className="bg-black/40 backdrop-blur-md rounded-full p-1 flex items-center border border-white/10">
                            <button
                                onClick={() => setIsAutoPlay(!isAutoPlay)}
                                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                                title={isAutoPlay ? "Pause" : "Play"}
                            >
                                {isAutoPlay ? <MdPause className="w-4 h-4" /> : <MdPlayArrow className="w-4 h-4" />}
                            </button>
                        </div>
                        {/* <button
                            onClick={() => setShowPreviewModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg transition-colors flex items-center gap-2"
                        >
                            <MdVisibility className="w-3.5 h-3.5" /> Fullscreen
                        </button> */}
                    </div>
                </div>

                {/* Live Canvas */}
                <div className="flex-1 relative w-full h-full">
                    {slides.length > 0 && slides.map((slide, index) => (
                        <BannerSlideItem key={`${slide.id}-${slide.animation}`} data={slide} isActive={activeSlideIndex === index} />
                    ))}

                    {/* Navigation Arrows */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all hover:scale-105 z-20 cursor-pointer"
                    >
                        <MdChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-all hover:scale-105 z-20 cursor-pointer"
                    >
                        <MdChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setActiveSlideIndex(idx);
                                    setIsAutoPlay(false);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activeSlideIndex === idx ? "bg-white w-6" : "bg-white/40 hover:bg-white/60 w-1.5"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- AI Modal --- */}
            {showAiModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <MdAutoAwesome className="w-5 h-5" /> AI Content Generator
                            </h3>
                            <p className="text-indigo-100 text-sm mt-1">
                                Describe your campaign, and let Gemini craft the perfect copy.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700">What is this banner about?</label>
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g., A 50% off flash sale on winter jackets ending this Sunday..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none text-sm"
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAiModal(false)}
                                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={generateContent}
                                    disabled={isGenerating || !aiPrompt.trim()}
                                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? <MdRefresh className="w-4 h-4 animate-spin" /> : <FaMagic className="w-4 h-4" />}
                                    {isGenerating ? "Dreaming..." : "Generate Magic"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Full Screen Preview Modal --- */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
                    <div className="absolute top-4 right-4 z-[99999]">
                        <button
                            onClick={() => setShowPreviewModal(false)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-2xl transition-transform transform hover:scale-105 font-bold text-sm cursor-pointer border border-white/20 flex items-center gap-2"
                        >
                            <span className="text-xl">&times;</span> Close Preview
                        </button>
                    </div>
                    <div className="w-full h-full relative bg-slate-900">
                        <BannerSlideItem data={activeSlide} isActive={true} />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Display Slide Component ---

function BannerSlideItem({ data, isActive }: { data: SlideState; isActive: boolean }) {
    if (!isActive || !data) return null;

    const getAnimClass = (delayStr: string) => {
        switch (data.animation) {
            case "slide-up":
                return `animate-slide-up ${delayStr}`;
            case "slide-right":
                return `animate-fade-in-left ${delayStr}`;
            case "zoom-in":
                return `animate-zoom-in ${delayStr}`;
            case "fade":
            default:
                return `animate-slide-up ${delayStr}`;
        }
    };

    const alignClass = {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
    }[data.contentPosition];

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 bg-slate-900">
                {data.imageUrl ? (
                    <img
                        src={data.imageUrl}
                        alt={data.heading}
                        className="w-full h-full object-cover animate-[zoomIn_10s_ease-out_forwards]"
                        key={data.imageUrl}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/1920x1080?text=No+Image";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50">No Image</div>
                )}

                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black transition-opacity duration-500"
                    style={{ opacity: data.overlayOpacity / 100 }}
                />
            </div>

            {/* Content Container */}
            <div
                className={`relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center z-10 ${alignClass}`}
            >
                <div className="max-w-3xl">
                    {/* Animated Heading */}
                    <h1
                        key={`h-${data.id}-${data.animation}`}
                        className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg ${getAnimClass(
                            ""
                        )}`}
                    >
                        {data.heading}
                    </h1>

                    {/* Animated Subheading */}
                    <p
                        key={`s-${data.id}-${data.animation}`}
                        className={`text-lg md:text-2xl text-slate-200 mb-8 font-light drop-shadow-md ${getAnimClass(
                            "delay-100"
                        )}`}
                    >
                        {data.subheading}
                    </p>

                    {/* Animated CTA */}
                    {data.ctaText && (
                        <div key={`b-${data.id}-${data.animation}`} className={`${getAnimClass("delay-200")}`}>
                            <a
                                href={data.ctaLink || "#"}
                                onClick={(e) => e.preventDefault()}
                                className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 hover:scale-105 hover:shadow-xl transition-all duration-300 group"
                            >
                                {data.ctaText}
                                <MdChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
