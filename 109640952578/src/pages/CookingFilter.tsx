import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { dishes } from "@/lib/dishes";

const TIME_OPTIONS = ["15分钟", "30分钟", "60分钟以上"];
const TOOL_OPTIONS = ["无厨具", "基础厨具", "专业厨具"];

export default function CookingFilter() {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string>(TIME_OPTIONS[0]);
  const [selectedTool, setSelectedTool] = useState<string>(TOOL_OPTIONS[0]);
  const [skillLevel, setSkillLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 从localStorage加载筛选条件
  useEffect(() => {
    const savedFilters = localStorage.getItem('cookingFilters');
    if (savedFilters) {
      const { time, tool, skillLevel } = JSON.parse(savedFilters);
      setSelectedTime(time);
      setSelectedTool(tool);
      setSkillLevel(skillLevel);
    }
  }, []);

  // 搜索菜品
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(item => item !== section)
        : [...prev, section]
    );
  };

  const handleSubmit = () => {
    if (isSearchMode && searchQuery.trim()) {
      // 搜索模式
      navigate("/result", {
        state: {
          searchQuery: searchQuery.trim(),
          from: 'cooking',
          isSearchMode: true
        }
      });
    } else {
      // 筛选模式
      localStorage.setItem('cookingFilters', JSON.stringify({
        time: selectedTime,
        tool: selectedTool,
        skillLevel
      }));
      navigate("/result", {
        state: {
          time: selectedTime,
          tool: selectedTool,
          skillLevel,
          from: 'cooking'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FF] p-6">
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
        <h1 className="text-2xl font-bold ml-4 text-[#2D3748]">烹饪筛选条件</h1>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索菜品..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchMode(e.target.value.trim().length > 0);
            }}
            className="w-full p-4 pr-12 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
          />
          <i class="fa-solid fa-magnifying-glass absolute right-4 top-4 text-[#718096]"></i>
        </div>
      </div>

      {!isSearchMode ? (
        <>
          {/* 时间维度选择 */}
          <div className="mb-4 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <motion.button
              className="w-full flex justify-between items-center p-4"
              onClick={() => toggleSection('time')}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-lg font-semibold text-[#4A5568]">时间维度</h2>
              <i class={`fa-solid ${expandedSections.includes('time') ? "fa-chevron-up" : "fa-chevron-down"} text-[#00C9A7]`}></i>
            </motion.button>
            
            <AnimatePresence>
              {expandedSections.includes('time') && (
                <motion.div 
                  className="px-4 pb-4 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {TIME_OPTIONS.map(time => (
                    <motion.label 
                      key={time} 
                      className="flex items-center space-x-3 p-4 bg-[#F6F7FF] rounded-xl hover:bg-[#E6E8FF] cursor-pointer"
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="time"
                        checked={selectedTime === time}
                        onChange={() => setSelectedTime(time)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedTime === time ? "border-[#00C9A7]" : "border-[#E2E8F0]"} flex items-center justify-center`}>
                        {selectedTime === time && <div className="w-3 h-3 rounded-full bg-[#00C9A7]"></div>}
                      </div>
                      <span className="text-[#4A5568]">{time}</span>
                    </motion.label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 工具需求选择 */}
          <div className="mb-4 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <motion.button
              className="w-full flex justify-between items-center p-4"
              onClick={() => toggleSection('tool')}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-lg font-semibold text-[#4A5568]">工具需求</h2>
              <i class={`fa-solid ${expandedSections.includes('tool') ? "fa-chevron-up" : "fa-chevron-down"} text-[#00C9A7]`}></i>
            </motion.button>
            
            <AnimatePresence>
              {expandedSections.includes('tool') && (
                <motion.div 
                  className="px-4 pb-4 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {TOOL_OPTIONS.map(tool => (
                    <motion.label 
                      key={tool} 
                      className="flex items-center space-x-3 p-4 bg-[#F6F7FF] rounded-xl hover:bg-[#E6E8FF] cursor-pointer"
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="tool"
                        checked={selectedTool === tool}
                        onChange={() => setSelectedTool(tool)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedTool === tool ? "border-[#00C9A7]" : "border-[#E2E8F0]"} flex items-center justify-center`}>
                        {selectedTool === tool && <div className="w-3 h-3 rounded-full bg-[#00C9A7]"></div>}
                      </div>
                      <span className="text-[#4A5568]">{tool}</span>
                    </motion.label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 技巧分级选择 */}
          <div className="mb-24 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <motion.button
              className="w-full flex justify-between items-center p-4"
              onClick={() => toggleSection('skill')}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-lg font-semibold text-[#4A5568]">技巧等级 (1-4)</h2>
              <i class={`fa-solid ${expandedSections.includes('skill') ? "fa-chevron-up" : "fa-chevron-down"} text-[#00C9A7]`}></i>
            </motion.button>
            
            <AnimatePresence>
              {expandedSections.includes('skill') && (
                <motion.div 
                  className="px-4 pb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-[#718096]">新手</span>
                      <span className="text-sm text-[#718096]">大师</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(Number(e.target.value))}
                      className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#00C9A7]"
                    />
                    <div className="flex justify-between mt-3">
                      {[1, 2, 3, 4].map(level => (
                        <span 
                          key={level}
                          className={`text-sm ${skillLevel === level ? "text-[#00C9A7] font-bold" : "text-[#718096]"}`}
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : searchResults.length > 0 ? (
        <div className="mb-24 space-y-4">
          {searchResults.map(dish => (
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
                <motion.button
                  onClick={() => navigate(`/recipe/${dish.id}`)}
                  className="text-xl font-bold text-[#2D3748] hover:text-[#00C9A7] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {dish.name}
                </motion.button>
                <motion.button
                  onClick={() => navigate(`/recipe/${dish.id}`)}
                  className="px-2 py-0.5 bg-gradient-to-r from-[#00C9A7] to-[#00D4B1] text-white rounded-full text-xs font-medium shadow-sm flex items-center"
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
      ) : searchQuery.trim() ? (
        <div className="mb-24 bg-white rounded-xl shadow-md p-8 text-center border border-[#E2E8F0]">
          <i class="fa-solid fa-magnifying-glass text-4xl text-[#718096] mb-4"></i>
          <p className="text-[#4A5568]">没有找到匹配的菜品</p>
          <p className="text-sm text-[#718096] mt-2">请尝试不同的搜索词</p>
        </div>
      ) : (
        <div className="mb-24 text-center py-8">
          <p className="text-[#4A5568]">搜索模式已激活，输入关键词后点击下方按钮进行搜索</p>
        </div>
      )}

      {/* 提交按钮 - 仅在非搜索模式下显示 */}
      {!isSearchMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent pt-6 pb-4 px-6">
          <motion.button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-[#00C9A7] to-[#00D4B1] text-white rounded-xl text-lg font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            应用筛选条件
          </motion.button>
        </div>
      )}
    </div>
  );
}
