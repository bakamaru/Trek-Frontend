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