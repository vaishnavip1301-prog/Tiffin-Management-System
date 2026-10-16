
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="app-layout">
        <Navbar></Navbar>

      <main className="main-content">
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
}

export default MainLayout;
