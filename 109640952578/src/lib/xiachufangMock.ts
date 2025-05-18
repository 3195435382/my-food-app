import { Dish } from "./dishes";

// 模拟下厨房API接口
export const xiachufangAPI = {
  // 根据菜品ID获取下厨房数据
  getDishInfo: async (dishId: string): Promise<Dish | null> => {
    // 实际开发中这里应该是调用真实API
    // 这里我们返回mock数据
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: Record<string, Dish> = {
          "1": {
            id: "1",
            name: "香煎三文鱼配时蔬",
            desc: "下厨房评分4.8分，收藏量12.3万",
            tags: [
              { type: "rating", value: "4.8分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "收藏12.3万", color: "bg-pink-100 text-pink-800" }
            ],
            source: "下厨房"
          } as Dish,
          "2": {
            id: "2",
            name: "意式番茄牛肉面",
            desc: "下厨房评分4.7分，收藏量10.5万",
            tags: [
              { type: "rating", value: "4.7分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "收藏10.5万", color: "bg-pink-100 text-pink-800" }
            ],
            source: "下厨房"
          } as Dish,
          "3": {
            id: "3",
            name: "红烧肉",
            desc: "下厨房评分4.9分，收藏量18.2万",
            tags: [
              { type: "rating", value: "4.9分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "收藏18.2万", color: "bg-pink-100 text-pink-800" }
            ],
            source: "下厨房"
          } as Dish,
          "4": {
            id: "4",
            name: "宫保鸡丁",
            desc: "下厨房评分4.9分，收藏量15.6万",
            tags: [
              { type: "rating", value: "4.9分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "收藏15.6万", color: "bg-pink-100 text-pink-800" }
            ],
            source: "下厨房"
          } as Dish,
          "5": {
            id: "5",
            name: "番茄炒蛋",
            desc: "下厨房评分4.6分，收藏量8.9万",
            tags: [
              { type: "rating", value: "4.6分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "收藏8.9万", color: "bg-pink-100 text-pink-800" }
            ],
            source: "下厨房"
          } as Dish
        };
        resolve(mockData[dishId] || null);
      }, 500);
    });
  },

  // 搜索菜品
  searchDishes: async (query: string): Promise<Dish[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // 实际开发中返回搜索结果
      }, 500);
    });
  },

  // 获取热门菜品
  getPopularDishes: async (): Promise<Dish[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // 实际开发中返回热门菜品
      }, 500);
    });
  }
};