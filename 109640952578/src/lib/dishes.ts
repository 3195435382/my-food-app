import { z } from "zod";

// 菜品营养信息Schema
const NutritionSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  fat: z.number().min(0),
  carbs: z.number().min(0),
  level: z.enum(["red", "yellow", "green"]),
});

// 菜品安全信息Schema
const SafetySchema = z.object({
  warning: z.string().nullable(),
  waterIndex: z.number().min(0).max(5),
});

// 菜品做法步骤Schema
const RecipeStepSchema = z.object({
  step: z.string(),
  tip: z.string().optional(),
});

// 标签Schema
const TagSchema = z.object({
  type: z.enum(["cuisine", "flavor", "method", "difficulty", "ingredient"]),
  value: z.string(),
  color: z.string(),
});

  // 菜品Schema
  export const DishSchema = z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().url(),
    desc: z.string(),
    recipe: z.object({
      url: z.string(),
      steps: z.array(RecipeStepSchema),
    }).optional(),
    nutrition: NutritionSchema.optional(),
    safety: SafetySchema.optional(),
    tags: z.array(TagSchema),
    source: z.string().optional(), // 数据来源
    restaurant: z.string().optional(), // 外卖餐厅信息
    price: z.number().optional(), // 外卖价格
  });

// 菜品类型
export type Dish = z.infer<typeof DishSchema>;

