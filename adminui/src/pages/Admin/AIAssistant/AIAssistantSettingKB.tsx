import React, { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation } from "react-router-dom";
import {
    useGetAssistantDetailQuery,
    useSaveAssistantConfigMutation,
    useGetAssistantConfigQuery,
    useSaveThemeConfigMutation,
    useGetThemeConfigQuery,
    useSaveModelConfigMutation,
    useGetModelConfigQuery,
} from "../../../redux/aibot/aiAssistantAPI";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import toaster from "../../../components/toster";
import {
    useSaveFilesMutation,
    useSaveTextMutation,
    useDeleteFileMutation,
    useSaveAudiencesMutation,
    useGetCategoriesByAssistantQuery,
    useGetByCategoryQuery,
} from "../../../redux/aibot/knowledgebaseAPI";
import { Modal } from "../../../components/ui/modal";
import { useSaveCategoryMutation } from "../../../redux/aibot/categoryAPI";
interface ConfigSectionProps {
    aiAssistantId: number;
    configData: any;
    handleError: (error: any, message: string) => void;
}

interface KnowledgeBaseWithFilesSaveDto {
    KnowledgeBaseCategoryId: number;
    KnowledgeBaseCollectionId: number;
    Version: string;
    Locale: string;
    Visibility: string;
    EffectiveDate: Date | null;
    ExpiryDate: Date | null;
    Owner: string;
    SourceUrl: string;
    AddedBy: number;
    Files: FileList | null;
}
interface KnowledgeBaseDataOnlySaveDto {
    KnowledgeBaseId: number; // 0 = insert, >0 = update
    KnowledgeBaseCategoryId: number;
    KnowledgeBaseCollectionId: number;
    Content: string;  // nvarchar(max)
    Version: string;
    Locale: string;
    Visibility: string; // 'p'|'i'|'c'
    EffectiveDate: Date | null;
    ExpiryDate: Date | null;
    Owner: string;
    SourceUrl: string;
    ModifiedBy: number;
}
interface KnowledgeBaseAudienceSaveDto {
    KnowledgeBaseId: number;
    ModifiedBy: number;
    Audiences: KnowledgeBaseAudienceEntryDto[];
}
interface KnowledgeBaseAudienceEntryDto {
    KnowledgeBaseTargetAudienceId: number;
    TargetRoles: string[];  // will be joined/stored if needed
    TargetUserIds: number[];    // will be joined/stored if needed
}
interface KnowledgeBaseCategoryDto {
    KnowledgeBaseCategoryId: number;
    KnowledgeBaseCollectionId: number;
    Name: string;
    IsActive: boolean;
    RowTotal: number;
}
interface KnowledgeBaseListDto {
    KnowledgeBaseId: number;
    KnowledgeBaseCategoryId: number;
    KnowledgeBaseCollectionId: number;
    IsFile: boolean;
    FileType: string;
    Version: string;
    Locale: string;
    Visibility: string; // 'p'|'i'|'c'
    EffectiveDate: Date | null;
    ExpiryDate: Date | null;
    Owner: string;
    SourceUrl: string;
    AddedOn: Date;
    RowTotal: number;
}


const CreateCategoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    aiAssistantId: number,
    handleError: (error: any, message: string) => void;
    reloadCategory: () => void
}> = ({
    isOpen,
    onClose,
    aiAssistantId,
    handleError,
    reloadCategory
}) => {
        const [saveCategory, { isLoading: isSavingCategory }] = useSaveCategoryMutation();
        const { register, handleSubmit, reset, formState: { errors } } = useForm({
            defaultValues: {
                KnowledgeBaseCollectionId: aiAssistantId,
                Name: "",
            },
        });

        useEffect(() => {
            if (isOpen) {
                reset({
                    KnowledgeBaseCollectionId: aiAssistantId,
                    Name: "",
                });
            }
        }, [isOpen, reset, aiAssistantId]);


        const onSubmit = async (data: any) => {
            try {
                console.log(data);
                const response = await saveCategory(data).unwrap();
                if (response.Code === 200) {
                    toaster.success("Category saved successfully!");
                    reloadCategory();
                    reset();
                    onClose();
                } else {
                    handleError(response, "Failed to save category.");
                }
            } catch (error: any) {
                handleError(error, "Failed to save category.");
            }
        };

        return (
            <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
                <ComponentCard title="Create New Category">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputField
                            type="text"
                            id="Name"
                            labelName="Category Name"
                            placeholder="Category Name"
                            {...register("Name", { required: "Category Name is required" })}
                            error={!!errors?.Name}
                            errorMsg={errors?.Name?.message}
                        />
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                                disabled={isSavingCategory}
                            >
                                {isSavingCategory ? "Saving..." : "Save Category"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </ComponentCard>
            </Modal>
        );
    };

const KnowledgeBaseSection: React.FC<ConfigSectionProps> = ({
    aiAssistantId,
    configData, handleError }) => {
    const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
    const [saveFiles, { isLoading: isSavingFiles }] = useSaveFilesMutation();
    const [saveText, { isLoading: isSavingText }] = useSaveTextMutation();
    const [deleteFile, { isLoading: isDeletingFile }] = useDeleteFileMutation();
    const [saveAudiences, { isLoading: isSavingAudiences }] = useSaveAudiencesMutation();
    const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError, refetch: reloadCategory } = useGetCategoriesByAssistantQuery({ aiAssistantId: aiAssistantId || 0 });

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<KnowledgeBaseWithFilesSaveDto>({
        defaultValues: {
            KnowledgeBaseCategoryId: 0,
            KnowledgeBaseCollectionId: 0,
            Version: "",
            Locale: "en",
            Visibility: "p",
            EffectiveDate: null,
            ExpiryDate: null,
            Owner: "",
            SourceUrl: "",
            AddedBy: 1,
            Files: null,
        },
    });

    useEffect(() => {
        setValue("AddedBy", 1);
    }, [setValue]);

    const files = watch("Files");

    const handleCategoryClick = (categoryId: number) => {
        setExpandedCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
    };

    const { data: kbItems, isLoading: isKbItemsLoading, error: kbItemsError, refetch } = useGetByCategoryQuery({
        aiAssistantId: aiAssistantId || 0,
        categoryId: expandedCategoryId || 0,
    }, { skip: !expandedCategoryId });

    useEffect(() => {
        if (kbItems) {
            refetch();
        }
    }, [kbItems, refetch]);

    const onSubmit = async (data: KnowledgeBaseWithFilesSaveDto) => {
        console.log("asdf", configData, data);
        if (!data.Files || data.Files.length === 0) {
            toaster.error("Please select at least one file.");
            return;
        }
        data["KnowledgeBaseCollectionId"] = configData?.KnowledgeBaseCollectionId;
        try {

            const response = await saveFiles(data).unwrap();
            if (response.Code === 200) {
                toaster.success("Files saved successfully!");
                reset();
                refetch(); // Refetch KB items after successful save
            } else {
                handleError(response, "Failed to save files.");
            }
        } catch (error: any) {
            handleError(error, "Failed to save files.");
        }
    };

    const onSubmitDataOnly = async (data: KnowledgeBaseWithFilesSaveDto) => {
        try {

            const response = await saveText(data).unwrap();
            if (response.Code === 200) {
                toaster.success("Data saved successfully!");
                reset();
                refetch(); // Refetch KB items after successful save
            } else {
                handleError(response, "Failed to save.");
            }
        } catch (error: any) {
            handleError(error, "Failed to save.");
        }
    };
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const allowedTypes = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const filteredFiles: any = files.filter(file => allowedTypes.includes(file.type));

        if (filteredFiles.length !== files.length) {
            toaster.error("Only .pdf, .txt, .doc, and .docx files are allowed.");
            return;
        }
        setSelectedFiles(filteredFiles);
        setValue("Files", filteredFiles);
        console.log("Files", filteredFiles)
        // Trigger automatic submission after file selection
        // const data:any = await setValue("KnowledgeBaseCategoryId", expandedCategoryId||0);
        //if (data) {
        handleSubmit(onSubmit)();
        //}
    };

    const handleAddFilesClick = () => {
        const fileInput: any = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;
        fileInput.accept = ".pdf,.txt,.doc,.docx";
        fileInput.onchange = handleFileUpload;
        fileInput.click();
    };
    useEffect(() => {
        if (expandedCategoryId) {
            setValue("KnowledgeBaseCategoryId", expandedCategoryId);
        }
    }, [expandedCategoryId, setValue]);
    if (isCategoriesLoading) return <div>Loading categories...</div>;
    if (categoriesError) return <div>Error loading categories.</div>;

    return (
        <>
            <ComponentCard title="Knowledge Base Configuration">
                <button
                    onClick={() => setIsCreateCategoryModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Add Category
                </button>
                {!categoriesData?.Data || categoriesData?.Data?.length === 0 ? (
                    <div className="flex items-center gap-4">
                        No categories found. Please create one.

                    </div>
                ) : (
                    <div className="space-y-4">
                        {categoriesData?.Data?.map((category: KnowledgeBaseCategoryDto) => (
                            <div key={category.KnowledgeBaseCategoryId} className="border rounded-md shadow-sm">
                                <button
                                    onClick={() => handleCategoryClick(category.KnowledgeBaseCategoryId)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-left font-semibold text-gray-700 bg-gray-100 rounded-t-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {category.Name}
                                    <span>({category.RowTotal} items)</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform transform ${expandedCategoryId === category.KnowledgeBaseCategoryId ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedCategoryId === category.KnowledgeBaseCategoryId && (
                                    <div className="p-4">
                                        {isKbItemsLoading ? (
                                            <div>Loading KB items...</div>
                                        ) : kbItemsError ? (
                                            <div>Error loading KB items.</div>
                                        ) : (!kbItems?.Data || kbItems?.Data?.length === 0) ? (
                                            <div>No KB items found in this category.</div>
                                        ) : (
                                            <div className="space-y-4">
                                                {kbItems?.Data?.map((item: KnowledgeBaseListDto) => (
                                                    <div key={item.KnowledgeBaseId} className="border rounded-md shadow-sm p-4">

                                                        <form onSubmit={handleSubmit(onSubmitDataOnly)} className="space-y-4">

                                                            <input type="hidden" name="KnowledgeBaseId" defaultValue={item.KnowledgeBaseId} />
                                                            <input type="hidden" name="KnowledgeBaseCategoryId" defaultValue={item.KnowledgeBaseCategoryId} />
                                                            <input type="hidden" name="KnowledgeBaseCollectionId" defaultValue={item.KnowledgeBaseCollectionId} />
                                                            <InputField
                                                                type="text"
                                                                id="Version"
                                                                labelName="Version"
                                                                placeholder="Version"
                                                                {...register("Version")}
                                                                error={!!errors?.Version}
                                                                errorMsg={errors?.Version?.message}
                                                            />
                                                            <InputField
                                                                type="text"
                                                                id="Locale"
                                                                labelName="Locale"
                                                                placeholder="Locale"
                                                                {...register("Locale")}
                                                                error={!!errors?.Locale}
                                                                errorMsg={errors?.Locale?.message}
                                                            />
                                                            <InputField
                                                                type="text"
                                                                id="Visibility"
                                                                labelName="Visibility"
                                                                placeholder="Visibility"
                                                                {...register("Visibility")}
                                                                error={!!errors?.Visibility}
                                                                errorMsg={errors?.Visibility?.message}
                                                            />

                                                            <InputField
                                                                type="date"
                                                                id="ExpiryDate"
                                                                labelName="ExpiryDate"
                                                                placeholder="ExpiryDate"
                                                                {...register("ExpiryDate")}
                                                                error={!!errors?.ExpiryDate}
                                                                errorMsg={errors?.ExpiryDate?.message}
                                                            />
                                                            <InputField
                                                                type="text"
                                                                id="Owner"
                                                                labelName="Owner"
                                                                placeholder="Owner"
                                                                {...register("Owner")}
                                                                error={!!errors?.Owner}
                                                                errorMsg={errors?.Owner?.message}
                                                            />
                                                            <InputField
                                                                type="text"
                                                                id="SourceUrl"
                                                                labelName="SourceUrl"
                                                                placeholder="SourceUrl"
                                                                {...register("SourceUrl")}
                                                                error={!!errors?.SourceUrl}
                                                                errorMsg={errors?.SourceUrl?.message}
                                                            />

                                                            <button
                                                                type="submit"
                                                                className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                                                                disabled={isSavingFiles}
                                                            >
                                                                {isSavingFiles ? "Saving..." : "Save"}
                                                            </button>
                                                        </form>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <button
                                            onClick={handleAddFilesClick}
                                            className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Add Files
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ComponentCard>
            {aiAssistantId && <CreateCategoryModal
                isOpen={isCreateCategoryModalOpen}
                onClose={() => setIsCreateCategoryModalOpen(false)}
                aiAssistantId={aiAssistantId}
                handleError={handleError}
                reloadCategory={reloadCategory}
            />}
        </>
    );
};
export default KnowledgeBaseSection;