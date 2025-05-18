import { Routes, Route } from "react-router-dom";
import ModeSelect from "@/pages/ModeSelect";
import Home from "@/pages/Home";
import TakeoutFilter from "@/pages/TakeoutFilter";
import CookingFilter from "@/pages/CookingFilter";
import Result from "@/pages/Result";
import RecipeDetail from "@/pages/RecipeDetail";
import DishGallery from "@/pages/DishGallery";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mode-select" element={<ModeSelect />} />
        <Route path="/takeout-filter" element={<TakeoutFilter />} />
        <Route path="/cooking-filter" element={<CookingFilter />} />
        <Route path="/result" element={<Result />} />
        <Route path="/recipe/:dishId" element={<RecipeDetail />} />
        <Route path="/dish-gallery" element={<DishGallery />} />
      </Routes>
    </AuthContext.Provider>
  );
}
