import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
  useGetAssistantDetailQuery,
  useSaveAssistantPromptMutation,
} from "../../../redux/aibot/aiAssistantAPI";
import { useGetAllSystemPromptsQuery, useGetSystemPromptDetailQuery } from "../../../redux/aibot/systemPromptAPI";
import ComponentCard from "../../../components/common/ComponentCard";
import InputField from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import toaster from "../../../components/toster";

interface AIAssistantPromptFormValues {
  SystemPrompt: string;
}

const AIAssistantPromt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [AIAssistantId, setAIAssistantId] = useState<number | null>(null);
  const [systemPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [systemPromptText, setSystemPromptText] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    register,
  } = useForm<AIAssistantPromptFormValues>({
    defaultValues: {
      SystemPrompt: "",
    },
  });

  const { data: assistantData, isLoading: isAssistantLoading, isSuccess } =
    useGetAssistantDetailQuery({ aiAssistantId: AIAssistantId || 0 }, { skip: !AIAssistantId });
  const { data: systemPromptsData, isLoading: isSystemPromptsLoading } = useGetAllSystemPromptsQuery({});
  const { data: systemPromptDetail, isLoading: isSystemPromptDetailLoading } = useGetSystemPromptDetailQuery(systemPromptId, { skip: systemPromptId == 0 || !systemPromptId });
  const [saveAssistantPrompt, { isLoading: isSavingPrompt }] = useSaveAssistantPromptMutation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) {
      setAIAssistantId(parseInt(id, 10));
    }
  }, [location]);

  useEffect(() => {
    if (systemPromptDetail?.Data) {
      setSystemPromptText(systemPromptDetail?.Data?.Prompt || "");
      setValue("SystemPrompt", systemPromptDetail?.Data?.Prompt || ""); // Set form value
    }
  }, [systemPromptDetail, setValue]);
  useEffect(() => {
    if (assistantData?.Data) {
      setSystemPromptText(assistantData?.Data?.SystemPrompt || "");
      setValue("SystemPrompt", assistantData?.Data?.SystemPrompt || ""); // Set form value
    }
  }, [assistantData]);



  const handlePromptSelect = (systemPromptId: number) => {
    setSelectedPromptId(systemPromptId);
  };

  const onSubmit = async (data: AIAssistantPromptFormValues) => {
    if (!AIAssistantId) {
      toaster.error("AI Assistant ID is missing.");
      return;
    }
    try {
      const response = await saveAssistantPrompt({
        AIAssistantId: AIAssistantId,
        SystemPrompt: data.SystemPrompt,
      }).unwrap();

      if (response.Code === 200) {
        toaster.success("System Prompt saved successfully!");
      } else {
        toaster.error("Failed to save system prompt.");
      }
    } catch (error: any) {
      toaster.error(error.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      {isAssistantLoading ? (
        <div>Loading...</div>
      ) : (
        assistantData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ComponentCard title="AI Assistant Details">
                <div>
                  <p>Name</p>
                  <p>{assistantData?.Data?.Name || "N/A"}</p>

                </div>
                <div>
                  <p>Description</p>
                  <p>{assistantData?.Data?.Description || "N/A"}</p>

                </div>
              </ComponentCard>
              <ComponentCard title="Available System Prompts">
                {isSystemPromptsLoading ? (
                  <div>Loading prompts...</div>
                ) : (
                  <ul className="menu bg-base-200 w-full rounded-box">
                    {systemPromptsData?.Data?.map((prompt: any) => (
                      <li className="mb-3 pb-3" key={prompt.SystemPromptId} onClick={() => handlePromptSelect(prompt.SystemPromptId)}>
                        <a className="cursor-pointer bg-blue-300 text-white p-2 rounded">{prompt.Name}(**click here to load**)</a>
                      </li>
                    ))}
                  </ul>
                )}
              </ComponentCard>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* System Prompt Text Area (Full Width) */}
              <ComponentCard title="Assistant System Prompt">
                <TextArea
                  id="SystemPrompt"
                  rows={20}
                  placeholder="Assistant System Prompt"
                  error={!!errors?.SystemPrompt}
                  errorMsg={errors?.SystemPrompt?.message}
                  {...register("SystemPrompt", { required: "System Prompt is required" })}
                  onChange={(e) => {
                    setSystemPromptText(e.target.value);
                    setValue("SystemPrompt", e.target.value);
                  }}
                />
              </ComponentCard>
              <div className="mt-3 flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
                  disabled={isSavingPrompt}
                >
                  {isSavingPrompt ? "Saving..." : "Save Prompt"}
                </button>
              </div>
            </form>
          </div>
        )
      )}
    </>
  );
};

export default AIAssistantPromt;