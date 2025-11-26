import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Children, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import theme from "../theme.css";


const PublicLayout: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <Header />
      <main>
        <Outlet/>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default PublicLayout;

