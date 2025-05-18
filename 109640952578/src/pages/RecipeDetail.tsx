import { useParams } from "react-router-dom";
import { dishes } from "@/lib/dishes";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { xiachufangAPI } from "@/lib/xiachufangMock";

export default function RecipeDetail() {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const dish = dishes.find(d => d.id === dishId);
  const [xiachufangData, setXiachufangData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchXiachufangData = async () => {
      if (!dishId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await xiachufangAPI.getDishInfo(dishId);
        setXiachufangData(data);
      } catch (err) {
        setError("获取下厨房数据失败");
        toast.error("获取下厨房数据失败");
      } finally {
        setIsLoading(false);
      }
    };

    fetchXiachufangData();
  }, [dishId]);

  if (!dish) {
    toast.error("未找到该菜品");
    navigate("/");
    return null;
  }

  // 合并标签数据
  const allTags = [
    ...(dish.tags || []),
    ...(xiachufangData?.tags || [])
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FF] p-6 pb-24">
      {/* 顶部返回导航 */}
      <div className="flex items-center mb-8">
        <motion.button 
          onClick={() => navigate("/result")}
          className="p-2 rounded-full hover:bg-[#E6E8FF] transition-colors z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i class="fa-solid fa-arrow-left text-xl text-[#6C63FF]"></i>
        </motion.button>
        <h1 className="text-2xl font-bold ml-4 text-[#2D3748]">{dish.name}做法</h1>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C63FF]"></div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 菜品卡片 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-[#E2E8F0]">
        <div className="w-full min-h-[12rem] md:min-h-[28rem] max-h-[20rem] md:max-h-[40rem] flex items-center justify-center bg-gray-50 p-4">
          <motion.img 
            src={dish.image} 
            alt={dish.name}
            className="w-full h-48 md:h-96 object-cover"
            key={dish.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* 菜品描述 */}
        <div className="px-4 pt-3">
          <p className="text-[#4A5568]">{dish.desc}</p>
          {xiachufangData?.desc && (
            <div className="mt-2">
              <p className="text-[#4A5568]">{xiachufangData.desc}</p>
              {xiachufangData.source && (
                <p className="text-sm text-gray-500 mt-1">
                  数据来源: {xiachufangData.source}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* 菜品标签 */}
        <div className="flex flex-wrap gap-2 mt-3 px-4 pb-4">
          {allTags.map((tag, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color} ${
                tag.type === 'ingredient' && 
                ['花生','坚果','土豆'].includes(tag.value) ? 
                'border-2 border-red-500 animate-pulse' : ''
              }`}
            >
              {tag.value}
              {tag.type === 'ingredient' && 
               ['花生','坚果','土豆'].includes(tag.value) && (
                <i class="fa-solid fa-triangle-exclamation ml-1 text-red-500"></i>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 做法步骤 */}
      {dish.recipe && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-[#E2E8F0]">
          <h3 className="text-lg font-semibold mb-4 text-[#4A5568]">详细做法</h3>
          <div className="space-y-4">
            {dish.recipe.steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-[#6C63FF] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-[#4A5568]">{step.step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      <div className="fixed bottom-4 left-4 right-4">
        <motion.button
          onClick={() => navigate(-1)}
          className="w-full py-3 bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white rounded-xl text-base font-medium shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          返回
        </motion.button>
      </div>
    </div>
  );
}