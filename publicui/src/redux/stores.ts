import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { userAPI } from "./user/userAPI";
import { aiAssistantAPI } from "./aibot/aiAssistantAPI";
import { categoryAPI } from "./aibot/categoryAPI";
import { collectionAPI } from "./aibot/collectionAPI";
import { knowledgeBaseAPI } from "./aibot/knowledgebaseAPI";
import { llmProviderAPI } from "./aibot/llmProviderAPI";
import { moderationAPI } from "./aibot/moderationAPI";
import { systemPromptAPI } from "./aibot/systemPromptAPI";
import { themeAPI } from "./aibot/themeAPI";
import { supportAPI } from "./admin/SupportTicketAPI";


import { contentAPI } from "./api/contentAPI";
import { blogAPI } from "./api/blogAPI";
import { tourAPI } from "./api/tourAPI";
import { authAPI } from "./api/authAPI";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [aiAssistantAPI.reducerPath]: aiAssistantAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [collectionAPI.reducerPath]: collectionAPI.reducer,
    [knowledgeBaseAPI.reducerPath]: knowledgeBaseAPI.reducer,
    [llmProviderAPI.reducerPath]: llmProviderAPI.reducer,
    [moderationAPI.reducerPath]: moderationAPI.reducer,
    [systemPromptAPI.reducerPath]: systemPromptAPI.reducer,
    [themeAPI.reducerPath]: themeAPI.reducer,
    [supportAPI.reducerPath]: supportAPI.reducer,
    [contentAPI.reducerPath]: contentAPI.reducer,
    [blogAPI.reducerPath]: blogAPI.reducer,
    [tourAPI.reducerPath]: tourAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAPI.middleware,
      aiAssistantAPI.middleware,
      categoryAPI.middleware,
      collectionAPI.middleware,
      knowledgeBaseAPI.middleware,
      llmProviderAPI.middleware,
      moderationAPI.middleware,
      systemPromptAPI.middleware,
      themeAPI.middleware,
      supportAPI.middleware,
      contentAPI.middleware,
      blogAPI.middleware,
      tourAPI.middleware,
      authAPI.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
