import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
  useSaveAssistantCreateMutation, // Import create mutation
  useSaveAssistantMutation,
  useGetAssistantDetailQuery,
} from "../../../redux/aibot/aiAssistantAPI";
import { useGetProvidersQuery } from "../../../redux/aibot/llmProviderAPI"; // Import LLM Providers query
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import toaster from "../../../components/toster";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";
import { useGetAllThemesQuery } from "../../../redux/aibot/themeAPI";
import { BaseEndpoints } from "../../../config/BaseEndpoints";

interface AIAssistantFormValues {
  AIAssistantId: number;
  Name: string;
  Description: string;
  IsActive: boolean;
  ImageFile: FileList | null; // For image file upload
  LLMProviderId: number; // For LLM Provider dropdown
  SystemPrompt: string;
  Website: string;
  AssistantTone: string;
  AIAssistantThemeId: number;
}

const AIAssistantForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [AIAssistantId, setAIAssistantId] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for image preview

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    register,
  } = useForm<AIAssistantFormValues>({
    defaultValues: {
      AIAssistantId: 0,
      Name: "",
      Description: "",
      IsActive: true,
      ImageFile: null,
      LLMProviderId: 0,
      SystemPrompt: "",
      Website: "",
      AssistantTone: "",
      AIAssistantThemeId: 0
    },
  });

  const [saveAssistantCreate, { isLoading: isSaving }] = useSaveAssistantCreateMutation(); // Use create mutation
  const [saveAssistant] = useSaveAssistantMutation();
  const { data: assistantData, isLoading: isAssistantLoading, isSuccess } =
    useGetAssistantDetailQuery({ aiAssistantId: AIAssistantId }, { skip: !isEditMode });
  const { data: providersData, isLoading: isProvidersLoading } = useGetProvidersQuery(""); // Fetch LLM Providers
  const { data: themeData, isLoading: isThemeLoading } = useGetAllThemesQuery(""); // Fetch LLM Providers

  useEffect(() => {
    if (location.pathname.includes("edit") && id) {
      setIsEditMode(true);
      setAIAssistantId(parseInt(id, 10));
    } else {
      setIsEditMode(false);
      setAIAssistantId(0);
    }
  }, [location, id]);

  useEffect(() => {
    if (isSuccess && assistantData) {
      reset({
        AIAssistantId: assistantData?.Data?.AIAssistantId,
        Name: assistantData?.Data?.Name,
        Description: assistantData?.Data?.Description,
        IsActive: assistantData?.Data?.IsActive,
        LLMProviderId: assistantData?.Data?.LLMProviderId,
        SystemPrompt: assistantData?.Data?.SystemPrompt,
        Website: assistantData?.Data?.Website,
        AssistantTone: assistantData?.Data?.AssistantTone,
        AIAssistantThemeId: assistantData?.Data?.AIAssistantThemeId,
      });
      setImageUrl(BaseEndpoints.base + assistantData?.Data?.ImageUrl || null); // Set existing image URL for preview
    }
  }, [assistantData, reset, isSuccess]);

  const onSubmit = async (formData: any) => {
    try {
      const mutation = isEditMode ? saveAssistant : saveAssistantCreate; // Determine mutation based on edit mode

      // Prepare data for the API
      const apiData = {
        AIAssistantId: formData.AIAssistantId,
        Name: formData.Name,
        Description: formData.Description,
        SystemPrompt: '',
        Website: formData.Website,
        LLMProviderId: formData.LLMProviderId,
        AssistantTone: formData.AssistantTone,
        AIAssistantThemeId: formData.AIAssistantThemeId,
        IsActive: formData.IsActive,
        ImageFile: formData.ImageFile?.[0] || null, // Get the first file from FileList
      };

      const response = await mutation(apiData).unwrap();

      if (response.Code == 200) {
        setAIAssistantId(response.Data);
        toaster.success("Assistant saved successfully!");
        navigate("/admin/aiassistant");
      } else {
        toaster.error("Failed to save assistant.");
      }
    } catch (error: any) {
      toaster.error(error.data?.message || "An error occurred.");
    }
  };

  const handleImageChange = (e: any) => {
    const fileList = e.target.files;
    //setValue("ImageUrlFile", fileList[0]); // Store FileList in form
    if (fileList && fileList[0]) {
      setImageUrl(URL.createObjectURL(fileList[0])); // Create preview URL
    } else {
      setImageUrl(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <ComponentCard title={`${isEditMode ? "Edit" : "New"} AI Assistant`}>
            <InputField
              type="text"
              id="Name"
              labelName="Assistant Name"
              placeholder="Assistant Name"
              {...register("Name", { required: "Assistant name is required" })}
              error={!!errors?.Name}
              errorMsg={errors?.Name?.message}
            />

            <TextArea
              id="Description"
              labelName="Description"
              placeholder="Description"
              error={!!errors?.Description}
              errorMsg={errors?.Description?.message}
              {...register("Description", { required: "Description is required" })}
            />
            {/* <InputField
              type="text"
              id="SystemPrompt"
              labelName="System Prompt"
              placeholder="System Prompt"
              {...register("SystemPrompt")}
              error={!!errors?.SystemPrompt}
              errorMsg={errors?.SystemPrompt?.message}
            /> */}
            <InputField
              type="text"
              id="AssistantTone"
              labelName="Assistant Tone"
              placeholder="Assistant Tone"
              {...register("AssistantTone")}
              error={!!errors?.AssistantTone}
              errorMsg={errors?.AssistantTone?.message}
            />
            <InputField
              type="text"
              id="Website"
              labelName="Website"
              placeholder="Website"
              {...register("Website")}
              error={!!errors?.Website}
              errorMsg={errors?.Website?.message}
            />

            <div className="w-full px-2.5">
              <label htmlFor="ImageUrlFile" className="block text-sm font-medium text-gray-700">
                Logo
              </label>
              <input
                type="file"
                accept="image/jpeg, image/png"

                {...register("ImageFile", { onChange: handleImageChange })}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Assistant Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>

            <Select
              labelName="LLM Provider"
              placeholder="Select..."
              options={providersData?.Data?.map((provider: any) => {
                return { label: provider.Name, value: provider.LLMProviderId };
              }) || []}
              error={!!errors?.LLMProviderId}
              errorMsg={errors?.LLMProviderId?.message}
              {...register("LLMProviderId", { valueAsNumber: true, required: "LLM provider is required." })}
            >

            </Select>

            <Select
              labelName="Theme"
              placeholder="Select..."
              options={themeData?.Data?.map((provider: any) => {
                return { label: provider.Name, value: provider.AIAssistantThemeId };
              }) || []}
              error={!!errors?.AIAssistantThemeId}
              errorMsg={errors?.AIAssistantThemeId?.message}
              {...register("AIAssistantThemeId", { valueAsNumber: true, required: "Theme is required." })}
            >

            </Select>



            <Checkbox label="Active" {...register("IsActive")} />
          </ComponentCard>
        </div>

        <div className="mt-3 flex justify-end gap-3">
          <button
            type="reset"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white "
            disabled={isSaving || isProvidersLoading}
          >
            {isSaving ? "Saving..." : isProvidersLoading ? "Loading Providers..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AIAssistantForm;