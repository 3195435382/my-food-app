import { Dish } from "./dishes";

// 模拟外卖平台API接口
export const takeoutAPI = {
  // 根据菜品ID获取外卖平台数据
  getDishInfo: async (dishId: string): Promise<Dish | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: Record<string, Dish> = {
          "1": {
            id: "1",
            name: "香煎三文鱼套餐",
            desc: "外卖平台评分4.5分，月销1200+",
            tags: [
              { type: "rating", value: "4.5分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "月销1200+", color: "bg-pink-100 text-pink-800" },
              { type: "restaurant", value: "渔人码头", color: "bg-blue-100 text-blue-800" }
            ],
            source: "外卖平台"
          } as Dish,
          "2": {
            id: "2",
            name: "意式番茄牛肉面",
            desc: "外卖平台评分4.7分，月销800+",
            tags: [
              { type: "rating", value: "4.7分", color: "bg-yellow-100 text-yellow-800" },
              { type: "popularity", value: "月销800+", color: "bg-pink-100 text-pink-800" },
              { type: "restaurant", value: "意面工坊", color: "bg-blue-100 text-blue-800" }
            ],
            source: "外卖平台"
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