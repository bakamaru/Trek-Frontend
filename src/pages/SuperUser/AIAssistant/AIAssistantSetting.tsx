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
import KnowledgeBaseSection from "./AIAssistantSettingKB";

interface AIAssistantSettingProps { }

const AIAssistantSetting: React.FC<AIAssistantSettingProps> = () => {
  const location = useLocation();
  const [aiAssistantId, setAiAssistantId] = useState<number | null>(null);
    const [knowledgeBaseCollectionId, setKnowledgeBaseCollectionId] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState("config"); // config, theme, model, kb

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idParam = queryParams.get("id");
    if (idParam) {
      setAiAssistantId(parseInt(idParam, 10));
    }
  }, [location.search]);

  // Fetch assistant details
  const { data: assistantData, isLoading: isAssistantLoading } = useGetAssistantDetailQuery(
    { aiAssistantId: aiAssistantId || 0 },
    { skip: !aiAssistantId }
  );

  // Fetch configurations
  const { data: assistantConfigData, isLoading: isConfigLoading } = useGetAssistantConfigQuery(
    { aiAssistantId: aiAssistantId || 0 },
    { skip: !aiAssistantId }
  );
  const { data: themeConfigData, isLoading: isThemeLoading } = useGetThemeConfigQuery(
    { aiAssistantId: aiAssistantId || 0 },
    { skip: !aiAssistantId }
  );
  const { data: modelConfigData, isLoading: isModelLoading } = useGetModelConfigQuery(
    { aiAssistantId: aiAssistantId || 0 },
    { skip: !aiAssistantId }
  );

  const handleError = useCallback((error: any, message: string) => {
    toaster.error(error?.data?.message || message || "An error occurred.");
  }, []);

  if (isAssistantLoading || isConfigLoading || isThemeLoading || isModelLoading) {
    return <div>Loading...</div>;
  }

  if (!aiAssistantId) {
    return <div>Error: AIAssistantId not found in URL.</div>;
  }

  if (!assistantData) {
    return <div>Error: Assistant data not found.</div>;
  }

