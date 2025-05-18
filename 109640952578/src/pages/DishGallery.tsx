import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { dishes } from "@/lib/dishes";

export default function DishGallery() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F6F7FF] p-6 pb-24">
      {/* 顶部返回导航 */}
      <div className="flex items-center mb-8">
        <motion.button 
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-[#E6E8FF] transition-colors z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i class="fa-solid fa-arrow-left text-xl text-[#6C63FF]"></i>
        </motion.button>
        <h1 className="text-2xl font-bold ml-4 text-[#2D3748]">所有菜品</h1>
      </div>

      {/* 菜品网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishes.map((dish) => (
          <motion.div 
            key={dish.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E2E8F0]"
            whileHover={{ y: -4 }}
          >
            <div className="w-full h-48 flex items-center justify-center bg-gray-50 p-4">
              <img 
                src={dish.image} 
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#2D3748]">{dish.name}</h3>
              <p className="text-[#718096] text-sm mt-1">{dish.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}