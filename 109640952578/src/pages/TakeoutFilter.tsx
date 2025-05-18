import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const ALLERGENS = ["乳制品", "坚果", "海鲜", "麸质", "鸡蛋", "大豆", "贝类", "芝麻"];
const AVOID_FOODS = ["辛辣", "油炸", "生冷", "腌制", "高脂", "高糖", "碳酸饮料", "酒精"];
const DISEASES = [
  // 胃病相关疾病
  "胃溃疡", "胃炎", "胃食管反流", "功能性消化不良", "胃息肉", "胃癌"
];

type DietaryRestriction = {
  level: "strict" | "moderate" | "recommended" | "none";
  phase: "acute" | "recovery" | "chronic" | "remission" | "prevention" | "none";
  disease: string[];
};

export default function TakeoutFilter() {
  const navigate = useNavigate();
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedAvoidFoods, setSelectedAvoidFoods] = useState<string[]>([]);
  const [dietaryRestriction, setDietaryRestriction] = useState<DietaryRestriction>({
    level: "none",
    phase: "none",
    disease: []
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 从localStorage加载筛选条件
  useEffect(() => {
    const savedFilters = localStorage.getItem('takeoutFilters');
    if (savedFilters) {
      const { allergens, dietaryRestriction } = JSON.parse(savedFilters);
      setSelectedAllergens(allergens);
      setDietaryRestriction(dietaryRestriction);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const toggleAllergen = (allergen: string) => {
    if (!isMounted) return;
    setSelectedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(item => item !== allergen) 
        : [...prev, allergen]
    );
  };

  const toggleAvoidFood = (food: string) => {
    if (!isMounted) return;
    setSelectedAvoidFoods(prev => 
      prev.includes(food) 
        ? prev.filter(item => item !== food) 
        : [...prev, food]
    );
  };

  const handleSubmit = () => {
    if (selectedAllergens.length === 0 && dietaryRestriction.level === "none" && dietaryRestriction.phase === "none") {
      toast("已应用无限制筛选条件", {
        position: "top-center",
        duration: 2000
      });
    }
    // 存储筛选条件
    localStorage.setItem('takeoutFilters', JSON.stringify({
      allergens: selectedAllergens,
      avoidFoods: selectedAvoidFoods,
      dietaryRestriction
    }));
    navigate("/result", {
      state: {
        allergens: selectedAllergens,
        avoidFoods: selectedAvoidFoods,
        dietaryRestriction,
        from: 'takeout'
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FF] p-6 pb-24">
      {/* 顶部返回导航 */}
      <div className="flex items-center mb-8">
        <motion.button 
          onClick={() => navigate("/mode-select")}
          className="p-2 rounded-full hover:bg-[#E6E8FF] transition-colors z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i class="fa-solid fa-arrow-left text-xl text-[#00C9A7]"></i>
        </motion.button>
        <h1 className="text-2xl font-bold ml-4 text-[#2D3748]">外卖筛选条件</h1>
      </div>

      {/* 过敏源筛选 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#4A5568]">过敏源筛选</h2>
        <div className="flex flex-wrap gap-3">
          {ALLERGENS.map(allergen => (
            <motion.button
              key={allergen}
              onClick={() => toggleAllergen(allergen)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 rounded-full border-2 transition-all",
                selectedAllergens.includes(allergen)
                  ? "bg-[#6C63FF] text-white border-transparent"
                  : "bg-white border-[#E2E8F0] hover:border-[#6C63FF]"
              )}
            >
              {allergen}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 忌食条件筛选 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#4A5568]">忌食条件</h2>
        <div className="flex flex-wrap gap-3">
          {AVOID_FOODS.map(food => (
            <motion.button
              key={food}
              onClick={() => toggleAvoidFood(food)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 rounded-full border-2 transition-all",
                selectedAvoidFoods.includes(food)
                  ? "bg-[#00C9A7] text-white border-transparent"
                  : "bg-white border-[#E2E8F0] hover:border-[#00C9A7]"
              )}
            >
              {food}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 病患饮食 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#4A5568]">病患饮食限制</h2>
          
        {/* 严格程度 */}
        <div className="mb-4">
          <motion.button 
            className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-[#E2E8F0]"
            onClick={() => setExpandedSection(expandedSection === "level" ? null : "level")}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-[#4A5568]">饮食严格程度</span>
            <i class={`fa-solid ${expandedSection === "level" ? "fa-chevron-up" : "fa-chevron-down"} text-[#6C63FF]`}></i>
          </motion.button>
          
          <AnimatePresence mode="wait">
            {expandedSection === "level" && (
              <motion.div 
                className="mt-3 space-y-2 pl-2 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                key="level-options"
              >
                {[
                  { value: "none", label: "无限制", color: "bg-gray-200" },
                  { value: "strict", label: "严格忌口", color: "bg-[#FF6584]" },
                  { value: "moderate", label: "适量食用", color: "bg-[#FFB347]" },
                  { value: "recommended", label: "推荐食用", color: "bg-[#00C9A7]" }
                ].map(option => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <motion.label 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F6F7FF] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="diet-level"
                        checked={dietaryRestriction.level === option.value}
                        onChange={() => setDietaryRestriction({...dietaryRestriction, level: option.value as any})}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full ${option.color} border-2 ${dietaryRestriction.level === option.value ? "border-[#6C63FF]" : "border-[#E2E8F0]"} flex items-center justify-center`}>
                        {dietaryRestriction.level === option.value && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className="text-[#4A5568]">{option.label}</span>
                    </motion.label>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 疾病类型选择 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-[#4A5568]">疾病类型</h3>
          <div className="flex flex-wrap gap-3">
            {DISEASES.map(disease => (
              <motion.button
                key={disease}
                onClick={() => {
                  setDietaryRestriction(prev => ({
                    ...prev,
                    disease: (prev.disease || []).includes(disease)
                      ? (prev.disease || []).filter(d => d !== disease)
                      : [...(prev.disease || []), disease]
                  }));
                }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 py-2 rounded-full border-2 transition-all",
                  (dietaryRestriction.disease || []).includes(disease)
                    ? "bg-[#6C63FF] text-white border-transparent"
                    : "bg-white border-[#E2E8F0] hover:border-[#6C63FF]"
                )}
              >
                {disease}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 病程阶段 - 仅在选择了疾病类型后显示 */}
        {dietaryRestriction.disease && dietaryRestriction.disease.length > 0 && (
          <>
            {dietaryRestriction.disease.includes("功能性消化不良") && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r">
                <div className="flex items-start">
                  <i class="fa-solid fa-circle-info text-blue-500 text-xl mr-3 mt-0.5"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">重要提示</h3>
                    <p className="text-blue-700">
                      根据2025年最新指南，功能性消化不良急性期需严格流质饮食2-3天
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <motion.button 
                className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-[#E2E8F0]"
                onClick={() => setExpandedSection(expandedSection === "phase" ? null : "phase")}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-[#4A5568]">病程阶段</span>
                <i class={`fa-solid ${expandedSection === "phase" ? "fa-chevron-up" : "fa-chevron-down"} text-[#6C63FF]`}></i>
              </motion.button>
              
              <AnimatePresence mode="wait">
                {expandedSection === "phase" && (
                  <motion.div 
                    className="mt-3 space-y-2 pl-2 overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    key="phase-options"
                  >
                    {[
                      { value: "none", label: "无限制" },
                      { value: "acute", label: "急性期", warning: true },
                      { value: "recovery", label: "恢复期" },
                      { value: "chronic", label: "慢性期" },
                      { value: "remission", label: "缓解期" },
                      { value: "prevention", label: "预防期" }
                    ].map(option => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <motion.label 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F6F7FF] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="diet-phase"
                            checked={dietaryRestriction.phase === option.value}
                            onChange={() => setDietaryRestriction({...dietaryRestriction, phase: option.value as any})}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 ${dietaryRestriction.phase === option.value ? "border-[#6C63FF]" : "border-[#E2E8F0]"} flex items-center justify-center`}>
                            {dietaryRestriction.phase === option.value && <div className="w-2 h-2 rounded-full bg-[#6C63FF]"></div>}
                          </div>
                          <span className={`${option.warning ? "text-[#FF6584] font-medium" : "text-[#4A5568]"}`}>
                            {option.label}
                            {option.warning && <i class="fa-solid fa-triangle-exclamation text-[#FF6584] ml-2"></i>}
                          </span>
                        </motion.label>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* 操作按钮组 - 调整后的布局 */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="flex gap-2">
          <motion.button
            onClick={() => {
              setSelectedAllergens([]);
              setSelectedAvoidFoods([]);
              setDietaryRestriction({ level: "none", phase: "none", disease: [] });
              toast.dismiss();
              toast("已重置为无限制筛选条件", {
                position: "top-center",
                duration: 2000
              });
            }}
            className="flex-1 py-3 bg-gradient-to-r from-[#00C9A7] to-[#00D4B1] text-white rounded-xl text-base font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            一键选择无限制
          </motion.button>
          <motion.button
            onClick={() => {
              toast.dismiss();
              handleSubmit();
            }}
            className="flex-1 py-3 bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white rounded-xl text-base font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            应用筛选条件
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}