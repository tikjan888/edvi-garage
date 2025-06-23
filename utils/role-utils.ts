export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "owner":
      return "Владелец"
    case "partner":
      return "Партнер"
    case "viewer":
      return "Наблюдатель"
    default:
      return role
  }
}

export const getRoleDescription = (role: string): string => {
  switch (role) {
    case "owner":
      return "Полный доступ ко всем функциям"
    case "partner":
      return "Может добавлять расходы и просматривать отчеты"
    case "viewer":
      return "Только просмотр отчетов"
    default:
      return ""
  }
}
