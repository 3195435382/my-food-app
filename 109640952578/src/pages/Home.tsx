import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dishes } from "@/lib/dishes";

const foodImages = [
  "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=delicious%20food%20presentation%20on%20a%20table&sign=1348e544e75aef7af2398fdf7f6fe865",
  "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=healthy%20food%20arrangement%20with%20colorful%20ingredients&sign=bdd5e321424ebc46bcb093527b6df838",
  "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=gourmet%20meal%20with%20fresh%20vegetables%20and%20meat&sign=5668d82177289f050468800dd7580484",
  "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=asian%20cuisine%20with%20rice%20and%20side%20dishes&sign=21d9d069dcd5b86ee54a40ce1350fe87",
  "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=western%20style%20food%20with%20steak%20and%20wine&sign=9059dce4dd508d3c8558bb04db24c1f4"
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(foodImages[0]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * foodImages.length);
    const img = new Image();
    img.src = foodImages[randomIndex];
    img.onload = () => {
      setCurrentImage(foodImages[randomIndex]);
      setIsImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      const randomIndex = Math.floor(Math.random() * foodImages.length);
      const img = new Image();
      img.src = foodImages[randomIndex];
      img.onload = () => {
        setCurrentImage(foodImages[randomIndex]);
        setIsImageLoaded(true);
      };
    }
  }, [location.pathname]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">

      {/* 背景效果 */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isImageLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        key={currentImage}
      >
        {isImageLoaded && (
          <>
            <img 
              src={currentImage} 
              alt="Food background"
              className="w-full h-full object-cover blur-lg brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-400/10"></div>
          </>
        )}
      </motion.div>

      {/* 主内容区域 */}
      <motion.div
        className="relative z-10 w-full max-w-md px-4 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
      >

        {/* 圆形元素与水波纹效果 */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-40 h-40 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8A85FF] flex flex-col items-center justify-center shadow-lg cursor-pointer"
            onClick={() => navigate('/mode-select')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i class="fa-solid fa-utensils text-5xl md:text-6xl text-white mb-2"></i>
            <span className="text-white font-semibold text-lg md:text-xl">开始使用</span>
          </motion.div>
          


              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-white/80 pointer-events-none"
                  style={{ scale: 0.7 + i * 0.2 }}
                  initial={{ scale: 0.7, opacity: 0.3 }}
                  animate={{ 
                    scale: 6 + i * 3,
                    opacity: 0.7,
                    borderWidth: i * 8,
                    filter: "blur(30px)"
                  }}
                  transition={{
                    delay: 0.8 + i * 0.3,
                    duration: 12,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    mass: 2 + i * 0.5,
                    damping: 10 + i * 3
                  }}
                />
              ))}
  

        </motion.div>
  

        {/* 菜品数量统计 */}
        <motion.div
          className="mt-6 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-[#4A5568] font-medium">
             已收录<span className="text-[#6C63FF] font-bold mx-1">{dishes.length}</span>道菜品
            </span>
        </motion.div>
      </motion.div>
    </div>
  );
}