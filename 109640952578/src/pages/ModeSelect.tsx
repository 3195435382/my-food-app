import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F6F7FF] to-white p-8 space-y-8 pb-32">
      {/* 顶部返回按钮 */}
      <div className="absolute top-6 left-6">
        <motion.button 
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-[#E6E8FF] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i class="fa-solid fa-arrow-left text-xl text-[#6C63FF]"></i>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {/* 外卖卡片 */}
        <motion.div 
          className="w-full max-w-md h-64 bg-gradient-to-br from-[#6C63FF] to-[#8A85FF] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/takeout-filter')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          key="takeout-card"
        >
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <i class="fa-solid fa-utensils text-4xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold text-white">外卖点餐</h2>
          <p className="text-white/80 mt-2 text-center">智能推荐安全、营养的外卖选择</p>
        </motion.div>

        {/* 烹饪卡片 */}
        <motion.div 
          className="w-full max-w-md h-64 bg-gradient-to-br from-[#00C9A7] to-[#00D4B1] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/cooking-filter')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          key="cooking-card"
        >
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <i class="fa-solid fa-kitchen-set text-4xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold text-white">家常烹饪</h2>
          <p className="text-white/80 mt-2 text-center">根据您的技能和工具推荐菜谱</p>
        </motion.div>
      </AnimatePresence>

      {/* 查看所有菜品按钮 */}
      <motion.button
        onClick={() => navigate('/dish-gallery')}
        className="fixed bottom-6 left-6 right-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white rounded-xl text-lg font-medium shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i class="fa-solid fa-book-open mr-2"></i>
        查看所有菜品
      </motion.button>
    </div>
  );
}
