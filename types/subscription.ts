export interface UserSubscription {
  planType: "free" | "starter" | "pro"
  status: "active" | "trial" | "expired" | "cancelled"
  trialStartDate?: string
  trialEndDate?: string
  subscriptionId?: string
  currentPeriodEnd?: string

  limits: {
    garages: number
    cars: number
    partnersPerGarage: number
  }
  usage: {
    garagesCount: number
    carsCount: number
    partnersCount: number
  }
}

export interface PricingPlan {
  id: "free" | "starter" | "pro"
  name: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  popular?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: { monthly: 0, yearly: 0 },
    features: ["1 гараж", "До 3 автомобилей", "1 партнёр", "Основные функции", "Ограниченная аналитика"],
  },
  {
    id: "starter",
    name: "Базовый",
    price: { monthly: 9, yearly: 90 },
    features: [
      "До 3 гаражей",
      "До 20 автомобилей",
      "До 5 партнёров на гараж",
      "Полная отчетность",
      "PDF отчёты",
      "Email уведомления",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Профессиональный",
    price: { monthly: 19, yearly: 190 },
    features: [
      "Неограниченные гаражи",
      "Неограниченные автомобили",
      "Неограниченные партнёры",
      "Детальная аналитика",
      "Приоритетная поддержка",
      "API доступ",
      "Кастомные отчёты",
    ],
  },
]

export const PLAN_LIMITS = {
  free: {
    garages: 1,
    cars: 3,
    partnersPerGarage: 1,
  },
  starter: {
    garages: 3,
    cars: 20,
    partnersPerGarage: 5,
  },
  pro: {
    garages: -1, // unlimited
    cars: -1, // unlimited
    partnersPerGarage: -1, // unlimited
  },
}
