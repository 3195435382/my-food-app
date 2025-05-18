import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Dish } from "@/lib/dishes";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { phaseKnowledge } from "@/lib/medicalData";

import { dishes } from "@/lib/dishes";

// 导出mockDishes保持向后兼容
export const mockDishes = dishes;

const exerciseEquivalents = [
  { type: "步行", minutes: 60, icon: "fa-person-walking" },
  { type: "跑步", minutes: 25, icon: "fa-person-running" },
  { type: "游泳", minutes: 30, icon: "fa-person-swimming" }
];

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(false);
  const [currentDish, setCurrentDish] = useState<Dish | null>(dishes[0]); // 设置默认菜品
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [isFirstRecommendation, setIsFirstRecommendation] = useState(true);

  // 根据搜索词过滤菜品
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = mockDishes.filter(dish => 
        dish.name.toLowerCase().includes(query) || 
        dish.desc.toLowerCase().includes(query)
      );
      setFilteredDishes(results);
    } else {
      setFilteredDishes([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    setIsMounted(true);
    // 组件挂载时立即执行一次随机推荐
    handleNewRecommendation();
    return () => setIsMounted(false);
  }, []);

  // 获取来自筛选页的数据，提供默认值
  const filterData = location.state || { from: 'takeout' };
  
  const handleBackToMode = () => {
    navigate("/mode-select");
  };

  const handleReselect = () => {
    // 根据来源直接导航到对应筛选页面
    if (filterData.from === 'takeout') {
      localStorage.removeItem('takeoutFilters');
      navigate('/takeout-filter');
    } else {
      localStorage.removeItem('cookingFilters');
      navigate('/cooking-filter');
    }
  };

  const getNutritionColor = (level: string) => {
    switch(level) {
      case "red": return "bg-[#FF5252]";
      case "yellow": return "bg-[#FFEB3B]";
      case "green": return "bg-[#4CAF50]";
      default: return "bg-gray-300";
    }
  };

  const [recommendationHistory, setRecommendationHistory] = useState<string[]>([]);

  const handleNewRecommendation = () => {
    if (!isMounted) return;
    
    setIsLoading(true);
    toast.dismiss();
    toast('正在获取新推荐...', {
      position: "top-center",
      duration: 1000
    });

    // 设置超时处理
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        toast.error("推荐超时，请重试");
      }
    }, 3000);

    // 简化筛选条件处理
    const filterConditions = {
      allergens: location.state?.allergens || [],
      avoidFoods: location.state?.avoidFoods || [],
      dietaryRestriction: location.state?.dietaryRestriction || { level: "none" }
    };

    // 使用更高效的随机选择算法
    requestAnimationFrame(() => {
      if (!isMounted) {
        clearTimeout(timeoutId);
        return;
      }

      try {
        // 预过滤符合条件的菜品
        let eligibleDishes = mockDishes.filter(dish => {
          // 检查过敏源
          const hasAllergen = filterConditions.allergens.some(allergen => 
            dish.tags?.some(tag => tag.value === allergen)
          );
          if (hasAllergen) return false;

          // 检查忌食条件
          const hasAvoidFood = filterConditions.avoidFoods.some(food => 
            dish.tags?.some(tag => tag.value === food) || dish.desc?.includes(food)
          );
          if (hasAvoidFood) return false;

          // 首次推荐跳过所有疾病限制
          if (isFirstRecommendation) {
            return true; // 首次推荐完全随机，不限制
          } else {
            // 后续推荐应用疾病限制
            if (filterConditions.dietaryRestriction.level === "strict" && 
                dish.nutrition?.level === "red") {
              return false;
            }
          }

          // 首次推荐不检查历史记录
          if (!isFirstRecommendation && recommendationHistory.includes(dish.id)) {
            return false;
          }

          return true;
        });

        // 如果没有符合条件的菜品，重置历史记录
        if (eligibleDishes.length === 0) {
          eligibleDishes = mockDishes.filter(dish => {
            // 基本过滤条件
            const hasAllergen = filterConditions.allergens.some(allergen => 
              dish.tags?.some(tag => tag.value === allergen)
            );
            if (hasAllergen) return false;

            const hasAvoidFood = filterConditions.avoidFoods.some(food => 
              dish.tags?.some(tag => tag.value === food) || dish.desc?.includes(food)
            );
            if (hasAvoidFood) return false;

            return true;
          });
          setRecommendationHistory([]);
        }

        // 从符合条件的菜品中随机选择
        const dishesToUse = eligibleDishes.length > 0 ? eligibleDishes : mockDishes;
        
        // 改进的随机选择算法 - 加权随机选择
        const weights = dishesToUse.map(dish => {
          // 首次推荐完全随机
          if (isFirstRecommendation) return 1.0;
          
          // 后续推荐应用权重
          if (recommendationHistory.includes(dish.id)) return 0.3;
          if (dish.tags?.some(t => t.type === "medical-condition")) return 0.8;
          return 1.0;
        });
        
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let weightSum = 0;
        let newDish = dishesToUse[0];
        
        for (let i = 0; i < dishesToUse.length; i++) {
          weightSum += weights[i];
          if (random <= weightSum) {
            newDish = dishesToUse[i];
            break;
          }
        }

        // 更新推荐历史
        setRecommendationHistory(prev => [...prev, newDish.id].slice(-10));

        setCurrentDish(newDish);
        setIsLoading(false);
        setIsFirstRecommendation(false); // 标记首次推荐已完成
        clearTimeout(timeoutId);
        toast.dismiss();
        toast.success('已获取新推荐', {
          position: "top-center",
          duration: 2000
        });
      } catch (error) {
        console.error("推荐菜品时出错:", error);
        setIsLoading(false);
        clearTimeout(timeoutId);
        toast.error("获取推荐失败，请重试");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FF] p-6 pb-32">
      {/* 顶部返回导航 */}
      <div className="flex items-center mb-4">
        <motion.button 
          onClick={() => {
            const from = location.state?.from || 'takeout';
            navigate(from === 'takeout' ? '/takeout-filter' : '/cooking-filter');
          }}
          className="p-2 rounded-full hover:bg-[#E6E8FF] transition-colors z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i class="fa-solid fa-arrow-left text-xl text-[#6C63FF]"></i>
        </motion.button>
        <h1 className="text-2xl font-bold ml-4 text-[#2D3748]">推荐结果</h1>
      </div>

      {/* 疾病提示 - 仅在选择了疾病类型时显示 */}
      {filterData.dietaryRestriction?.disease?.length > 0 && (
        <div className={`border-l-4 p-4 mb-6 rounded-r ${
          filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
            ? "bg-red-50 border-red-500"
            : "bg-blue-50 border-blue-500"
        }`}>
          <div className="flex items-start">
            <i class={`fa-solid fa-circle-info text-xl mr-3 mt-0.5 ${
              filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
                ? "text-red-500"
                : "text-blue-500"
            }`}></i>
            <div>
              <h3 className={`text-lg font-semibold mb-1 ${
                filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
                  ? "text-red-800"
                  : "text-blue-800"
              }`}>
                {filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
                  ? "严格饮食限制"
                  : "饮食建议"}
              </h3>
              <p className={filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
                  ? "text-red-700"
                  : "text-blue-700"}>
                {filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
                  ? "⚠️ 急性期严格限制: 仅能食用流质饮食(如米汤、蔬菜汁等)，避免任何固体食物"
                  : `当前推荐菜品适合: ${filterData.dietaryRestriction.disease.join("、")}患者`}
                {filterData.dietaryRestriction.phase !== "none" && 
                  ` (${
                    {
                      "acute": "急性",
                      "recovery": "恢复",
                      "chronic": "慢性",
                      "remission": "缓解",
                      "prevention": "预防"
                    }[filterData.dietaryRestriction.phase]
                  }期)`}
              </p>
               {filterData.dietaryRestriction.level !== "none" && (
                <p className={filterData.dietaryRestriction.phase === "acute" && filterData.dietaryRestriction.disease.includes("功能性消化不良")
                    ? "text-red-700 mt-1"
                    : "text-blue-700 mt-1"}>
                  饮食严格程度: {{
                    "strict": "严格忌口",
                    "moderate": "适量食用",
                    "recommended": "推荐食用"
                  }[filterData.dietaryRestriction.level]}
                </p>
              )}
           </div>






         </div>
        </div>
      )}

      {/* 搜索框 - 仅在搜索模式下显示 */}
      {filterData.isSearchMode && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索菜品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pr-12 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
            />
            <i class="fa-solid fa-magnifying-glass absolute right-4 top-4 text-[#718096]"></i>
          </div>
        </div>
      )}

      {/* 菜品卡片 - 根据是否有搜索词显示不同内容 */}
      {searchQuery.trim() ? (
        filteredDishes.length > 0 ? (
          <div className="space-y-4">
            {filteredDishes.map(dish => (
              <div key={dish.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E2E8F0]">
                <div className="w-full h-48 flex items-center justify-center bg-gray-50 p-4">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-[#2D3748]">{dish.name}</h2>
                    <motion.button
                      onClick={() => navigate(`/recipe/${dish.id}`)}
                      className="px-2 py-0.5 bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white rounded-full text-xs font-medium shadow-sm flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i class="fa-solid fa-utensils text-xs mr-1"></i>
                      查看做法
                    </motion.button>
                  </div>
                  <p className="text-[#718096]">{dish.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(dish.tags || []).map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                      >
                        {tag.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-[#E2E8F0]">
            <i class="fa-solid fa-magnifying-glass text-4xl text-[#718096] mb-4"></i>
            <p className="text-[#4A5568]">没有找到匹配的菜品</p>
            <p className="text-sm text-[#718096] mt-2">请尝试不同的搜索词</p>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-[#E2E8F0]">
           <div className="w-full min-h-[12rem] md:min-h-[28rem] max-h-[20rem] md:max-h-[40rem] flex items-center justify-center bg-gray-50 p-4">
               {isLoading ? (
                 <div className="flex flex-col items-center">
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                     className="text-4xl text-[#6C63FF] mb-4"
                   >
                     <i class="fa-solid fa-utensils"></i>
                   </motion.div>
                   <p className="text-[#4A5568]">
                     正在为您推荐菜品...
                   </p>
                 </div>
               ) : (
                 currentDish && (
                   <AnimatePresence mode="wait">
                     <motion.img 
                       src={currentDish.image} 
                       alt={currentDish.name || '菜品图片'}
                       className="w-full h-48 md:h-96 object-cover"
                       key={currentDish.id}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ 
                         opacity: 0, 
                         scale: 0.9,
                         transition: { 
                           duration: 0.3,
                           ease: "easeInOut"
                         } 
                       }}
                       transition={{ 
                         duration: 0.5,
                         ease: "easeInOut"
                       }}
                     />
                   </AnimatePresence>
                 )
               )}
           {currentDish ? (
             <AnimatePresence mode="wait">
               {currentDish?.image && (
              <motion.img 
                src={currentDish.image} 
                alt={currentDish.name || '菜品图片'}
                className="w-full h-48 md:h-96 object-cover"
                key={currentDish.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9,
                  transition: { 
                    duration: 0.3,
                    ease: "easeInOut"
                  } 
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                onAnimationComplete={() => window.scrollTo(0, 0)}
              />
            )}
             </AnimatePresence>
           ) : (
             <div className="flex flex-col items-center justify-center h-full">
               <i class="fa-solid fa-utensils text-4xl text-[#6C63FF] mb-4 animate-pulse"></i>
               <p className="text-[#4A5568]">正在为您推荐菜品...</p>
             </div>
           )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-[#2D3748]">{currentDish?.name || '未知菜品'}</h2>
            <motion.button
                onClick={() => {
                  if (!currentDish) {
                    toast.error("当前菜品信息不可用");
                    return;
                  }
                  toast(`正在跳转到${currentDish.name}的做法页面`, {
                    position: "top-center"
                  });
                  navigate(`/recipe/${currentDish.id}`);
                }}
                className="px-2 py-0.5 bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white rounded-full text-xs font-medium shadow-sm flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i class="fa-solid fa-utensils text-xs mr-1"></i>
                查看做法
              </motion.button>
            </div>
            <p className="text-[#718096]">{currentDish?.desc || '暂无描述'}</p>
            
            {/* 菜品标签 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {(currentDish?.tags || []).map((tag, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${tag?.color || 'bg-gray-100 text-gray-800'}`}
                >
                  {tag?.value || '标签'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 营养标签 - 仅在菜品加载完成时显示 */}
      {currentDish?.nutrition && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-[#E2E8F0]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#4A5568]">营养信息</h3>
            <div className={`w-4 h-4 rounded-full ${getNutritionColor(currentDish?.nutrition?.level || 'green')}`}></div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#4A5568]">热量</span>
              <span className="font-medium text-[#2D3748]">{currentDish?.nutrition?.calories || '--'} kcal</span>
            </div>
            
            <motion.button 
              className="w-full text-left py-2 flex justify-between items-center"
              onClick={() => setShowDetails(!showDetails)}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-[#4A5568]">详细营养</span>
              <i class={`fa-solid ${showDetails ? "fa-chevron-up" : "fa-chevron-down"} text-[#6C63FF]`}></i>
            </motion.button>

            <AnimatePresence mode="wait">
              {showDetails && (
                <motion.div 
                  className="mt-2 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ 
                    opacity: 0, 
                    height: 0,
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut"
                    }
                  }}
                  transition={{ 
                    duration: 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <div className="flex justify-between">
                    <span className="text-[#4A5568]">蛋白质</span>
                    <span className="text-[#2D3748]">{currentDish?.nutrition?.protein || '--'}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5568]">脂肪</span>
                    <span className="text-[#2D3748]">{currentDish?.nutrition?.fat || '--'}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5568]">碳水化合物</span>
                    <span className="text-[#2D3748]">{currentDish?.nutrition?.carbs || '--'}g</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 运动量换算 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-[#E2E8F0]">
        <h3 className="text-lg font-semibold mb-4 text-[#4A5568]">运动量换算</h3>
        <div className="space-y-3">
          {exerciseEquivalents.map((exercise, index) => (
            <div key={index} className="flex items-center space-x-3">
              <i class={`fa-solid ${exercise.icon} text-[#00C9A7] text-xl`}></i>
              <span className="text-[#4A5568]">{exercise.minutes}分钟{exercise.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 安全警示 */}
      {currentDish && currentDish.safety && currentDish.safety.warning && (
        <div className="bg-[#FFF2F2] border border-[#FFD6D6] rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-2">
            <i class="fa-solid fa-triangle-exclamation text-[#FF6584] mt-1"></i>
            <div>
              <h3 className="text-lg font-semibold text-[#FF6584]">安全警示</h3>
              <p className="text-[#4A5568]">{currentDish.safety.warning}</p>
            </div>
          </div>
        </div>
      )}

      {/* 补水指数 - 仅在safety存在时显示 */}
      {currentDish?.safety?.waterIndex !== undefined && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-[#E2E8F0]">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#4A5568]">补水指数</h3>
            <div className="flex flex-col items-end">
              <div className="flex space-x-1 mb-1">
               {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    class={`fa-solid ${i < currentDish.safety.waterIndex ? "fa-droplet text-[#6C63FF]" : "fa-droplet text-[#E2E8F0]"}`}
                  ></i>
                ))}
              </div>
              <div className="text-sm text-[#718096]">
                ≈ {currentDish.safety.waterIndex * 200}ml · 
                相当于{Math.round(currentDish.safety.waterIndex * 200 / 500 * 10)/10}瓶矿泉水
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部按钮 - 仅在非搜索模式下显示 */}
      {filterData.from !== 'cooking' || !filterData.isSearchMode ? (
        <div className="fixed bottom-4 left-4 right-4 flex gap-4">
          <motion.button
            onClick={handleReselect}
            className="flex-1 py-3 bg-gradient-to-r from-[#00C9A7] to-[#00D4B1] text-white rounded-xl text-base font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            重新选择
          </motion.button>
          <motion.button
            onClick={handleNewRecommendation}
            className="flex-1 py-3 bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white rounded-xl text-base font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            继续推荐
          </motion.button>
        </div>
      ) : null}
      
      {/* 底部留白 */}
      <div className="h-16"></div>
    </div>

  );
}