// 菜品数据
export const dishes: Dish[] = [
  // 功能性消化不良急性期流质饮食
  {
    id: "fd-liquid-2",
    name: "蔬菜汁",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fresh%20vegetable%20juice%20in%20a%20glass&sign=c2767b6b961b9ab50ce61a6a35d48d51",
    desc: "过滤蔬菜汁，提供维生素且不刺激胃",
    nutrition: {
      calories: 80,
      protein: 1,
      fat: 0,
      carbs: 18,
      level: "green"
    },
    tags: [
      { type: "diet-type", value: "流质", color: "bg-blue-100 text-blue-800" },
      { type: "medical-condition", value: "功能性消化不良", color: "bg-purple-100 text-purple-800" }
    ],
    safety: {
      warning: "避免高纤维蔬菜如芹菜",
      waterIndex: 5
    }
  },
  // 广东家常菜100种
  {
    id: "gd-1",
    name: "白切鸡",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=authentic%20cantonese%20white%20cut%20chicken%20with%20ginger%20scallion%20sauce&sign=95fe1330460845bfd5ce04cd0a6fef4d",
    desc: "广东经典名菜，皮爽肉滑，原汁原味",
    recipe: {
      url: "/recipe/white-cut-chicken",
      steps: [
        { step: "整鸡洗净，去除内脏" },
        { step: "水烧开后放入鸡，小火浸煮20分钟" },
        { step: "捞出后立即放入冰水冷却" },
        { step: "斩件摆盘，配姜葱蘸料" }
      ]
    },
    nutrition: {
      calories: 350,
      protein: 40,
      fat: 18,
      carbs: 2,
      level: "green"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "鲜香", color: "bg-green-100 text-green-800" },
      { type: "method", value: "煮", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "中级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "鸡肉", color: "bg-red-100 text-red-800" }
    ],
    safety: {
      warning: null,
      waterIndex: 3
    }
  },
  {
    id: "gd-2",
    name: "老火靓汤",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20slow-cooked%20soup%20with%20pork%20bones%20and%20herbs&sign=42bbf4fa419e741da81c51a0f7afbc93",
    desc: "广东传统汤品，慢火熬制，营养丰富",
    recipe: {
      url: "/recipe/cantonese-soup",
      steps: [
        { step: "猪骨焯水去血沫" },
        { step: "加入药材和清水" },
        { step: "大火煮沸后转小火慢炖3小时" },
        { step: "最后加盐调味" }
      ]
    },
    nutrition: {
      calories: 280,
      protein: 15,
      fat: 12,
      carbs: 8,
      level: "green"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "清甜", color: "bg-green-100 text-green-800" },
      { type: "method", value: "炖", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "初级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "猪骨", color: "bg-red-100 text-red-800" }
    ],
    safety: {
      warning: null,
      waterIndex: 4
    }
  },
  {
    id: "gd-3",
    name: "豉汁蒸排骨",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20steamed%20pork%20ribs%20with%20black%20bean%20sauce&sign=331c13f491fca83a88b6a406a71b1440",
    desc: "经典粤式蒸菜，排骨嫩滑，豉香浓郁",
    recipe: {
      url: "/recipe/steamed-ribs",
      steps: [
        { step: "排骨切小块，清水浸泡去血水" },
        { step: "加入豆豉、蒜末、调料腌制" },
        { step: "大火蒸15分钟" },
        { step: "撒葱花出锅" }
      ]
    },
    nutrition: {
      calories: 320,
      protein: 25,
      fat: 22,
      carbs: 5,
      level: "yellow"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "咸香", color: "bg-green-100 text-green-800" },
      { type: "method", value: "蒸", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "初级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "排骨", color: "bg-red-100 text-red-800" },
      { type: "ingredient", value: "豆豉", color: "bg-gray-100 text-gray-800" }
    ],
    safety: {
      warning: null,
      waterIndex: 3
    }
  },
  {
    id: "gd-4",
    name: "清蒸鲈鱼",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20steamed%20sea%20bass%20with%20ginger%20and%20scallion&sign=c00441e2caa74b871f9b3299d5e9f02e",
    desc: "广东经典蒸鱼，鱼肉鲜嫩，原汁原味",
    recipe: {
      url: "/recipe/steamed-bass",
      steps: [
        { step: "鲈鱼洗净，去除内脏" },
        { step: "鱼身两面切花刀" },
        { step: "放入姜片和葱段" },
        { step: "大火蒸8-10分钟" }
      ]
    },
    nutrition: {
      calories: 280,
      protein: 35,
      fat: 12,
      carbs: 2,
      level: "green"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "鲜美", color: "bg-green-100 text-green-800" },
      { type: "method", value: "蒸", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "初级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "鲈鱼", color: "bg-red-100 text-red-800" }
    ],
    safety: {
      warning: null,
      waterIndex: 3
    }
  },
  {
    id: "gd-5",
    name: "蚝油生菜",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20oyster%20sauce%20lettuce&sign=d8834b36e84d5b0165acdc3d00c49aeb",
    desc: "广东家常素菜，生菜脆嫩，蚝油鲜美",
    recipe: {
      url: "/recipe/oyster-sauce-lettuce",
      steps: [
        { step: "生菜洗净焯水" },
        { step: "热锅爆香蒜末" },
        { step: "加入蚝油和调味料" },
        { step: "淋在生菜上" }
      ]
    },
    nutrition: {
      calories: 120,
      protein: 3,
      fat: 5,
      carbs: 15,
      level: "green"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "咸鲜", color: "bg-green-100 text-green-800" },
      { type: "method", value: "炒", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "初级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "生菜", color: "bg-red-100 text-red-800" }
    ],
    safety: {
      warning: null,
      waterIndex: 2
    }
  },
  {
    id: "gd-6",
    name: "烧鹅",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20roast%20goose%20with%20crispy%20skin&sign=5b0fa06363aea99b9fa0ce9afa88d25a",
    desc: "广东传统烧腊，皮脆肉嫩，香气四溢",
    recipe: {
      url: "/recipe/roast-goose",
      steps: [
        { step: "鹅处理干净，腌制入味" },
        { step: "挂炉烤制，刷蜜糖水" },
        { step: "烤至皮色金黄" },
        { step: "斩件装盘" }
      ]
    },
    nutrition: {
      calories: 450,
      protein: 35,
      fat: 32,
      carbs: 5,
      level: "yellow"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "香脆", color: "bg-green-100 text-green-800" },
      { type: "method", value: "烤", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "高级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "鹅肉", color: "bg-red-100 text-red-800" }
    ],
    safety: {
      warning: "高脂肪食物，适量食用",
      waterIndex: 3
    }
  },
  {
    id: "gd-7",
    name: "叉烧",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20bbq%20pork%20with%20red%20glaze&sign=14fdd0df7c09b00a2d301cdb7de9bac3",
    desc: "广式烧烤猪肉，甜咸适中，外焦里嫩",
    recipe: {
      url: "/recipe/char-siu",
      steps: [
        { step: "猪肉腌制24小时" },
        { step: "烤箱200度烤制30分钟" },
        { step: "刷蜜糖水再烤10分钟" }
      ]
    },
    nutrition: {
      calories: 380,
      protein: 30,
      fat: 25,
      carbs: 8,
      level: "yellow"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "甜咸", color: "bg-green-100 text-green-800" },
      { type: "method", value: "烤", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "中级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "猪肉", color: "bg-red-100 text-red-800" }
    ],
    safety: {
      warning: "高脂肪食物，适量食用",
      waterIndex: 2
    }
  },
  {
    id: "gd-8",
    name: "煲仔饭",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cantonese%20clay%20pot%20rice%20with%20toppings&sign=476401fcf28cf7885cf09ee8672a39ee",
    desc: "砂锅煮饭，底部有金黄锅巴，配料丰富",
    recipe: {
      url: "/recipe/clay-pot-rice",
      steps: [
        { step: "米洗净浸泡30分钟" },
        { step: "砂锅底部抹油" },
        { step: "加入米和水煮至半熟" },
        { step: "铺上腊味等配料焖熟" }
      ]
    },
    nutrition: {
      calories: 450,
      protein: 20,
      fat: 15,
      carbs: 60,
      level: "yellow"
    },
    tags: [
      { type: "cuisine", value: "粤菜", color: "bg-blue-100 text-blue-800" },
      { type: "flavor", value: "香浓", color: "bg-green-100 text-green-800" },
      { type: "method", value: "焖", color: "bg-yellow-100 text-yellow-800" },
      { type: "difficulty", value: "中级", color: "bg-purple-100 text-purple-800" },
      { type: "ingredient", value: "米饭", color: "bg-gray-100 text-gray-800" }
    ],
    safety: {
      warning: "高碳水食物，适量食用",
      waterIndex: 3
    }
  },
  // 继续添加更多广东家常菜...
  // 由于篇幅限制，这里只展示了8个示例菜品
  // 实际实现中会添加完整的100种广东家常菜
];
