import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { userAPI } from "./user/userAPI";
import { menuAPI } from "./menu/menuAPI";
import { aiAssistantAPI } from "./aibot/aiAssistantAPI";
import { categoryAPI } from "./aibot/categoryAPI";
import { collectionAPI } from "./aibot/collectionAPI";
import { knowledgeBaseAPI } from "./aibot/knowledgebaseAPI";
import { llmProviderAPI } from "./aibot/llmProviderAPI";
import { moderationAPI } from "./aibot/moderationAPI";
import { systemPromptAPI } from "./aibot/systemPromptAPI";
import { themeAPI } from "./aibot/themeAPI";
import { supportAPI } from "./admin/SupportTicketAPI";
import { accessibilityAPI } from "./trek/accessibilityAPI";
import { activityLevelAPI } from "./trek/activityLevelAPI";
import { activityTypeAPI } from "./trek/activityTypeAPI";
import { bookingAPI } from "./trek/bookingAPI";
import { cityAPI } from "./trek/cityAPI";
import { currencyAPI } from "./trek/currencyAPI";
import { equipmentAPI } from "./trek/equipmentAPI";
import { equipmentCategoryAPI } from "./trek/equipmentCategoryAPI";
import { inExServiceAPI } from "./trek/inExServiceAPI";
import { permitAPI } from "./trek/permitAPI";
import { tourTypeAPI } from "./trek/tourTypeAPI";
import { trekAPI } from "./trek/trekAPI";
import { chunkFileUploadAPI } from "./trek/chunkFileUploadAPI";
import { trekCategoryAPI } from "./trek/trekCategoryAPI";
import { trekRegionAPI } from "./trek/trekRegionAPI";
import { blogAPI } from "./trek/blogAPI";
import { bannerAPI } from "./trek/bannerAPI";
import { destinationAPI } from "./trek/destinationAPI";
import { settingAPI } from "./setting/settingAPI";
import { mediaLibraryAPI } from "./setting/medialibraryAPI";
import { localizationAPI } from "./setting/localizationAPI";
import { permissionAPI } from "./setting/permissionAPI";
import { moduleAPI } from "./setting/moduleAPI";
import { htmlBuilderAPI } from "./htmlbuilder/htmlBuilderAPI";
import { openIddictAdminAPI } from "./setting/clientAPI";


export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [menuAPI.reducerPath]: menuAPI.reducer,
    [aiAssistantAPI.reducerPath]: aiAssistantAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [collectionAPI.reducerPath]: collectionAPI.reducer,
    [knowledgeBaseAPI.reducerPath]: knowledgeBaseAPI.reducer,
    [llmProviderAPI.reducerPath]: llmProviderAPI.reducer,
    [moderationAPI.reducerPath]: moderationAPI.reducer,
    [systemPromptAPI.reducerPath]: systemPromptAPI.reducer,
    [themeAPI.reducerPath]: themeAPI.reducer,
    [supportAPI.reducerPath]: supportAPI.reducer,
    [accessibilityAPI.reducerPath]: accessibilityAPI.reducer,
    [activityLevelAPI.reducerPath]: activityLevelAPI.reducer,
    [activityTypeAPI.reducerPath]: activityTypeAPI.reducer,
    [bookingAPI.reducerPath]: bookingAPI.reducer,
    [cityAPI.reducerPath]: cityAPI.reducer,
    [currencyAPI.reducerPath]: currencyAPI.reducer,
    [equipmentAPI.reducerPath]: equipmentAPI.reducer,
    [equipmentCategoryAPI.reducerPath]: equipmentCategoryAPI.reducer,
    [inExServiceAPI.reducerPath]: inExServiceAPI.reducer,
    [permitAPI.reducerPath]: permitAPI.reducer,
    [tourTypeAPI.reducerPath]: tourTypeAPI.reducer,
    [trekAPI.reducerPath]: trekAPI.reducer,
    [chunkFileUploadAPI.reducerPath]: chunkFileUploadAPI.reducer,
    [trekCategoryAPI.reducerPath]: trekCategoryAPI.reducer,
    [trekRegionAPI.reducerPath]: trekRegionAPI.reducer,
    [blogAPI.reducerPath]: blogAPI.reducer,
    [bannerAPI.reducerPath]: bannerAPI.reducer,
    [destinationAPI.reducerPath]: destinationAPI.reducer,
    [settingAPI.reducerPath]: settingAPI.reducer,
    [mediaLibraryAPI.reducerPath]: mediaLibraryAPI.reducer,
    [localizationAPI.reducerPath]: localizationAPI.reducer,
    [moduleAPI.reducerPath]: moduleAPI.reducer,
    [permissionAPI.reducerPath]: permissionAPI.reducer,
    [htmlBuilderAPI.reducerPath]: htmlBuilderAPI.reducer,
    [openIddictAdminAPI.reducerPath]: openIddictAdminAPI.reducer,



  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAPI.middleware,
      menuAPI.middleware,
      aiAssistantAPI.middleware,
      categoryAPI.middleware,
      collectionAPI.middleware,
      knowledgeBaseAPI.middleware,
      llmProviderAPI.middleware,
      moderationAPI.middleware,
      systemPromptAPI.middleware,
      themeAPI.middleware,
      supportAPI.middleware,
      accessibilityAPI.middleware,
      activityLevelAPI.middleware,
      activityTypeAPI.middleware,
      bookingAPI.middleware,
      cityAPI.middleware,
      currencyAPI.middleware,
      equipmentAPI.middleware,
      equipmentCategoryAPI.middleware,
      inExServiceAPI.middleware,
      permitAPI.middleware,
      tourTypeAPI.middleware,
      trekAPI.middleware,
      chunkFileUploadAPI.middleware,
      trekCategoryAPI.middleware,
      trekRegionAPI.middleware,
      blogAPI.middleware,
      bannerAPI.middleware,
      destinationAPI.middleware,
      settingAPI.middleware,
      mediaLibraryAPI.middleware,
      localizationAPI.middleware,
      moduleAPI.middleware,
      permissionAPI.middleware,
      htmlBuilderAPI.middleware,
      openIddictAdminAPI.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
