
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import OurStory from "./pages/About/OurStory";
import WhyChooseUs from "./pages/About/WhyChooseUs";
import OurKitchen from "./pages/About/OurKitchen";

import Menu from "./pages/Menu/Menu";
import DailyTiffin from "./pages/Menu/DailyTiffin";
import HealthyMeals from "./pages/Menu/HealthyMeals";
import SpecialDishes from "./pages/Menu/SpecialDishes";

import DailyPlan from "./pages/Mealplans/DailyMeal";
import WeeklyPlan from "./pages/Mealplans/WeeklyPlan";
import MonthlyPlan from "./pages/Mealplans/MonthlyPlan";

import Contact from "./pages/Contact/Contact";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Kitchen from "./pages/Admin/Kitchen";
import MenuCategories from "./pages/Admin/MenuCategories";
import MenuItem from "./pages/Admin/MenuItem";
import MealTypePage from "./pages/Admin/MealType";
import MenuSubCategory from "./pages/Admin/MenuSubCategory";
import DietaryTag from "./pages/Admin/DietaryTag";
import FoodType from "./pages/Admin/FoodType";
import Order from "./pages/Order/Order";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />
          <Route path="/about/our-story" element={<OurStory />} />
          <Route path="/about/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/about/our-kitchen" element={<OurKitchen />} />

          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/daily-meal" element={<DailyTiffin />} />
          <Route path="/menu/healthy-meals" element={<HealthyMeals />} />
          <Route path="/menu/special-dishes" element={<SpecialDishes />} />

          <Route path="/mealplans/dailyplan" element={<DailyPlan />} />
          <Route path="/mealplans/weeklyplan" element={<WeeklyPlan />} />
          <Route path="/mealplans/monthlyplan" element={<MonthlyPlan />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />}/>
            <Route path="dashboard" element={<AdminDashboard />}/>
            <Route path="kitchen" element={<Kitchen />}/>
            <Route path="menu-categories" element={<MenuCategories />}/>
            <Route path="menu-items" element={<MenuItem />} />
            <Route path="meal-types" element={<MealTypePage />} />
            <Route path="menu-subcategories" element={<MenuSubCategory />}/>
            <Route path="dietary-tags" element={<DietaryTag />} />
            <Route path="food-types" element={<FoodType />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
