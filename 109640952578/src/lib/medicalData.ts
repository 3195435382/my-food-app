import { z } from "zod";

// 疾病饮食限制Schema
export const DietaryRestrictionSchema = z.object({
  disease: z.string(),
  phase: z.enum(["acute", "recovery", "chronic", "remission", "prevention"]),
  allowedDietTypes: z.array(z.enum(["liquid", "soft", "normal"])),
  description: z.string(),
  year: z.number().min(2020).max(2025)
});

// 各阶段知识内容
export const phaseKnowledge = {
  "功能性消化不良": {
    acute: {
      title: "急性期管理",
      content: "急性期需严格流质饮食2-3天，避免任何固体食物刺激胃部。",
      color: "bg-red-100 text-red-800"
    },
    recovery: {
      title: "恢复期指导", 
      content: "恢复期可逐渐过渡到软食，但仍需避免刺激性食物。",
      color: "bg-yellow-100 text-yellow-800"
    },
    chronic: {
      title: "慢性期建议",
      content: "慢性期可正常饮食但需避免辛辣、油腻等刺激性食物。",
      color: "bg-blue-100 text-blue-800"
    },
    prevention: {
      title: "预防期措施",
      content: "预防期应保持规律饮食，避免暴饮暴食和刺激性食物。",
      color: "bg-green-100 text-green-800"
    }
  }
};

// 2025年功能性消化不良饮食建议
export const functionalDyspepsia2025 = {
  disease: "功能性消化不良",
  phases: {
    acute: {
      description: "2025年最新指南：急性期需严格流质饮食2-3天",
      allowedDietTypes: ["liquid"],
      foods: [
        "米汤", "藕粉", "蔬菜汁", "过滤果汁", 
        "牛奶", "豆浆", "稀粥", "蛋花汤"
      ],
      prohibited: [
        "固体食物", "油炸食品", "辛辣刺激", "高纤维食物",
        "粗粮", "坚果", "豆类", "碳酸饮料"
      ],
      strictWarning: "⚠️ 急性期严格限制: 仅能食用流质饮食(如米汤、蔬菜汁等)，避免任何固体食物"
    },
    recovery: {
      description: "恢复期可逐渐过渡到软食",
      allowedDietTypes: ["liquid", "soft"],
      foods: [
        "粥类", "烂面条", "蒸蛋", "豆腐脑",
        "肉泥", "煮熟的蔬菜", "土豆泥"
      ],
      prohibited: [
        "油炸食品", "辛辣刺激", "高纤维食物",
        "生冷食物", "酒精"
      ]
    },
    chronic: {
      description: "慢性期可正常饮食但需避免刺激性食物",
      allowedDietTypes: ["soft", "normal"],
      foods: [
        "常规饮食", "低脂食物", "易消化蛋白质",
        "蒸煮食物", "炖菜"
      ],
      prohibited: [
        "油炸食品", "辛辣刺激", "酒精",
        "咖啡", "碳酸饮料"
      ]
    }
  }
};

// 其他疾病饮食建议可以在此继续添加...
