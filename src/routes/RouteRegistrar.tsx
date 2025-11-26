import { RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import PublicLayout from "../layout/PublicLayout";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/OtherPage/NotFound";
import LLMProvider from "../pages/SuperUser/AIAssistant/LLMProvider";
import NewLLMProvider from "../pages/SuperUser/AIAssistant/NewLLMProvider";
import SignIn from "../pages/AuthPages/SignIn";
import AIAssistant from "../pages/SuperUser/AIAssistant/AIAssistant";
import AIAssistantForm from "../pages/SuperUser/AIAssistant/AIAssistantForm";
import TaskBuilder from "../pages/SuperUser/BrowserAgentTask/TaskBuilder";
import AIAssistantSetting from "../pages/SuperUser/AIAssistant/AIAssistantSetting";
import ChatApp from "../pages/ChatApp";
import Category from "../pages/SuperUser/AIAssistant/Category";
import CategoryForm from "../pages/SuperUser/AIAssistant/CategoryForm";
import SysPrompt from "../pages/SuperUser/AIAssistant/SysPrompt";
import SysPromptForm from "../pages/SuperUser/AIAssistant/SysPromptForm";
import Moderation from "../pages/SuperUser/AIAssistant/Moderation";
import Theme from "../pages/SuperUser/AIAssistant/Theme";
import ThemeForm from "../pages/SuperUser/AIAssistant/ThemeForm";
import AIAssistantPromt from "../pages/SuperUser/AIAssistant/AIAssistantPromt";
import About from "../pages/About";
import AccessDenied from "../pages/AccessDenied";
import Contact from "../pages/Contact";
import TrekDetail from "../pages/TrekDetail";
import TourDetail from "../pages/TourDetail";
import Checkout from "../pages/Checkout";
import Confirmation from "../pages/Confirmation";
import BlogList from "../pages/BlogList";
import BlogDetail from "../pages/BlogDetail";
import Destinations from "../pages/Destinations";
import DestinationDetail from "../pages/DestinationDetail";
import FlightList from "../pages/FlightList";
import FlightDetail from "../pages/FlightDetail";
import CarList from "../pages/CarList";
import CarDetail from "../pages/CarDetail";
import HotelList from "../pages/HotelList";
import HotelDetail from "../pages/HotelDetail";
//import DashboardLayout from "../components/dashboard/DashboardLayout";

import MyBookings from "../pages/Dashboard/MyBookings";
import MyRewards from "../pages/Dashboard/MyRewards";
import MyInvoices from "../pages/Dashboard/MyInvoices";
import MyProfile from "../pages/Dashboard/MyProfile";
import ChangePassword from "../pages/Dashboard/ChangePassword";
import MyReviews from "../pages/Dashboard/MyReviews";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Booking from "../pages/Booking";
import TourBooking from "../pages/TourBooking";
import TripPlanner from "../pages/TripPlanner";


const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: "/about",
    element: <PublicLayout />,
    children: [
      { index: true, element: <About /> },
    ],
  },
  {
    path: "/contact",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Contact /> },
    ],
  },
  {
    path: "/access-denied",
    element: <PublicLayout />,
    children: [
      { index: true, element: <AccessDenied /> },
    ],
  },
  {
    path: "/trek/:slug",
    element: <PublicLayout />,
    children: [
      { index: true, element: <TrekDetail /> },
    ],
  },
   {
    path: "/trek/:slug/booking",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Booking   /> },
    ],
  },
  {
    path: "/tour/:slug",
    element: <PublicLayout />,
    children: [
      { index: true, element: <TourDetail /> },
    ],
  },
   {
    path: "/tour/:slug/booking",
    element: <PublicLayout />,
    children: [
      { index: true, element: <TourBooking   /> },
    ],
  },
  {
    path: "/checkout",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Checkout /> },
    ],
  },
  {
    path: "/booking-confirmation",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Confirmation /> },
    ],
  },
  {
    path: "/blog",
    element: <PublicLayout />,
    children: [
      { index: true, element: <BlogList /> },
    ],
  },
  {
    path: "/blog/:slug",
    element: <PublicLayout />,
    children: [
      { index: true, element: <BlogDetail /> },
    ],
  },
   {
    path: "/destinations",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Destinations /> },
    ],
  },
  
  // {
  //   path: "/destinations/:slug",
  //   element: <PublicLayout />,
  //   children: [
  //     { index: true, element: <DestinationDetail /> },
  //   ],
  // },
  // {
  //   path: "/flights",
  //   element: <PublicLayout />,
  //   children: [
  //     { index: true, element: <FlightList /> },
  //   ],
  // },
  
  // {
  //   path: "/flights/:slug",
  //   element: <PublicLayout />,
  //   children: [
  //     { index: true, element: <FlightDetail /> },
  //   ],
  // },
  {
    path: "/cars",
    element: <PublicLayout />,
    children: [
      { index: true, element: <CarList /> },
    ],
  },
  {
    path: "/cars/:slug",
    element: <PublicLayout />,
    children: [
      { index: true, element: <CarDetail /> },
    ],
  },
  {
    path: "/hotels",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HotelList /> },
    ],
  },
  {
    path: "/hotels/:slug",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HotelDetail /> },
    ],
  },
  {
    path: "/trip-planner",
    element: <PublicLayout />,
    children: [
      { index: true, element: <TripPlanner /> },
    ],
  },
  
  { path: "/user/dashboard", element: <PublicLayout />,
    children: [
      { index: true, element: <DashboardLayout ><Dashboard /></DashboardLayout> },
    ] },
  { path: "/user/dashboard/bookings", element: <DashboardLayout ><MyBookings /> </DashboardLayout> },
  { path: "/user/dashboard/rewards", element: <DashboardLayout ><MyRewards /></DashboardLayout> },
  { path: "/user/dashboard/invoices", element: <DashboardLayout ><MyInvoices /></DashboardLayout> },
  { path: "/user/dashboard/profile", element: <DashboardLayout ><MyProfile /></DashboardLayout> },
  { path: "/user/dashboard/password", element: <DashboardLayout ><ChangePassword /> </DashboardLayout> },
  { path: "/user/dashboard/reviews", element: <DashboardLayout ><MyReviews /></DashboardLayout> },

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