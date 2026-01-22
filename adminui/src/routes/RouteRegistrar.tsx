import { RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard/Home";
import NotFound from "../pages/OtherPage/NotFound";
import LLMProvider from "../pages/Admin/AIAssistant/LLMProvider";
import NewLLMProvider from "../pages/Admin/AIAssistant/NewLLMProvider";
import SignIn from "../pages/AuthPages/SignIn";
import AIAssistant from "../pages/Admin/AIAssistant/AIAssistant";
import AIAssistantForm from "../pages/Admin/AIAssistant/AIAssistantForm";
import TaskBuilder from "../pages/Admin/BrowserAgentTask/TaskBuilder";
import AIAssistantSetting from "../pages/Admin/AIAssistant/AIAssistantSetting";
import Category from "../pages/Admin/AIAssistant/Category";
import CategoryForm from "../pages/Admin/AIAssistant/CategoryForm";
import SysPrompt from "../pages/Admin/AIAssistant/SysPrompt";
import SysPromptForm from "../pages/Admin/AIAssistant/SysPromptForm";
import Moderation from "../pages/Admin/AIAssistant/Moderation";
import Theme from "../pages/Admin/AIAssistant/Theme";
import ThemeForm from "../pages/Admin/AIAssistant/ThemeForm";
import AIAssistantPromt from "../pages/Admin/AIAssistant/AIAssistantPromt";
import AccessibilityList from "../pages/Admin/Trek/Accessibility/AccessibilityList";
import AccessibilityForm from "../pages/Admin/Trek/Accessibility/AccessibilityForm";
import ActivityLevelList from "../pages/Admin/Trek/ActivityLevel/ActivityLevelList";
import ActivityLevelForm from "../pages/Admin/Trek/ActivityLevel/ActivityLevelForm";
import ActivityTypeList from "../pages/Admin/Trek/ActivityType/ActivityTypeList";
import ActivityTypeForm from "../pages/Admin/Trek/ActivityType/ActivityTypeForm";
import CityList from "../pages/Admin/Trek/City/CityList";
import CityForm from "../pages/Admin/Trek/City/CityForm";
import CurrencyList from "../pages/Admin/Trek/Currency/CurrencyList";
import CurrencyForm from "../pages/Admin/Trek/Currency/CurrencyForm";
import EquipmentList from "../pages/Admin/Trek/Equipment/EquipmentList";
import EquipmentForm from "../pages/Admin/Trek/Equipment/EquipmentForm";
import EquipmentCategoryList from "../pages/Admin/Trek/EquipmentCategory/EquipmentCategoryList";
import EquipmentCategoryForm from "../pages/Admin/Trek/EquipmentCategory/EquipmentCategoryForm";
import InExServiceList from "../pages/Admin/Trek/InExService/InExServiceList";
import InExServiceForm from "../pages/Admin/Trek/InExService/InExServiceForm";
import PermitList from "../pages/Admin/Trek/Permit/PermitList";
import PermitForm from "../pages/Admin/Trek/Permit/PermitForm";
import TourTypeList from "../pages/Admin/Trek/TourType/TourTypeList";
import TourTypeForm from "../pages/Admin/Trek/TourType/TourTypeForm";
import BookingList from "../pages/Admin/Trek/Booking/BookingList";
import BookingForm from "../pages/Admin/Trek/Booking/BookingForm";
import BookingDetail from "../pages/Admin/Trek/Booking/BookingDetail";
import TrekRegionForm from "../pages/Admin/Trek/Region/TrekRegionForm";
import TrekRegionList from "../pages/Admin/Trek/Region/TrekRegionList";
import TrekCategoryList from "../pages/Admin/Trek/Category/TrekCategoryList";
import AdminTrekManagement from "../pages/Admin/Trek/Trek/AdminTrekManagement";
import TrekFormPage from "../pages/Admin/Trek/Trek/TrekFormPage";
import DestinationList from "../pages/Admin/Trek/Destination/DestinationList";
import DestinationForm from "../pages/Admin/Trek/Destination/DestinationForm";
import MenuManagement from "../pages/Admin/Menu/MenuManagement";
import BlogList from "../pages/Admin/Blog/BlogList";
import BlogForm from "../pages/Admin/Blog/BlogForm";
import PostCategoryList from "../pages/Admin/Blog/PostCategoryList";
import PostCategoryForm from "../pages/Admin/Blog/PostCategoryForm";
import BlogSettingForm from "../pages/Admin/Blog/BlogSettingForm";
import BannerList from "../pages/Admin/Banner/BannerList";
import BannerForm from "../pages/Admin/Banner/BannerForm";
import BannerSlideEditor from "../pages/Admin/Banner/BannerSlideEditor";
import CSP from "../pages/Admin/Setting/CSP";
import API from "../pages/Admin/Setting/API";
import Basic from "../pages/Admin/Setting/Basic";
import File from "../pages/Admin/Setting/File";
import Web from "../pages/Admin/Setting/Web";
import Localization from "../pages/Admin/Sys/Localization";
import LocalizationForm from "../pages/Admin/Sys/LocalizationForm";
import SEOList from "../pages/Admin/SEO/SEOList";
import SEOForm from "../pages/Admin/SEO/SEOForm";
import BuilderPage from "../pages/Admin/HtmlBuilder/BuilderPage";
import MediaLibraryPage from "../pages/Admin/MediaLibrary/MediaLibraryPage";
import ComponentBuilderList from "../pages/Admin/HtmlBuilder/ComponentBuilderList";
import ComponentBuilder from "../pages/Admin/HtmlBuilder/ComponentBuilder";
import UserManagement from "../pages/Admin/User/UserManagement";
import FormUser from "../pages/Admin/User/FormUser";
import RoleManagement from "../pages/Admin/Role/RoleManagement";
import FormRole from "../pages/Admin/Role/FormRole";
import ClientList from "../pages/Admin/Client/ClientList";
import ClientForm from "../pages/Admin/Client/ClientForm";
import GrantList from "../pages/Admin/Client/GrantList";
import GrantForm from "../pages/Admin/Client/GrantForm";
import ApiResourceList from "../pages/Admin/Client/ApiResourceList";
import ApiResourceForm from "../pages/Admin/Client/ApiResourceForm";
import ApiScopeList from "../pages/Admin/Client/ApiScopeList";
import ApiScopeForm from "../pages/Admin/Client/ApiScopeForm";
import IdentityResourceList from "../pages/Admin/Client/IdentityResourceList";
import IdentityResourceForm from "../pages/Admin/Client/IdentityResourceForm";
import AuthCallback from "../pages/AuthPages/AuthCallback";
import TrekCategoryForm from "../pages/Admin/Trek/Category/TrekCategoryForm";

const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/signup",
    element: <SignIn />
  }

];

