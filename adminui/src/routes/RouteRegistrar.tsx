import { RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard/Home";
import NotFound from "../pages/OtherPage/NotFound";
import LLMProvider from "../pages/SuperUser/AIAssistant/LLMProvider";
import NewLLMProvider from "../pages/SuperUser/AIAssistant/NewLLMProvider";
import SignIn from "../pages/AuthPages/SignIn";
import AIAssistant from "../pages/SuperUser/AIAssistant/AIAssistant";
import AIAssistantForm from "../pages/SuperUser/AIAssistant/AIAssistantForm";
import TaskBuilder from "../pages/SuperUser/BrowserAgentTask/TaskBuilder";
import AIAssistantSetting from "../pages/SuperUser/AIAssistant/AIAssistantSetting";
import Category from "../pages/SuperUser/AIAssistant/Category";
import CategoryForm from "../pages/SuperUser/AIAssistant/CategoryForm";
import SysPrompt from "../pages/SuperUser/AIAssistant/SysPrompt";
import SysPromptForm from "../pages/SuperUser/AIAssistant/SysPromptForm";
import Moderation from "../pages/SuperUser/AIAssistant/Moderation";
import Theme from "../pages/SuperUser/AIAssistant/Theme";
import ThemeForm from "../pages/SuperUser/AIAssistant/ThemeForm";
import AIAssistantPromt from "../pages/SuperUser/AIAssistant/AIAssistantPromt";
import AccessibilityList from "../pages/SuperUser/Trek/Accessibility/AccessibilityList";
import AccessibilityForm from "../pages/SuperUser/Trek/Accessibility/AccessibilityForm";
import ActivityLevelList from "../pages/SuperUser/Trek/ActivityLevel/ActivityLevelList";
import ActivityLevelForm from "../pages/SuperUser/Trek/ActivityLevel/ActivityLevelForm";
import ActivityTypeList from "../pages/SuperUser/Trek/ActivityType/ActivityTypeList";
import ActivityTypeForm from "../pages/SuperUser/Trek/ActivityType/ActivityTypeForm";
import CityList from "../pages/SuperUser/Trek/City/CityList";
import CityForm from "../pages/SuperUser/Trek/City/CityForm";
import CurrencyList from "../pages/SuperUser/Trek/Currency/CurrencyList";
import CurrencyForm from "../pages/SuperUser/Trek/Currency/CurrencyForm";
import EquipmentList from "../pages/SuperUser/Trek/Equipment/EquipmentList";
import EquipmentForm from "../pages/SuperUser/Trek/Equipment/EquipmentForm";
import EquipmentCategoryList from "../pages/SuperUser/Trek/EquipmentCategory/EquipmentCategoryList";
import EquipmentCategoryForm from "../pages/SuperUser/Trek/EquipmentCategory/EquipmentCategoryForm";
import InExServiceList from "../pages/SuperUser/Trek/InExService/InExServiceList";
import InExServiceForm from "../pages/SuperUser/Trek/InExService/InExServiceForm";
import PermitList from "../pages/SuperUser/Trek/Permit/PermitList";
import PermitForm from "../pages/SuperUser/Trek/Permit/PermitForm";
import TourTypeList from "../pages/SuperUser/Trek/TourType/TourTypeList";
import TourTypeForm from "../pages/SuperUser/Trek/TourType/TourTypeForm";
import TrekList from "../pages/SuperUser/Trek/Trek/TrekList";
import TrekForm from "../pages/SuperUser/Trek/Trek/TrekForm";
import BookingList from "../pages/SuperUser/Trek/Booking/BookingList";
import BookingForm from "../pages/SuperUser/Trek/Booking/BookingForm";
import BookingDetail from "../pages/SuperUser/Trek/Booking/BookingDetail";
import TrekRegionForm from "../pages/SuperUser/Trek/Region/TrekRegionForm";
import TrekRegionList from "../pages/SuperUser/Trek/Region/TrekRegionList";
import TrekCategoryList from "../pages/SuperUser/Trek/Category/TrekCategoryList";
import TrekCategoryForm from "../pages/SuperUser/Trek/Category/TrekCategoryForm";


const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <><p>Hello</p></>
  },
  {
    path: "/signin",
    element: <SignIn />,

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
  path: "/superadmin",
  element: <AdminLayout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
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

    { path: "trek/trek", element: <TrekList /> },
    { path: "trek/trek/new", element: <TrekForm /> },
    { path: "trek/trek/edit", element: <TrekForm /> },
    { path: "trek/region", element: <TrekRegionList /> },
    { path: "trek/region/new", element: <TrekRegionForm /> },
    { path: "trek/region/edit", element: <TrekRegionForm /> },
    { path: "trek/category", element: <TrekCategoryList /> },
    { path: "trek/category/new", element: <TrekCategoryForm /> },
    { path: "trek/category/edit", element: <TrekCategoryForm /> },

    { path: "trek/booking", element: <BookingList /> },
    { path: "trek/booking/new", element: <BookingForm /> },
    { path: "trek/booking/detail", element: <BookingDetail /> },
    { path: "trek/booking/edit", element: <BookingForm /> },
  ],
};
const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "aiassistant", element: <AIAssistant /> },
    { path: "aiassistant/new", element: <AIAssistantForm /> },
    { path: "aiassistant/edit", element: <AIAssistantForm /> },
    { path: "aiassistant/setting", element: <AIAssistantSetting /> },
    { path: "agent/taskbuilder", element: <TaskBuilder /> },
  ],
};

const registerdRoutes: RouteObject[] = [
  ...appRoutes,
  superUserRoutes,
  // adminRoutes,
  notFound,
];

export default registerdRoutes;