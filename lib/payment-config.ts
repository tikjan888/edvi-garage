// Конфигурация собственной платежной системы

export interface PaymentMethod {
  id: string
  name: string
  type: "bank_transfer" | "paypal" | "card_transfer"
  enabled: boolean
  details: {
    [key: string]: string
  }
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bank_transfer",
    name: "Банковский перевод",
    type: "bank_transfer",
    enabled: true,
    details: {
      bankName: "Ваш Банк",
      accountHolder: "Ваше Имя Фамилия",
      accountNumber: "1234 5678 9012 3456",
      iban: "DE89 3704 0044 0532 0130 00",
      swift: "DEUTDEFF",
      bic: "DEUTDEFF370",
    },
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "paypal",
    enabled: true,
    details: {
      email: "your-paypal@email.com",
      name: "Ваше Имя",
    },
  },
  {
    id: "card_transfer",
    name: "Перевод на карту",
    type: "card_transfer",
    enabled: true,
    details: {
      cardNumber: "1234 5678 9012 3456",
      cardHolder: "VASHE IMYA",
      bankName: "Ваш Банк",
    },
  },
]

export const PRICING = {
  starter: {
    monthly: 9,
    yearly: 90,
  },
  pro: {
    monthly: 19,
    yearly: 190,
  },
}

export function getPaymentInstructions(
  method: PaymentMethod,
  plan: "starter" | "pro",
  cycle: "monthly" | "yearly",
): string {
  const amount = PRICING[plan][cycle]
  const currency = "EUR"

  switch (method.type) {
    case "bank_transfer":
      return `
Переведите ${currency} ${amount} на банковский счет:

Получатель: ${method.details.accountHolder}
Банк: ${method.details.bankName}
Номер счета: ${method.details.accountNumber}
IBAN: ${method.details.iban}
SWIFT/BIC: ${method.details.swift}

Назначение платежа: Подписка ${plan.toUpperCase()} - ${cycle === "monthly" ? "месячная" : "годовая"}

После перевода отправьте скриншот чека на email: support@yourapp.com
      `.trim()

    case "paypal":
      return `
Отправьте ${currency} ${amount} на PayPal:

Email: ${method.details.email}
Имя получателя: ${method.details.name}

В комментарии укажите: Подписка ${plan.toUpperCase()} - ${cycle === "monthly" ? "месячная" : "годовая"}

После отправки сообщите нам ваш email для активации подписки.
      `.trim()

    case "card_transfer":
      return `
Переведите ${currency} ${amount} на карту:

Номер карты: ${method.details.cardNumber}
Владелец карты: ${method.details.cardHolder}
Банк: ${method.details.bankName}

Комментарий: Подписка ${plan.toUpperCase()} - ${cycle === "monthly" ? "месячная" : "годовая"}

После перевода отправьте уведомление на email: support@yourapp.com
      `.trim()

    default:
      return "Инструкции по оплате недоступны"
  }
}