const notFound: RouteObject = {
  path: "*",
  element: <NotFound />,
};

const superUserRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "menu", element: <MenuManagement /> },
    { path: "setting/csp", element: <CSP /> },
    { path: "setting/api", element: <API /> },
    { path: "setting/basic", element: <Basic /> },
    { path: "setting/file", element: <File /> },
    { path: "setting/web", element: <Web /> },
    { path: "htmlbuilder", element: <BuilderPage /> },
    { path: "componentbuilder", element: <ComponentBuilderList /> },
    { path: "componentbuilder/new", element: <ComponentBuilder /> },
    { path: "componentbuilder/edit", element: <ComponentBuilder /> },
    { path: "media", element: <MediaLibraryPage /> },
    { path: "user", element: <UserManagement /> },
    { path: "user/new", element: <FormUser /> },
    { path: "user/edit", element: <FormUser /> },
    { path: "role", element: <RoleManagement /> },
    { path: "role/new", element: <FormRole /> },
    { path: "role/edit", element: <FormRole /> },

    { path: "client", element: <ClientList /> },
    { path: "client/new", element: <ClientForm /> },
    { path: "client/edit/:id", element: <ClientForm /> },

    // OpenIddict - Grants
    { path: "openiddict/grant", element: <GrantList /> },
    { path: "openiddict/grant/new", element: <GrantForm /> },
    { path: "openiddict/grant/edit", element: <GrantForm /> },

    // OpenIddict - API Resources
    { path: "openiddict/apiresource", element: <ApiResourceList /> },
    { path: "openiddict/apiresource/new", element: <ApiResourceForm /> },
    { path: "openiddict/apiresource/edit", element: <ApiResourceForm /> },

    // OpenIddict - API Scopes
    { path: "openiddict/apiscope", element: <ApiScopeList /> },
    { path: "openiddict/apiscope/new", element: <ApiScopeForm /> },
    { path: "openiddict/apiscope/edit", element: <ApiScopeForm /> },

    // OpenIddict - Identity Resources
    { path: "openiddict/identityresource", element: <IdentityResourceList /> },
    { path: "openiddict/identityresource/new", element: <IdentityResourceForm /> },
    { path: "openiddict/identityresource/edit", element: <IdentityResourceForm /> },

    //{ path: "setting/optimization", element: <Optimization /> },

    { path: "localization", element: <Localization /> },
    { path: "localization/new", element: <LocalizationForm /> },
    { path: "localization/edit/:id", element: <LocalizationForm /> },

    { path: "blog", element: <BlogList /> },
    { path: "blog/new", element: <BlogForm /> },
    { path: "blog/edit", element: <BlogForm /> },
    { path: "blog/setting", element: <BlogSettingForm /> },
    { path: "blog/category", element: <PostCategoryList /> },
    { path: "blog/category/new", element: <PostCategoryForm /> },
    { path: "blog/category/new", element: <PostCategoryForm /> },
    { path: "blog/category/edit", element: <PostCategoryForm /> },

    { path: "seo", element: <SEOList /> },
    { path: "seo/new", element: <SEOForm /> },
    { path: "seo/edit", element: <SEOForm /> },

    { path: "destination", element: <DestinationList /> },
    { path: "destination/new", element: <DestinationForm /> },
    { path: "destination/edit", element: <DestinationForm /> },

    { path: "llmprovider", element: <LLMProvider /> },
    { path: "llmprovider/new", element: <NewLLMProvider /> },
    { path: "llmprovider/edit", element: <NewLLMProvider /> },

    { path: "aiassistant", element: <AIAssistant /> },
    { path: "aiassistant/new", element: <AIAssistantForm /> },
    { path: "aiassistant/edit", element: <AIAssistantForm /> },
    { path: "aiassistant/setting", element: <AIAssistantSetting /> },
    { path: "aiassistant/prompt", element: <AIAssistantPromt /> },
    { path: "category", element: <Category /> },
    { path: "category/new", element: <CategoryForm /> },
    { path: "category/edit", element: <CategoryForm /> },

    { path: "systemprompt", element: <SysPrompt /> },
    { path: "systemprompt/new", element: <SysPromptForm /> },
    { path: "systemprompt/edit", element: <SysPromptForm /> },
    { path: "moderation", element: <Moderation /> },
    { path: "assistant/theme", element: <Theme /> },
    { path: "assistant/theme/new", element: <ThemeForm /> },
    { path: "assistant/theme/edit", element: <ThemeForm /> },


    { path: "agent/taskbuilder", element: <TaskBuilder /> },

    { path: "trek/accessibility", element: <AccessibilityList /> },
    { path: "trek/accessibility/new", element: <AccessibilityForm /> },
    { path: "trek/accessibility/edit", element: <AccessibilityForm /> },

    { path: "trek/activitylevel", element: <ActivityLevelList /> },
    { path: "trek/activitylevel/new", element: <ActivityLevelForm /> },
    { path: "trek/activitylevel/edit", element: <ActivityLevelForm /> },

    { path: "trek/activitytype", element: <ActivityTypeList /> },
    { path: "trek/activitytype/new", element: <ActivityTypeForm /> },
    { path: "trek/activitytype/edit", element: <ActivityTypeForm /> },

    { path: "trek/city", element: <CityList /> },
    { path: "trek/city/new", element: <CityForm /> },
    { path: "trek/city/edit", element: <CityForm /> },

    { path: "trek/currency", element: <CurrencyList /> },
    { path: "trek/currency/new", element: <CurrencyForm /> },
    { path: "trek/currency/edit", element: <CurrencyForm /> },

    { path: "trek/equipment", element: <EquipmentList /> },
    { path: "trek/equipment/new", element: <EquipmentForm /> },
    { path: "trek/equipment/edit", element: <EquipmentForm /> },

    { path: "trek/equipmentcategory", element: <EquipmentCategoryList /> },
    { path: "trek/equipmentcategory/new", element: <EquipmentCategoryForm /> },
    { path: "trek/equipmentcategory/edit", element: <EquipmentCategoryForm /> },

    { path: "trek/inexservice", element: <InExServiceList /> },
    { path: "trek/inexservice/new", element: <InExServiceForm /> },
    { path: "trek/inexservice/edit", element: <InExServiceForm /> },

    { path: "trek/permit", element: <PermitList /> },
    { path: "trek/permit/new", element: <PermitForm /> },
    { path: "trek/permit/edit", element: <PermitForm /> },

    { path: "trek/tourtype", element: <TourTypeList /> },
    { path: "trek/tourtype/new", element: <TourTypeForm /> },
    { path: "trek/tourtype/edit", element: <TourTypeForm /> },

    { path: "trek/trek", element: <AdminTrekManagement /> },
    { path: "trek/trek/new", element: <TrekFormPage /> },
    { path: "trek/trek/edit", element: <TrekFormPage /> },

    { path: "trek/region", element: <TrekRegionList /> },
    { path: "trek/region/new", element: <TrekRegionForm /> },
    { path: "trek/region/edit", element: <TrekRegionForm /> },
    { path: "trek/category", element: <TrekCategoryList /> },
    { path: "trek/category/new", element: <TrekCategoryForm /> },
    { path: "trek/category/edit", element: <TrekCategoryForm /> },
    { path: "trek/destination", element: <DestinationList /> },


    { path: "trek/booking", element: <BookingList /> },
    { path: "trek/booking/new", element: <BookingForm /> },
    { path: "trek/booking/detail", element: <BookingDetail /> },
    { path: "trek/booking/edit", element: <BookingForm /> },

    { path: "banner", element: <BannerList /> },
    { path: "banner/new", element: <BannerForm /> },
    { path: "banner/edit", element: <BannerForm /> },
    { path: "banner/slides", element: <BannerSlideEditor /> },


  ],
};


const registerdRoutes: RouteObject[] = [
  ...appRoutes,
  superUserRoutes,
  // adminRoutes,
  notFound,
];

export default registerdRoutes;