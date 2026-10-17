
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import OurStory from "./pages/About/OurStory";
import WhyChooseUs from "./pages/About/WhyChooseUs";
import OurKitchen from "./pages/About/OurKitchen";
import Menu from "./pages/Menu/Menu";
import DailyTiffin from "./pages/Menu/DailyTiffin";
import HealthyMeals from "./pages/Menu/HealthyMeals";
import SpecialDishes from "./pages/Menu/SpecialDishes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/our-story" element={<OurStory/>}/>
          <Route path="/about/why-choose-us" element={<WhyChooseUs/>}/>
          <Route path="/about/our-kitchen" element={<OurKitchen/>}/>
          <Route path="/menu" element={<Menu/>}/>
          <Route path="/menu/daily-meal" element={<DailyTiffin />} />
          <Route path="/menu/healthy-meals" element={<HealthyMeals />} />
          <Route path="/menu/special-dishes" element={<SpecialDishes/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
