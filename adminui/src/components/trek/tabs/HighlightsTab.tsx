import React, { useState, useEffect } from "react";
import { TrekHighLightSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekHighlightsMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";
import { v4 as uuidv4 } from "uuid";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HighlightsTabProps {
    trekId: number;
    detailData: any;
}

interface ExtendedHighlight extends TrekHighLightSaveRequest {
    localId: string;
}

// Sortable Item Component
const SortableItem = ({ id, highlight, index, onChange, onRemove }: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
            <div
                {...listeners}
                className="mt-1 flex h-5 w-5 cursor-move flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-white touch-none"
            >
                {highlight.displayOrder || index + 1}
            </div>
            <div className="flex-1">
                <input
                    type="text"
                    value={highlight.description || ""}
                    onChange={(e) => onChange(index, "description", e.target.value)}
                    className="block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Highlight description..."
                />
            </div>
            <button type="button"
                onClick={() => onRemove(index)}
                className="text-xs text-red-600 hover:text-red-800"
            >
                Remove
            </button>
        </div>
    );
};

const HighlightsTab: React.FC<HighlightsTabProps> = ({ trekId, detailData }) => {
    const [highlights, setHighlights] = useState<ExtendedHighlight[]>([]);
    const [saveHighlights, { isLoading: isSaving }] = useSaveTrekHighlightsMutation();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (detailData && detailData.Code === 200) {
            const highlightData = detailData.Data?.Highlights || [];
            const mappedHighlights = highlightData.map((item: any) => ({
                trekHighLightId: item.TrekHighLightId,
                description: item.Description,
                displayOrder: item.DisplayOrder,
                localId: uuidv4(), // Generate a unique local ID for dnd
            }));
            setHighlights(mappedHighlights.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
    }, [detailData]);

    const handleAdd = () => {
        const newOrder = highlights.length + 1;

        setHighlights([
            ...highlights,
            {
                trekHighLightId: 0,
                description: "",
                displayOrder: newOrder,
                localId: uuidv4(),
            },
        ]);
    };

    const handleRemove = (index: number) => {
        const updated = highlights.filter((_, i) => i !== index);
        // Re-index displayOrder
        const reindexed = updated.map((item, i) => ({
            ...item,
            displayOrder: i + 1,
        }));
        setHighlights(reindexed);
    };

    const handleChange = (index: number, field: keyof TrekHighLightSaveRequest, value: any) => {
        const updated = [...highlights];
        updated[index] = { ...updated[index], [field]: value };
        setHighlights(updated);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setHighlights((items) => {
                const oldIndex = items.findIndex((item) => item.localId === active.id);
                const newIndex = items.findIndex((item) => item.localId === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update displayOrder based on new position
                return newItems.map((item, index) => ({
                    ...item,
                    displayOrder: index + 1,
                }));
            });
        }
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            // Remove localId before saving if necessary, or just pass it (API will likely ignore extra fields)
            // But to be clean, let's map it back to the request type
            const dataToSave = highlights.map(({ localId, ...rest }) => rest);

            const response = await saveHighlights({ trekId, data: dataToSave }).unwrap();
            if (response.Code === 200) {
                toaster.success("Highlights saved successfully!");
            } else {
                toaster.error("Failed to save highlights.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Trek Highlights</h3>
                <button type="button"
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Highlight
                </button>
            </div>

            {highlights.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No highlights added yet.</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={highlights.map(h => h.localId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {highlights.map((highlight, index) => (
                                <SortableItem
                                    key={highlight.localId}
                                    id={highlight.localId}
                                    highlight={highlight}
                                    index={index}
                                    onChange={handleChange}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Highlights"}
                </button>
            </div>
        </div>
    );
};

export default HighlightsTab;