interface ConfigSectionProps {
    aiAssistantId: number;
    configData: any;
    handleError: (error: any, message: string) => void;
}
  //AssistantConfigSection
  interface AIAssistantConfigSaveDto {
    AIAssistantId: number;
    KnowledgeBaseCollectionId: number;
    PerUserDailyQuotaLimit: number;
    DailyQuotaLimit: number;
    MonthlyQuotaLimit: number;
    MaxQuotaLimit: number;
    ModifiedBy: number;
  }

  const AssistantConfigSection: React.FC<ConfigSectionProps> = ({ aiAssistantId, configData, handleError }) => {
    const [saveAssistantConfig, { isLoading: isSavingConfig }] = useSaveAssistantConfigMutation();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AIAssistantConfigSaveDto>({
      defaultValues: {
        AIAssistantId: aiAssistantId,
        KnowledgeBaseCollectionId: 0,
        PerUserDailyQuotaLimit: 0,
        DailyQuotaLimit: 0,
        MonthlyQuotaLimit: 0,
        MaxQuotaLimit: 0,
        ModifiedBy: 0,
      },
    });

    useEffect(() => {
      if (configData) {
        reset(configData);
      }
    }, [configData, reset]);

    const onSubmit = async (data: AIAssistantConfigSaveDto) => {
      try {
        const response = await saveAssistantConfig(data).unwrap();
        if (response.Code === 200) {
          toaster.success("Assistant config saved successfully!");
        } else {
          handleError(response, "Failed to save assistant config.");
        }
      } catch (error: any) {
        handleError(error, "Failed to save assistant config.");
      }
    };

    return (
      <ComponentCard title="Assistant Configuration">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            type="number"
            id="KnowledgeBaseCollectionId"
            labelName="Knowledge Base Collection Id"
            placeholder="Knowledge Base Collection Id"
            {...register("KnowledgeBaseCollectionId", { valueAsNumber: true })}
            error={!!errors?.KnowledgeBaseCollectionId}
            errorMsg={errors?.KnowledgeBaseCollectionId?.message}
          />
          <InputField
            type="number"
            id="PerUserDailyQuotaLimit"
            labelName="Per User Daily Quota Limit"
            placeholder="Per User Daily Quota Limit"
            {...register("PerUserDailyQuotaLimit", { valueAsNumber: true })}
            error={!!errors?.PerUserDailyQuotaLimit}
            errorMsg={errors?.PerUserDailyQuotaLimit?.message}
          />
          <InputField
            type="number"
            id="DailyQuotaLimit"
            labelName="Daily Quota Limit"
            placeholder="Daily Quota Limit"
            {...register("DailyQuotaLimit", { valueAsNumber: true })}
            error={!!errors?.DailyQuotaLimit}
            errorMsg={errors?.DailyQuotaLimit?.message}
          />
          <InputField
            type="number"
            id="MonthlyQuotaLimit"
            labelName="Monthly Quota Limit"
            placeholder="Monthly Quota Limit"
            {...register("MonthlyQuotaLimit", { valueAsNumber: true })}
            error={!!errors?.MonthlyQuotaLimit}
            errorMsg={errors?.MonthlyQuotaLimit?.message}
          />
          <InputField
            type="number"
            id="MaxQuotaLimit"
            labelName="Max Quota Limit"
            placeholder="Max Quota Limit"
            {...register("MaxQuotaLimit", { valueAsNumber: true })}
            error={!!errors?.MaxQuotaLimit}
            errorMsg={errors?.MaxQuotaLimit?.message}
          />

          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
            disabled={isSavingConfig}
          >
            {isSavingConfig ? "Saving..." : "Save Config"}
          </button>
        </form>
      </ComponentCard>
    );
  };

  //AIAssistantThemeConfigSection
  interface AIAssistantThemeConfigSaveDto {
    AIAssistantId: number;
    AIAssistantThemeId: number;
    PrimaryColor: string;
    SecondaryColor: string;
    Layout: string;
    ModifiedBy: number;
  }

  const ThemeConfigSection: React.FC<ConfigSectionProps> = ({ aiAssistantId, configData, handleError }) => {
    const [saveThemeConfig, { isLoading: isSavingTheme }] = useSaveThemeConfigMutation();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AIAssistantThemeConfigSaveDto>({
      defaultValues: {
        AIAssistantId: aiAssistantId,
        AIAssistantThemeId: 0,
        PrimaryColor: "",
        SecondaryColor: "",
        Layout: "",
        ModifiedBy: 0,
      },
    });

    useEffect(() => {
      if (configData) {
        reset(configData);
      }
    }, [configData, reset]);

    const onSubmit = async (data: AIAssistantThemeConfigSaveDto) => {
      try {
        const response = await saveThemeConfig(data).unwrap();
        if (response.Code === 200) {
          toaster.success("Theme config saved successfully!");
        } else {
          handleError(response, "Failed to save theme config.");
        }
      } catch (error: any) {
        handleError(error, "Failed to save theme config.");
      }
    };

    return (
      <ComponentCard title="Theme Configuration">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            type="number"
            id="AIAssistantThemeId"
            labelName="AI Assistant Theme Id"
            placeholder="AI Assistant Theme Id"
            {...register("AIAssistantThemeId", { valueAsNumber: true })}
            error={!!errors?.AIAssistantThemeId}
            errorMsg={errors?.AIAssistantThemeId?.message}
          />
          <InputField
            type="text"
            id="PrimaryColor"
            labelName="Primary Color"
            placeholder="Primary Color"
            {...register("PrimaryColor")}
            error={!!errors?.PrimaryColor}
            errorMsg={errors?.PrimaryColor?.message}
          />
          <InputField
            type="text"
            id="SecondaryColor"
            labelName="Secondary Color"
            placeholder="Secondary Color"
            {...register("SecondaryColor")}
            error={!!errors?.SecondaryColor}
            errorMsg={errors?.SecondaryColor?.message}
          />
          <InputField
            type="text"
            id="Layout"
            labelName="Layout"
            placeholder="Layout"
            {...register("Layout")}
            error={!!errors?.Layout}
            errorMsg={errors?.Layout?.message}
          />

          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
            disabled={isSavingTheme}
          >
            {isSavingTheme ? "Saving..." : "Save Theme Config"}
          </button>
        </form>
      </ComponentCard>
    );
  };

  //AIAssistantModelConfig
  interface AIAssistantModelConfigSaveDto {
    AIAssistantId: number;
    ModelName: string;
    Temperature: number;
    TopP: number;
    MaxTokens: number;
    FrequencyPenalty: number;
    PresencePenalty: number;
    ModifiedBy: number;
  }

  const ModelConfigSection: React.FC<ConfigSectionProps> = ({ aiAssistantId, configData, handleError }) => {
    const [saveModelConfig, { isLoading: isSavingModel }] = useSaveModelConfigMutation();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AIAssistantModelConfigSaveDto>({
      defaultValues: {
        AIAssistantId: aiAssistantId,
        ModelName: "",
        Temperature: 0.7,
        TopP: 1.0,
        MaxTokens: 1024,
        FrequencyPenalty: 0.0,
        PresencePenalty: 0.0,
        ModifiedBy: 0,
      },
    });

    useEffect(() => {
      if (configData) {
        reset(configData);
      }
    }, [configData, reset]);

    const onSubmit = async (data: AIAssistantModelConfigSaveDto) => {
      try {
        const response = await saveModelConfig(data).unwrap();
        if (response.Code === 200) {
          toaster.success("Model config saved successfully!");
        } else {
          handleError(response, "Failed to save model config.");
        }
      } catch (error: any) {
        handleError(error, "Failed to save model config.");
      }
    };

    return (
      <ComponentCard title="Model Configuration">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            type="text"
            id="ModelName"
            labelName="Model Name"
            placeholder="Model Name"
            {...register("ModelName")}
            error={!!errors?.ModelName}
            errorMsg={errors?.ModelName?.message}
          />
          <InputField
            type="number"
            id="Temperature"
            labelName="Temperature"
            placeholder="Temperature"
            step={0.01}
            {...register("Temperature", { valueAsNumber: true })}
            error={!!errors?.Temperature}
            errorMsg={errors?.Temperature?.message}
          />
          <InputField
            type="number"
            id="TopP"
            labelName="Top P"
            placeholder="Top P"
            step={0.01}
            {...register("TopP", { valueAsNumber: true })}
            error={!!errors?.TopP}
            errorMsg={errors?.TopP?.message}
          />
          <InputField
            type="number"
            id="MaxTokens"
            labelName="Max Tokens"
            placeholder="Max Tokens"
            {...register("MaxTokens", { valueAsNumber: true })}
            error={!!errors?.MaxTokens}
            errorMsg={errors?.MaxTokens?.message}
          />
          <InputField
            type="number"
            id="FrequencyPenalty"
            labelName="Frequency Penalty"
            placeholder="Frequency Penalty"
            step={0.01}
            {...register("FrequencyPenalty", { valueAsNumber: true })}
            error={!!errors?.FrequencyPenalty}
            errorMsg={errors?.FrequencyPenalty?.message}
          />
          <InputField
            type="number"
            id="PresencePenalty"
            labelName="Presence Penalty"
            placeholder="Presence Penalty"
            step={0.01}
            {...register("PresencePenalty", { valueAsNumber: true })}
            error={!!errors?.PresencePenalty}
            errorMsg={errors?.PresencePenalty?.message}
          />

          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
            disabled={isSavingModel}
          >
            {isSavingModel ? "Saving..." : "Save Model Config"}
          </button>
        </form>
      </ComponentCard>
    );
  };
  


  return (
    <>
      {/* Assistant Details */}
      <ComponentCard title="Assistant Details">
        <p>Name: {assistantData.Data.Name}</p>
        <p>Description: {assistantData.Data.Description}</p>
        {/* Display other assistant details here */}
      </ComponentCard>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === "config" ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : ""}`}
              aria-current={activeTab === "config" ? "page" : undefined}
              onClick={() => setActiveTab("config")}
            >
              Configuration
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === "theme" ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : ""}`}
              aria-current={activeTab === "theme" ? "page" : undefined}
              onClick={() => setActiveTab("theme")}
            >
              Theme
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === "model" ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : ""}`}
              aria-current={activeTab === "model" ? "page" : undefined}
              onClick={() => setActiveTab("model")}
            >
              Model
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === "kb" ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : ""}`}
              aria-current={activeTab === "kb" ? "page" : undefined}
              onClick={() => setActiveTab("kb")}
            >
              Knowledge Base
            </a>
          </li>
        </ul>
      </div>
      {/* Tab Content */}
      {activeTab === "config" && (
        <AssistantConfigSection
          aiAssistantId={aiAssistantId}
          configData={assistantConfigData?.Data}
          handleError={handleError}
        />
      )}
      {activeTab === "theme" && (
        <ThemeConfigSection
          aiAssistantId={aiAssistantId}
          configData={themeConfigData?.Data}
          handleError={handleError}
        />
      )}
      {activeTab === "model" && (
        <ModelConfigSection
          aiAssistantId={aiAssistantId}
          configData={modelConfigData?.Data}
          handleError={handleError}
        />
      )}
      {activeTab === "kb" && (
        <KnowledgeBaseSection
          aiAssistantId={aiAssistantId}
          configData={assistantData?.Data?.Config}
          handleError={handleError}
        />
      )}

    </>
  );
};
export default AIAssistantSetting;


