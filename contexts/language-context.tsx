"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ru" | "fr" | "de" | "nl" | "es" | "it" | "uk" | "ka" | "tr" | "hy" | "pl" | "sv"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isFirstVisit: boolean
}

const translations = {
  en: {
    // Header
    carInventory: "Car Inventory",
    vehiclesInFleet: "vehicles in your fleet",
    searchVehicles: "Search vehicles...",
    filter: "Filter",
    available: "Available",
    sold: "Sold",
    pending: "Pending",

    // Car List
    addCar: "Add Car",
    totalExpenses: "Total Expenses",

    // Expense Detail
    financialOverview: "Financial Overview",
    totalIncome: "Total Income",
    netAmount: "Net Amount",
    allTransactions: "All Transactions",
    income: "Income",
    expenses: "Expenses",
    sellVehicle: "Sell Vehicle",

    // Categories
    purchase: "Purchase",
    repair: "Repair",
    maintenance: "Maintenance",
    service: "Service",
    partsSale: "Parts Sale",
    accessories: "Accessories",

    // Sale Modal
    saleCompleted: "Sale Completed!",
    transactionProcessed: "Transaction processed successfully",
    salePrice: "Sale Price",
    margin: "Margin",
    financialBreakdown: "Financial Breakdown",
    partnershipSplit: "Partnership Split",
    yourShare: "Your Share",
    partnerShare: "Partner Share",
    profit: "Profit",
    continue: "Continue",
    vehicleSoldSuccessfully: "Vehicle Sold Successfully!",

    // Settings
    settings: "Settings",
    language: "Language",
    notifications: "Notifications",
    enableNotifications: "Enable Notifications",
    darkMode: "Dark Mode",
    enableDarkMode: "Enable Dark Mode",
    dataExport: "Data Export",
    exportToPDF: "Export to PDF",
    exportToExcel: "Export to Excel",
    exportPDFMessage: "PDF export feature will be available soon!",
    exportExcelMessage: "Excel export feature will be available soon!",
    about: "About",
    version: "Version 1.0.0",
    save: "Save",
    cancel: "Cancel",
    userInfo: "User Information",
    partnerNames: "Partner Names",
    yourName: "Your Name",
    partnerName: "Partner Name",
    yourNamePlaceholder: "Me",
    partnerNamePlaceholder: "Partner",
    account: "Account",
    logout: "Logout",

    // Add Car Modal
    addNewCar: "Add New Car",
    carMake: "Car Make",
    carModel: "Car Model",
    year: "Year",
    purchasePrice: "Purchase Price",
    mileage: "Mileage",
    condition: "Condition",
    notes: "Notes",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    additionalInfo: "Additional information",

    // Add Expense Modal
    addExpense: "Add Expense",
    description: "Description",
    amount: "Amount",
    category: "Category",
    date: "Date",
    type: "Type",
    expense: "Expense",
    selectCategory: "Select Category",
    selectType: "Select Type",

    // Common
    close: "Close",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    success: "Success",
    error: "Error",

    // New keys
    paidBy: "Paid By",
    you: "You",
    partner: "Partner",
    selectPayer: "Select who paid",
    reminder: "Reminder",
    sellReminderText: "Each partner will get back their expenses, and the remaining profit will be split 50/50.",

    // Language names
    english: "English",
    russian: "Russian",
    french: "French",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Ukrainian",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "General",
    appearance: "Appearance",
    garage: "Garage",
    data: "Data",

    // Settings content
    generalSettings: "General Settings",
    enterYourName: "Enter your name",
    enterPartnerName: "Enter partner name",
    receiveNotifications: "Receive notifications about important events",
    accountInfo: "Account Information",
    emailAddress: "Email Address",
    logoutAccount: "Logout from Account",
    interfaceLanguage: "Interface Language",
    selectLanguageDescription: "Select language for application interface display",
    autoDetect: "Auto Detect",
    detectedByBrowser: "Detected by browser settings",
    current: "Current",
    useDarkTheme: "Use dark interface theme",
    garageSettings: "Garage Settings",
    currentGarage: "Current Garage",
    manageMembers: "Manage Members",
    selectGarageFirst: "Please select a garage first",
    exportDescription: "Export your data in various formats",
    appDescription: "Application for managing car business finances. Track expenses, income and profit from car sales.",
  },
  ru: {
    // Header
    carInventory: "Автомобили",
    vehiclesInFleet: "автомобилей в автопарке",
    searchVehicles: "Поиск автомобилей...",
    filter: "Фильтр",
    available: "Доступно",
    sold: "Продано",
    pending: "Ожидает",

    // Car List
    addCar: "Добавить автомобиль",
    totalExpenses: "Общие расходы",

    // Expense Detail
    financialOverview: "Финансовый обзор",
    totalIncome: "Общий доход",
    netAmount: "Чистая сумма",
    allTransactions: "Все транзакции",
    income: "Доход",
    expenses: "Расходы",
    sellVehicle: "Продать автомобиль",

    // Categories
    purchase: "Покупка",
    repair: "Ремонт",
    maintenance: "Обслуживание",
    service: "Сервис",
    partsSale: "Продажа запчастей",
    accessories: "Аксессуары",

    // Sale Modal
    saleCompleted: "Продажа завершена!",
    transactionProcessed: "Транзакция успешно обработана",
    salePrice: "Цена продажи",
    margin: "Маржа",
    financialBreakdown: "Финансовая разбивка",
    partnershipSplit: "Раздел партнерства",
    yourShare: "Ваша доля",
    partnerShare: "Доля партнера",
    profit: "Прибыль",
    continue: "Продолжить",
    vehicleSoldSuccessfully: "Автомобиль успешно продан!",

    // Settings
    settings: "Настройки",
    language: "Язык",
    notifications: "Уведомления",
    enableNotifications: "Включить уведомления",
    darkMode: "Темная тема",
    enableDarkMode: "Включить темную тему",
    dataExport: "Экспорт данных",
    exportToPDF: "Экспорт в PDF",
    exportToExcel: "Экспорт в Excel",
    exportPDFMessage: "Функция экспорта в PDF скоро будет доступна!",
    exportExcelMessage: "Функция экспорта в Excel скоро будет доступна!",
    about: "О программе",
    version: "Версия 1.0.0",
    save: "Сохранить",
    cancel: "Отмена",
    userInfo: "Информация о пользователе",
    partnerNames: "Имена партнеров",
    yourName: "Ваше имя",
    partnerName: "Имя партнера",
    yourNamePlaceholder: "Я",
    partnerNamePlaceholder: "Партнер",
    account: "Аккаунт",
    logout: "Выйти",

    // Add Car Modal
    addNewCar: "Добавить новый автомобиль",
    carMake: "Марка автомобиля",
    carModel: "Модель автомобиля",
    year: "Год",
    purchasePrice: "Цена покупки",
    mileage: "Пробег",
    condition: "Состояние",
    notes: "Заметки",
    excellent: "Отличное",
    good: "Хорошее",
    fair: "Удовлетворительное",
    additionalInfo: "Дополнительная информация",

    // Add Expense Modal
    addExpense: "Добавить расход",
    description: "Описание",
    amount: "Сумма",
    category: "Категория",
    date: "Дата",
    type: "Тип",
    expense: "Расход",
    selectCategory: "Выберите категорию",
    selectType: "Выберите тип",

    // Common
    close: "Закрыть",
    add: "Добавить",
    edit: "Редактировать",
    delete: "Удалить",
    confirm: "Подтвердить",
    success: "Успех",
    error: "Ошибка",

    // New keys
    paidBy: "Кто заплатил",
    you: "Вы",
    partner: "Партнёр",
    selectPayer: "Выберите кто заплатил",
    reminder: "Напоминание",
    sellReminderText: "Каждый партнёр получит обратно свои расходы, а оставшаяся прибыль будет разделена 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Общие",
    appearance: "Внешний вид",
    garage: "Гараж",
    data: "Данные",

    // Settings content
    generalSettings: "Общие настройки",
    enterYourName: "Введите ваше имя",
    enterPartnerName: "Введите имя партнера",
    receiveNotifications: "Получать уведомления о важных событиях",
    accountInfo: "Информация об аккаунте",
    emailAddress: "Email адрес",
    logoutAccount: "Выйти из аккаунта",
    interfaceLanguage: "Язык интерфейса",
    selectLanguageDescription: "Выберите язык для отображения интерфейса приложения",
    autoDetect: "Автоматически определять",
    detectedByBrowser: "Определяется по настройкам браузера",
    current: "Текущий",
    useDarkTheme: "Использовать темное оформление интерфейса",
    garageSettings: "Настройки гаража",
    currentGarage: "Текущий гараж",
    manageMembers: "Управление участниками",
    selectGarageFirst: "Сначала выберите гараж",
    exportDescription: "Экспортируйте ваши данные в различных форматах",
    appDescription:
      "Приложение для управления финансами автомобильного бизнеса. Отслеживайте расходы, доходы и прибыль от продажи автомобилей.",
  },
  fr: {
    // Header
    carInventory: "Inventaire Auto",
    vehiclesInFleet: "véhicules dans votre flotte",
    searchVehicles: "Rechercher des véhicules...",
    filter: "Filtrer",
    available: "Disponible",
    sold: "Vendu",
    pending: "En attente",

    // Car List
    addCar: "Ajouter Voiture",
    totalExpenses: "Dépenses Totales",

    // Expense Detail
    financialOverview: "Aperçu Financier",
    totalIncome: "Revenu Total",
    netAmount: "Montant Net",
    allTransactions: "Toutes Transactions",
    income: "Revenu",
    expenses: "Dépenses",
    sellVehicle: "Vendre Véhicule",

    // Categories
    purchase: "Achat",
    repair: "Réparation",
    maintenance: "Entretien",
    service: "Service",
    partsSale: "Vente Pièces",
    accessories: "Accessoires",

    // Sale Modal
    saleCompleted: "Vente Terminée!",
    transactionProcessed: "Transaction traitée avec succès",
    salePrice: "Prix de Vente",
    margin: "Marge",
    financialBreakdown: "Répartition Financière",
    partnershipSplit: "Partage Partenariat",
    yourShare: "Votre Part",
    partnerShare: "Part Partenaire",
    profit: "Profit",
    continue: "Continuer",
    vehicleSoldSuccessfully: "Véhicule Vendu avec Succès!",

    // Settings
    settings: "Paramètres",
    language: "Langue",
    notifications: "Notifications",
    enableNotifications: "Activer Notifications",
    darkMode: "Mode Sombre",
    enableDarkMode: "Activer Mode Sombre",
    dataExport: "Export Données",
    exportToPDF: "Exporter en PDF",
    exportToExcel: "Exporter en Excel",
    exportPDFMessage: "La fonction d'export PDF sera bientôt disponible!",
    exportExcelMessage: "La fonction d'export Excel sera bientôt disponible!",
    about: "À Propos",
    version: "Version 1.0.0",
    save: "Sauvegarder",
    cancel: "Annuler",
    userInfo: "Informations Utilisateur",
    partnerNames: "Noms des Partenaires",
    yourName: "Votre Nom",
    partnerName: "Nom du Partenaire",
    yourNamePlaceholder: "Moi",
    partnerNamePlaceholder: "Partenaire",
    account: "Compte",
    logout: "Déconnexion",

    // Add Car Modal
    addNewCar: "Ajouter Nouvelle Voiture",
    carMake: "Marque",
    carModel: "Modèle",
    year: "Année",
    purchasePrice: "Prix d'Achat",
    mileage: "Kilométrage",
    condition: "État",
    notes: "Notes",
    excellent: "Excellent",
    good: "Bon",
    fair: "Correct",
    additionalInfo: "Informations supplémentaires",

    // Add Expense Modal
    addExpense: "Ajouter Dépense",
    description: "Description",
    amount: "Montant",
    category: "Catégorie",
    date: "Date",
    type: "Type",
    expense: "Dépense",
    selectCategory: "Sélectionner Catégorie",
    selectType: "Sélectionner Type",

    // Common
    close: "Fermer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    confirm: "Confirmer",
    success: "Succès",
    error: "Erreur",

    // New keys
    paidBy: "Payé Par",
    you: "Vous",
    partner: "Partenaire",
    selectPayer: "Sélectionner qui a payé",
    reminder: "Rappel",
    sellReminderText: "Chaque partenaire récupérera ses dépenses, et le profit restant sera partagé 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Général",
    account: "Compte",
    appearance: "Apparence",
    garage: "Garage",
    data: "Données",

    // Settings content
    generalSettings: "Paramètres Généraux",
    enterYourName: "Entrez votre nom",
    enterPartnerName: "Entrez le nom du partenaire",
    receiveNotifications: "Recevoir des notifications sur les événements importants",
    accountInfo: "Informations du Compte",
    emailAddress: "Adresse Email",
    logoutAccount: "Se Déconnecter du Compte",
    interfaceLanguage: "Langue de l'Interface",
    selectLanguageDescription: "Sélectionnez la langue d'affichage de l'interface de l'application",
    autoDetect: "Détection Automatique",
    detectedByBrowser: "Détecté par les paramètres du navigateur",
    current: "Actuel",
    useDarkTheme: "Utiliser le thème sombre de l'interface",
    garageSettings: "Paramètres du Garage",
    currentGarage: "Garage Actuel",
    manageMembers: "Gérer les Membres",
    selectGarageFirst: "Veuillez d'abord sélectionner un garage",
    exportDescription: "Exportez vos données dans différents formats",
    appDescription:
      "Application pour gérer les finances d'entreprise automobile. Suivez les dépenses, revenus et profits de la vente de voitures.",
  },
  de: {
    // Header
    carInventory: "Fahrzeug-Inventar",
    vehiclesInFleet: "Fahrzeuge in Ihrer Flotte",
    searchVehicles: "Fahrzeuge suchen...",
    filter: "Filter",
    available: "Verfügbar",
    sold: "Verkauft",
    pending: "Ausstehend",

    // Car List
    addCar: "Auto hinzufügen",
    totalExpenses: "Gesamtausgaben",

    // Expense Detail
    financialOverview: "Finanzübersicht",
    totalIncome: "Gesamteinkommen",
    netAmount: "Nettobetrag",
    allTransactions: "Alle Transaktionen",
    income: "Einkommen",
    expenses: "Ausgaben",
    sellVehicle: "Fahrzeug verkaufen",

    // Categories
    purchase: "Kauf",
    repair: "Reparatur",
    maintenance: "Wartung",
    service: "Service",
    partsSale: "Teileverkauf",
    accessories: "Zubehör",

    // Sale Modal
    saleCompleted: "Verkauf abgeschlossen!",
    transactionProcessed: "Transaktion erfolgreich verarbeitet",
    salePrice: "Verkaufspreis",
    margin: "Marge",
    financialBreakdown: "Finanzaufschlüsselung",
    partnershipSplit: "Partnerschaftsaufteilung",
    yourShare: "Ihr Anteil",
    partnerShare: "Partner-Anteil",
    profit: "Gewinn",
    continue: "Weiter",
    vehicleSoldSuccessfully: "Fahrzeug erfolgreich verkauft!",

    // Settings
    settings: "Einstellungen",
    language: "Sprache",
    notifications: "Benachrichtigungen",
    enableNotifications: "Benachrichtigungen aktivieren",
    darkMode: "Dunkler Modus",
    enableDarkMode: "Dunklen Modus aktivieren",
    dataExport: "Datenexport",
    exportToPDF: "Als PDF exportieren",
    exportToExcel: "Als Excel exportieren",
    exportPDFMessage: "PDF-Export-Funktion wird bald verfügbar sein!",
    exportExcelMessage: "Excel-Export-Funktion wird bald verfügbar sein!",
    about: "Über",
    version: "Version 1.0.0",
    save: "Speichern",
    cancel: "Abbrechen",
    userInfo: "Benutzerinformationen",
    partnerNames: "Partner-Namen",
    yourName: "Ihr Name",
    partnerName: "Partner-Name",
    yourNamePlaceholder: "Ich",
    partnerNamePlaceholder: "Partner",
    account: "Konto",
    logout: "Abmelden",

    // Add Car Modal
    addNewCar: "Neues Auto hinzufügen",
    carMake: "Automarke",
    carModel: "Automodell",
    year: "Jahr",
    purchasePrice: "Kaufpreis",
    mileage: "Kilometerstand",
    condition: "Zustand",
    notes: "Notizen",
    excellent: "Ausgezeichnet",
    good: "Gut",
    fair: "Befriedigend",
    additionalInfo: "Zusätzliche Informationen",

    // Add Expense Modal
    addExpense: "Ausgabe hinzufügen",
    description: "Beschreibung",
    amount: "Betrag",
    category: "Kategorie",
    date: "Datum",
    type: "Typ",
    expense: "Ausgabe",
    selectCategory: "Kategorie auswählen",
    selectType: "Typ auswählen",

    // Common
    close: "Schließen",
    add: "Hinzufügen",
    edit: "Bearbeiten",
    delete: "Löschen",
    confirm: "Bestätigen",
    success: "Erfolg",
    error: "Fehler",

    // New keys
    paidBy: "Bezahlt von",
    you: "Sie",
    partner: "Partner",
    selectPayer: "Wählen Sie, wer bezahlt hat",
    reminder: "Erinnerung",
    sellReminderText: "Jeder Partner erhält seine Ausgaben zurück, und der verbleibende Gewinn wird 50/50 geteilt.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Allgemein",
    account: "Konto",
    appearance: "Erscheinungsbild",
    garage: "Garage",
    data: "Daten",

    // Settings content
    generalSettings: "Allgemeine Einstellungen",
    enterYourName: "Geben Sie Ihren Namen ein",
    enterPartnerName: "Geben Sie den Namen des Partners ein",
    receiveNotifications: "Benachrichtigungen über wichtige Ereignisse erhalten",
    accountInfo: "Kontoinformationen",
    emailAddress: "E-Mail-Adresse",
    logoutAccount: "Vom Konto abmelden",
    interfaceLanguage: "Oberflächensprache",
    selectLanguageDescription: "Wählen Sie die Sprache für die Anzeige der Anwendungsoberfläche aus",
    autoDetect: "Automatisch erkennen",
    detectedByBrowser: "Wird von den Browsereinstellungen erkannt",
    current: "Aktuell",
    useDarkTheme: "Dunkles Design der Benutzeroberfläche verwenden",
    garageSettings: "Garage Einstellungen",
    currentGarage: "Aktuelle Garage",
    manageMembers: "Mitglieder verwalten",
    selectGarageFirst: "Bitte wählen Sie zuerst eine Garage aus",
    exportDescription: "Exportieren Sie Ihre Daten in verschiedenen Formaten",
    appDescription:
      "Anwendung zur Verwaltung der Finanzen des Autogeschäfts. Verfolgen Sie Ausgaben, Einnahmen und Gewinne aus dem Autoverkauf.",
  },
  nl: {
    // Header
    carInventory: "Auto Inventaris",
    vehiclesInFleet: "voertuigen in uw vloot",
    searchVehicles: "Zoek voertuigen...",
    filter: "Filter",
    available: "Beschikbaar",
    sold: "Verkocht",
    pending: "In behandeling",

    // Car List
    addCar: "Auto toevoegen",
    totalExpenses: "Totale uitgaven",

    // Expense Detail
    financialOverview: "Financieel overzicht",
    totalIncome: "Totale inkomsten",
    netAmount: "Netto bedrag",
    allTransactions: "Alle transacties",
    income: "Inkomsten",
    expenses: "Uitgaven",
    sellVehicle: "Voertuig verkopen",

    // Categories
    purchase: "Aankoop",
    repair: "Reparatie",
    maintenance: "Onderhoud",
    service: "Service",
    partsSale: "Onderdelen verkoop",
    accessories: "Accessoires",

    // Sale Modal
    saleCompleted: "Verkoop voltooid!",
    transactionProcessed: "Transactie succesvol verwerkt",
    salePrice: "Verkoopprijs",
    margin: "Marge",
    financialBreakdown: "Financiële uitsplitsing",
    partnershipSplit: "Partnerschap verdeling",
    yourShare: "Uw aandeel",
    partnerShare: "Partner aandeel",
    profit: "Winst",
    continue: "Doorgaan",
    vehicleSoldSuccessfully: "Voertuig succesvol verkocht!",

    // Settings
    settings: "Instellingen",
    language: "Taal",
    notifications: "Meldingen",
    enableNotifications: "Meldingen inschakelen",
    darkMode: "Donkere modus",
    enableDarkMode: "Donkere modus inschakelen",
    dataExport: "Data export",
    exportToPDF: "Exporteren naar PDF",
    exportToExcel: "Exporteren naar Excel",
    exportPDFMessage: "PDF export functie komt binnenkort beschikbaar!",
    exportExcelMessage: "Excel export functie komt binnenkort beschikbaar!",
    about: "Over",
    version: "Versie 1.0.0",
    save: "Opslaan",
    cancel: "Annuleren",
    userInfo: "Gebruikersinformatie",
    partnerNames: "Partner namen",
    yourName: "Uw naam",
    partnerName: "Partner naam",
    yourNamePlaceholder: "Ik",
    partnerNamePlaceholder: "Partner",
    account: "Account",
    logout: "Uitloggen",

    // Add Car Modal
    addNewCar: "Nieuwe auto toevoegen",
    carMake: "Automerk",
    carModel: "Automodel",
    year: "Jaar",
    purchasePrice: "Aankoopprijs",
    mileage: "Kilometerstand",
    condition: "Conditie",
    notes: "Notities",
    excellent: "Uitstekend",
    good: "Goed",
    fair: "Redelijk",
    additionalInfo: "Aanvullende informatie",

    // Add Expense Modal
    addExpense: "Uitgave toevoegen",
    description: "Beschrijving",
    amount: "Bedrag",
    category: "Categorie",
    date: "Datum",
    type: "Type",
    expense: "Uitgave",
    selectCategory: "Selecteer categorie",
    selectType: "Selecteer type",

    // Common
    close: "Sluiten",
    add: "Toevoegen",
    edit: "Bewerken",
    delete: "Verwijderen",
    confirm: "Bevestigen",
    success: "Succes",
    error: "Fout",

    // New keys
    paidBy: "Betaald door",
    you: "U",
    partner: "Partner",
    selectPayer: "Selecteer wie heeft betaald",
    reminder: "Herinnering",
    sellReminderText: "Elke partner krijgt zijn uitgaven terug, en de resterende winst wordt 50/50 verdeeld.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Algemeen",
    account: "Account",
    appearance: "Uiterlijk",
    garage: "Garage",
    data: "Data",

    // Settings content
    generalSettings: "Algemene instellingen",
    enterYourName: "Voer uw naam in",
    enterPartnerName: "Voer de naam van de partner in",
    receiveNotifications: "Ontvang meldingen over belangrijke gebeurtenissen",
    accountInfo: "Accountinformatie",
    emailAddress: "E-mailadres",
    logoutAccount: "Uitloggen van account",
    interfaceLanguage: "Interface taal",
    selectLanguageDescription: "Selecteer de taal voor de weergave van de applicatie-interface",
    autoDetect: "Automatisch detecteren",
    detectedByBrowser: "Gedetecteerd door browserinstellingen",
    current: "Huidige",
    useDarkTheme: "Gebruik donker interface thema",
    garageSettings: "Garage instellingen",
    currentGarage: "Huidige garage",
    manageMembers: "Beheer leden",
    selectGarageFirst: "Selecteer eerst een garage",
    exportDescription: "Exporteer uw gegevens in verschillende formaten",
    appDescription:
      "Applicatie voor het beheren van de financiën van autobedrijven. Volg uitgaven, inkomsten en winst uit de verkoop van auto's.",
  },
  es: {
    // Header
    carInventory: "Inventario de Coches",
    vehiclesInFleet: "vehículos en su flota",
    searchVehicles: "Buscar vehículos...",
    filter: "Filtrar",
    available: "Disponible",
    sold: "Vendido",
    pending: "Pendiente",

    // Car List
    addCar: "Agregar Coche",
    totalExpenses: "Gastos Totales",

    // Expense Detail
    financialOverview: "Resumen Financiero",
    totalIncome: "Ingresos Totales",
    netAmount: "Cantidad Neta",
    allTransactions: "Todas las Transacciones",
    income: "Ingresos",
    expenses: "Gastos",
    sellVehicle: "Vender Vehículo",

    // Categories
    purchase: "Compra",
    repair: "Reparación",
    maintenance: "Mantenimiento",
    service: "Servicio",
    partsSale: "Venta de Piezas",
    accessories: "Accesorios",

    // Sale Modal
    saleCompleted: "¡Venta Completada!",
    transactionProcessed: "Transacción procesada exitosamente",
    salePrice: "Precio de Venta",
    margin: "Margen",
    financialBreakdown: "Desglose Financiero",
    partnershipSplit: "División de Sociedad",
    yourShare: "Su Parte",
    partnerShare: "Parte del Socio",
    profit: "Ganancia",
    continue: "Continuar",
    vehicleSoldSuccessfully: "¡Vehículo Vendido Exitosamente!",

    // Settings
    settings: "Configuración",
    language: "Idioma",
    notifications: "Notificaciones",
    enableNotifications: "Habilitar Notificaciones",
    darkMode: "Modo Oscuro",
    enableDarkMode: "Habilitar Modo Oscuro",
    dataExport: "Exportar Datos",
    exportToPDF: "Exportar a PDF",
    exportToExcel: "Exportar a Excel",
    exportPDFMessage: "¡La función de exportar PDF estará disponible pronto!",
    exportExcelMessage: "¡La función de exportar Excel estará disponible pronto!",
    about: "Acerca de",
    version: "Versión 1.0.0",
    save: "Guardar",
    cancel: "Cancelar",
    userInfo: "Información del Usuario",
    partnerNames: "Nombres de Socios",
    yourName: "Su Nombre",
    partnerName: "Nombre del Socio",
    yourNamePlaceholder: "Yo",
    partnerNamePlaceholder: "Socio",
    account: "Cuenta",
    logout: "Cerrar Sesión",

    // Add Car Modal
    addNewCar: "Agregar Nuevo Coche",
    carMake: "Marca del Coche",
    carModel: "Modelo del Coche",
    year: "Año",
    purchasePrice: "Precio de Compra",
    mileage: "Kilometraje",
    condition: "Condición",
    notes: "Notas",
    excellent: "Excelente",
    good: "Bueno",
    fair: "Regular",
    additionalInfo: "Información adicional",

    // Add Expense Modal
    addExpense: "Agregar Gasto",
    description: "Descripción",
    amount: "Cantidad",
    category: "Categoría",
    date: "Fecha",
    type: "Tipo",
    expense: "Gasto",
    selectCategory: "Seleccionar Categoría",
    selectType: "Seleccionar Tipo",

    // Common
    close: "Cerrar",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    confirm: "Confirmar",
    success: "Éxito",
    error: "Error",

    // New keys
    paidBy: "Pagado Por",
    you: "Usted",
    partner: "Socio",
    selectPayer: "Seleccionar quién pagó",
    reminder: "Recordatorio",
    sellReminderText: "Cada socio recuperará sus gastos, y la ganancia restante se dividirá 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "General",
    account: "Cuenta",
    appearance: "Apariencia",
    garage: "Garaje",
    data: "Datos",

    // Settings content
    generalSettings: "Configuración general",
    enterYourName: "Ingrese su nombre",
    enterPartnerName: "Ingrese el nombre del socio",
    receiveNotifications: "Recibir notificaciones sobre eventos importantes",
    accountInfo: "Información de la cuenta",
    emailAddress: "Dirección de correo electrónico",
    logoutAccount: "Cerrar sesión de la cuenta",
    interfaceLanguage: "Idioma de la interfaz",
    selectLanguageDescription: "Seleccione el idioma para la visualización de la interfaz de la aplicación",
    autoDetect: "Detección automática",
    detectedByBrowser: "Detectado por la configuración del navegador",
    current: "Actual",
    useDarkTheme: "Usar tema oscuro de la interfaz",
    garageSettings: "Configuración del garaje",
    currentGarage: "Garaje actual",
    manageMembers: "Administrar miembros",
    selectGarageFirst: "Por favor, seleccione un garaje primero",
    exportDescription: "Exporte sus datos en varios formatos",
    appDescription:
      "Aplicación para administrar las finanzas de la empresa de automóviles. Realice un seguimiento de los gastos, ingresos y ganancias de la venta de automóviles.",
  },
  it: {
    // Header
    carInventory: "Inventario Auto",
    vehiclesInFleet: "veicoli nella tua flotta",
    searchVehicles: "Cerca veicoli...",
    filter: "Filtro",
    available: "Disponibile",
    sold: "Venduto",
    pending: "In attesa",

    // Car List
    addCar: "Aggiungi Auto",
    totalExpenses: "Spese Totali",

    // Expense Detail
    financialOverview: "Panoramica Finanziaria",
    totalIncome: "Reddito Totale",
    netAmount: "Importo Netto",
    allTransactions: "Tutte le Transazioni",
    income: "Reddito",
    expenses: "Spese",
    sellVehicle: "Vendi Veicolo",

    // Categories
    purchase: "Acquisto",
    repair: "Riparazione",
    maintenance: "Manutenzione",
    service: "Servizio",
    partsSale: "Vendita Parti",
    accessories: "Accessori",

    // Sale Modal
    saleCompleted: "Vendita Completata!",
    transactionProcessed: "Transazione elaborata con successo",
    salePrice: "Prezzo di Vendita",
    margin: "Margine",
    financialBreakdown: "Ripartizione Finanziaria",
    partnershipSplit: "Divisione Partnership",
    yourShare: "La Tua Parte",
    partnerShare: "Parte del Partner",
    profit: "Profitto",
    continue: "Continua",
    vehicleSoldSuccessfully: "Veicolo Venduto con Successo!",

    // Settings
    settings: "Impostazioni",
    language: "Lingua",
    notifications: "Notifiche",
    enableNotifications: "Abilita Notifiche",
    darkMode: "Modalità Scura",
    enableDarkMode: "Abilita Modalità Scura",
    dataExport: "Esportazione Dati",
    exportToPDF: "Esporta in PDF",
    exportToExcel: "Esporta in Excel",
    exportPDFMessage: "La funzione di esportazione PDF sarà presto disponibile!",
    exportExcelMessage: "La funzione di esportazione Excel sarà presto disponibile!",
    about: "Informazioni",
    version: "Versione 1.0.0",
    save: "Salva",
    cancel: "Annulla",
    userInfo: "Informazioni Utente",
    partnerNames: "Nomi Partner",
    yourName: "Il Tuo Nome",
    partnerName: "Nome Partner",
    yourNamePlaceholder: "Io",
    partnerNamePlaceholder: "Partner",
    account: "Account",
    logout: "Disconnetti",

    // Add Car Modal
    addNewCar: "Aggiungi Nuova Auto",
    carMake: "Marca Auto",
    carModel: "Modello Auto",
    year: "Anno",
    purchasePrice: "Prezzo di Acquisto",
    mileage: "Chilometraggio",
    condition: "Condizione",
    notes: "Note",
    excellent: "Eccellente",
    good: "Buono",
    fair: "Discreto",
    additionalInfo: "Informazioni aggiuntive",

    // Add Expense Modal
    addExpense: "Aggiungi Spesa",
    description: "Descrizione",
    amount: "Importo",
    category: "Categoria",
    date: "Data",
    type: "Tipo",
    expense: "Spesa",
    selectCategory: "Seleziona Categoria",
    selectType: "Seleziona Tipo",

    // Common
    close: "Chiudi",
    add: "Aggiungi",
    edit: "Modifica",
    delete: "Elimina",
    confirm: "Conferma",
    success: "Successo",
    error: "Errore",

    // New keys
    paidBy: "Pagato Da",
    you: "Tu",
    partner: "Partner",
    selectPayer: "Seleziona chi ha pagato",
    reminder: "Promemoria",
    sellReminderText: "Ogni partner recupererà le proprie spese, e il profitto rimanente sarà diviso 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Generale",
    account: "Account",
    appearance: "Aspetto",
    garage: "Garage",
    data: "Dati",

    // Settings content
    generalSettings: "Impostazioni generali",
    enterYourName: "Inserisci il tuo nome",
    enterPartnerName: "Inserisci il nome del partner",
    receiveNotifications: "Ricevi notifiche su eventi importanti",
    accountInfo: "Informazioni sull'account",
    emailAddress: "Indirizzo email",
    logoutAccount: "Disconnetti dall'account",
    interfaceLanguage: "Lingua dell'interfaccia",
    selectLanguageDescription: "Seleziona la lingua per la visualizzazione dell'interfaccia dell'applicazione",
    autoDetect: "Rilevamento automatico",
    detectedByBrowser: "Rilevato dalle impostazioni del browser",
    current: "Attuale",
    useDarkTheme: "Usa il tema scuro dell'interfaccia",
    garageSettings: "Impostazioni del garage",
    currentGarage: "Garage attuale",
    manageMembers: "Gestisci membri",
    selectGarageFirst: "Seleziona prima un garage",
    exportDescription: "Esporta i tuoi dati in vari formati",
    appDescription:
      "Applicazione per la gestione delle finanze delle aziende automobilistiche. Tieni traccia di spese, entrate e profitti derivanti dalla vendita di auto.",
  },
  uk: {
    // Header
    carInventory: "Інвентар Автомобілів",
    vehiclesInFleet: "автомобілів у вашому автопарку",
    searchVehicles: "Пошук автомобілів...",
    filter: "Фільтр",
    available: "Доступно",
    sold: "Продано",
    pending: "Очікує",

    // Car List
    addCar: "Додати Автомобіль",
    totalExpenses: "Загальні Витрати",

    // Expense Detail
    financialOverview: "Фінансовий Огляд",
    totalIncome: "Загальний Дохід",
    netAmount: "Чиста Сума",
    allTransactions: "Всі Транзакції",
    income: "Дохід",
    expenses: "Витрати",
    sellVehicle: "Продати Автомобіль",

    // Categories
    purchase: "Покупка",
    repair: "Ремонт",
    maintenance: "Обслуговування",
    service: "Сервіс",
    partsSale: "Продаж Запчастин",
    accessories: "Аксесуари",

    // Sale Modal
    saleCompleted: "Продаж Завершено!",
    transactionProcessed: "Транзакція успішно оброблена",
    salePrice: "Ціна Продажу",
    margin: "Маржа",
    financialBreakdown: "Фінансова Розбивка",
    partnershipSplit: "Розподіл Партнерства",
    yourShare: "Ваша Частка",
    partnerShare: "Частка Партнера",
    profit: "Прибуток",
    continue: "Продовжити",
    vehicleSoldSuccessfully: "Автомобіль Успішно Продано!",

    // Settings
    settings: "Налаштування",
    language: "Мова",
    notifications: "Сповіщення",
    enableNotifications: "Увімкнути Сповіщення",
    darkMode: "Темна Тема",
    enableDarkMode: "Увімкнути Темну Тему",
    dataExport: "Експорт Даних",
    exportToPDF: "Експорт в PDF",
    exportToExcel: "Експорт в Excel",
    exportPDFMessage: "Функція експорту в PDF скоро буде доступна!",
    exportExcelMessage: "Функція експорту в Excel скоро буде доступна!",
    about: "Про Програму",
    version: "Версія 1.0.0",
    save: "Зберегти",
    cancel: "Скасувати",
    userInfo: "Інформація Користувача",
    partnerNames: "Імена Партнерів",
    yourName: "Ваше Ім'я",
    partnerName: "Ім'я Партнера",
    yourNamePlaceholder: "Я",
    partnerNamePlaceholder: "Партнер",
    account: "Акаунт",
    logout: "Вийти",

    // Add Car Modal
    addNewCar: "Додати Новий Автомобіль",
    carMake: "Марка Автомобіля",
    carModel: "Модель Автомобіля",
    year: "Рік",
    purchasePrice: "Ціна Покупки",
    mileage: "Пробіг",
    condition: "Стан",
    notes: "Нотатки",
    excellent: "Відмінний",
    good: "Хороший",
    fair: "Задовільний",
    additionalInfo: "Додаткова інформація",

    // Add Expense Modal
    addExpense: "Додати Витрату",
    description: "Опис",
    amount: "Сума",
    category: "Категорія",
    date: "Дата",
    type: "Тип",
    expense: "Витрата",
    selectCategory: "Оберіть Категорію",
    selectType: "Оберіть Тип",

    // Common
    close: "Закрити",
    add: "Додати",
    edit: "Редагувати",
    delete: "Видалити",
    confirm: "Підтвердити",
    success: "Успіх",
    error: "Помилка",

    // New keys
    paidBy: "Хто Заплатив",
    you: "Ви",
    partner: "Партнер",
    selectPayer: "Оберіть хто заплатив",
    reminder: "Нагадування",
    sellReminderText: "Кожен партнер отримає назад свої витрати, а решта прибутку буде розділена 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Загальні",
    account: "Обліковий запис",
    appearance: "Зовнішній вигляд",
    garage: "Гараж",
    data: "Дані",

    // Settings content
    generalSettings: "Загальні налаштування",
    enterYourName: "Введіть ваше ім'я",
    enterPartnerName: "Введіть ім'я партнера",
    receiveNotifications: "Отримувати сповіщення про важливі події",
    accountInfo: "Інформація про обліковий запис",
    emailAddress: "Електронна адреса",
    logoutAccount: "Вийти з облікового запису",
    interfaceLanguage: "Мова інтерфейсу",
    selectLanguageDescription: "Виберіть мову для відображення інтерфейсу програми",
    autoDetect: "Автоматичне визначення",
    detectedByBrowser: "Визначається за налаштуваннями браузера",
    current: "Поточний",
    useDarkTheme: "Використовувати темну тему інтерфейсу",
    garageSettings: "Налаштування гаража",
    currentGarage: "Поточний гараж",
    manageMembers: "Керування учасниками",
    selectGarageFirst: "Спочатку виберіть гараж",
    exportDescription: "Експортуйте ваші дані в різних форматах",
    appDescription:
      "Додаток для управління фінансами автомобільного бізнесу. Відстежуйте витрати, доходи та прибуток від продажу автомобілів.",
  },
  ka: {
    // Header
    carInventory: "ავტომობილების ინვენტარი",
    vehiclesInFleet: "ავტომობილი თქვენს ავტოპარკში",
    searchVehicles: "ავტომობილების ძიება...",
    filter: "ფილტრი",
    available: "ხელმისაწვდომი",
    sold: "გაყიდული",
    pending: "მოლოდინში",

    // Car List
    addCar: "ავტომობილის დამატება",
    totalExpenses: "მთლიანი ხარჯები",

    // Expense Detail
    financialOverview: "ფინანსური მიმოხილვა",
    totalIncome: "მთლიანი შემოსავალი",
    netAmount: "წმინდა თანხა",
    allTransactions: "ყველა ტრანზაქცია",
    income: "შემოსავალი",
    expenses: "ხარჯები",
    sellVehicle: "ავტომობილის გაყიდვა",

    // Categories
    purchase: "შეძენა",
    repair: "შეკეთება",
    maintenance: "მომსახურება",
    service: "სერვისი",
    partsSale: "ნაწილების გაყიდვა",
    accessories: "აქსესუარები",

    // Sale Modal
    saleCompleted: "გაყიდვა დასრულდა!",
    transactionProcessed: "ტრანზაქცია წარმატებით დამუშავდა",
    salePrice: "გაყიდვის ფასი",
    margin: "მარჟა",
    financialBreakdown: "ფინანსური დაყოფა",
    partnershipSplit: "პარტნიორობის გაყოფა",
    yourShare: "თქვენი წილი",
    partnerShare: "პარტნიორის წილი",
    profit: "მოგება",
    continue: "გაგრძელება",
    vehicleSoldSuccessfully: "ავტომობილი წარმატებით გაიყიდა!",

    // Settings
    settings: "პარამეტრები",
    language: "ენა",
    notifications: "შეტყობინებები",
    enableNotifications: "შეტყობინებების ჩართვა",
    darkMode: "მუქი რეჟიმი",
    enableDarkMode: "მუქი რეჟიმის ჩართვა",
    dataExport: "მონაცემების ექსპორტი",
    exportToPDF: "PDF-ში ექსპორტი",
    exportToExcel: "Excel-ში ექსპორტი",
    exportPDFMessage: "PDF ექსპორტის ფუნქცია მალე იქნება ხელმისაწვდომი!",
    exportExcelMessage: "Excel ექსპორტის ფუნქცია მალე იქნება ხელმისაწვდომი!",
    about: "პროგრამის შესახებ",
    version: "ვერსია 1.0.0",
    save: "შენახვა",
    cancel: "გაუქმება",
    userInfo: "მომხმარებლის ინფორმაცია",
    partnerNames: "პარტნიორების სახელები",
    yourName: "თქვენი სახელი",
    partnerName: "პარტნიორის სახელი",
    yourNamePlaceholder: "მე",
    partnerNamePlaceholder: "პარტნიორი",
    account: "ანგარიში",
    logout: "გასვლა",

    // Add Car Modal
    addNewCar: "ახალი ავტომობილის დამატება",
    carMake: "ავტომობილის მარკა",
    carModel: "ავტომობილის მოდელი",
    year: "წელი",
    purchasePrice: "შეძენის ფასი",
    mileage: "გარბენი",
    condition: "მდგომარეობა",
    notes: "შენიშვნები",
    excellent: "შესანიშნავი",
    good: "კარგი",
    fair: "დამაკმაყოფილებელი",
    additionalInfo: "დამატებითი ინფორმაცია",

    // Add Expense Modal
    addExpense: "ხარჯის დამატება",
    description: "აღწერა",
    amount: "თანხა",
    category: "კატეგორია",
    date: "თარიღი",
    type: "ტიპი",
    expense: "ხარჯი",
    selectCategory: "კატეგორიის არჩევა",
    selectType: "ტიპის არჩევა",

    // Common
    close: "დახურვა",
    add: "დამატება",
    edit: "რედაქტირება",
    delete: "წაშლა",
    confirm: "დადასტურება",
    success: "წარმატება",
    error: "შეცდომა",

    // New keys
    paidBy: "გადაიხადა",
    you: "თქვენ",
    partner: "პარტნიორი",
    selectPayer: "აირჩიეთ ვინ გადაიხადა",
    reminder: "შეხსენება",
    sellReminderText: "თითოეული პარტნიორი დაიბრუნებს თავის ხარჯებს, ხოლო დარჩენილი მოგება გაიყოფა 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "გენერალური",
    account: "ანგარიში",
    appearance: "გარეგნობა",
    garage: "ავტოფარეხი",
    data: "მონაცემები",

    // Settings content
    generalSettings: "ძირითადი პარამეტრები",
    enterYourName: "შეიყვანეთ თქვენი სახელი",
    enterPartnerName: "შეიყვანეთ პარტნიორის სახელი",
    receiveNotifications: "მიიღეთ შეტყობინებები მნიშვნელოვანი მოვლენების შესახებ",
    accountInfo: "ანგარიშის ინფორმაცია",
    emailAddress: "ელექტრონული ფოსტის მისამართი",
    logoutAccount: "გამოსვლა ანგარიშიდან",
    interfaceLanguage: "ინტერფეისის ენა",
    selectLanguageDescription: "აირჩიეთ ენა აპლიკაციის ინტერფეისის გამოსაჩენად",
    autoDetect: "ავტომატური გამოვლენა",
    detectedByBrowser: "გამოვლენილია ბრაუზერის პარამეტრებით",
    current: "მიმდინარე",
    useDarkTheme: "გამოიყენეთ ინტერფეისის მუქი თემა",
    garageSettings: "ავტოფარეხის პარამეტრები",
    currentGarage: "მიმდინარე ავტოფარეხი",
    manageMembers: "წევრების მართვა",
    selectGarageFirst: "გთხოვთ, ჯერ აირჩიოთ ავტოფარეხი",
    exportDescription: "ექსპორტზე თქვენი მონაცემები სხვადასხვა ფორმატში",
    appDescription:
      "განაცხადი ავტომობილების ბიზნესის ფინანსების მართვისთვის. თვალყური ადევნეთ ხარჯებს, შემოსავალს და მოგებას მანქანების გაყიდვიდან.",
  },
  tr: {
    // Header
    carInventory: "Araç Envanteri",
    vehiclesInFleet: "filonuzdaki araç",
    searchVehicles: "Araç ara...",
    filter: "Filtre",
    available: "Mevcut",
    sold: "Satıldı",
    pending: "Beklemede",

    // Car List
    addCar: "Araç Ekle",
    totalExpenses: "Toplam Giderler",

    // Expense Detail
    financialOverview: "Finansal Genel Bakış",
    totalIncome: "Toplam Gelir",
    netAmount: "Net Tutar",
    allTransactions: "Tüm İşlemler",
    income: "Gelir",
    expenses: "Giderler",
    sellVehicle: "Araç Sat",

    // Categories
    purchase: "Satın Alma",
    repair: "Onarım",
    maintenance: "Bakım",
    service: "Servis",
    partsSale: "Parça Satışı",
    accessories: "Aksesuarlar",

    // Sale Modal
    saleCompleted: "Satış Tamamlandı!",
    transactionProcessed: "İşlem başarıyla işlendi",
    salePrice: "Satış Fiyatı",
    margin: "Kar Marjı",
    financialBreakdown: "Finansal Dağılım",
    partnershipSplit: "Ortaklık Paylaşımı",
    yourShare: "Sizin Payınız",
    partnerShare: "Ortak Payı",
    profit: "Kar",
    continue: "Devam Et",
    vehicleSoldSuccessfully: "Araç Başarıyla Satıldı!",

    // Settings
    settings: "Ayarlar",
    language: "Dil",
    notifications: "Bildirimler",
    enableNotifications: "Bildirimleri Etkinleştir",
    darkMode: "Karanlık Mod",
    enableDarkMode: "Karanlık Modu Etkinleştir",
    dataExport: "Veri Dışa Aktarma",
    exportToPDF: "PDF'ye Aktar",
    exportToExcel: "Excel'e Aktar",
    exportPDFMessage: "PDF dışa aktarma özelliği yakında kullanılabilir olacak!",
    exportExcelMessage: "Excel dışa aktarma özelliği yakında kullanılabilir olacak!",
    about: "Hakkında",
    version: "Sürüm 1.0.0",
    save: "Kaydet",
    cancel: "İptal",
    userInfo: "Kullanıcı Bilgileri",
    partnerNames: "Ortak İsimleri",
    yourName: "Adınız",
    partnerName: "Ortak Adı",
    yourNamePlaceholder: "Ben",
    partnerNamePlaceholder: "Ortak",
    account: "Hesap",
    logout: "Çıkış Yap",

    // Add Car Modal
    addNewCar: "Yeni Araç Ekle",
    carMake: "Araç Markası",
    carModel: "Araç Modeli",
    year: "Yıl",
    purchasePrice: "Satın Alma Fiyatı",
    mileage: "Kilometre",
    condition: "Durum",
    notes: "Notlar",
    excellent: "Mükemmel",
    good: "İyi",
    fair: "Orta",
    additionalInfo: "Ek bilgiler",

    // Add Expense Modal
    addExpense: "Gider Ekle",
    description: "Açıklama",
    amount: "Tutar",
    category: "Kategori",
    date: "Tarih",
    type: "Tür",
    expense: "Gider",
    selectCategory: "Kategori Seç",
    selectType: "Tür Seç",

    // Common
    close: "Kapat",
    add: "Ekle",
    edit: "Düzenle",
    delete: "Sil",
    confirm: "Onayla",
    success: "Başarılı",
    error: "Hata",

    // New keys
    paidBy: "Ödeyen",
    you: "Siz",
    partner: "Ortak",
    selectPayer: "Kim ödedi seçin",
    reminder: "Hatırlatma",
    sellReminderText: "Her ortak kendi giderlerini geri alacak ve kalan kar 50/50 paylaşılacak.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Genel",
    account: "Hesap",
    appearance: "Görünüm",
    garage: "Garaj",
    data: "Veri",

    // Settings content
    generalSettings: "Genel Ayarlar",
    enterYourName: "Adınızı girin",
    enterPartnerName: "Ortak adını girin",
    receiveNotifications: "Önemli olaylar hakkında bildirim alın",
    accountInfo: "Hesap Bilgileri",
    emailAddress: "E-posta Adresi",
    logoutAccount: "Hesaptan çıkış yap",
    interfaceLanguage: "Arayüz Dili",
    selectLanguageDescription: "Uygulama arayüzü ekranı için dili seçin",
    autoDetect: "Otomatik Algılama",
    detectedByBrowser: "Tarayıcı ayarları tarafından algılandı",
    current: "Mevcut",
    useDarkTheme: "Karanlık arayüz temasını kullan",
    garageSettings: "Garaj Ayarları",
    currentGarage: "Mevcut Garaj",
    manageMembers: "Üyeleri yönet",
    selectGarageFirst: "Lütfen önce bir garaj seçin",
    exportDescription: "Verilerinizi çeşitli formatlarda dışa aktarın",
    appDescription:
      "Araba işi finansmanını yönetme uygulaması. Araba satışlarından elde edilen giderleri, gelirleri ve karları takip edin.",
  },
  hy: {
    // Header
    carInventory: "Ավտոմեքենաների Գույք",
    vehiclesInFleet: "ավտոմեքենա ձեր ավտոպարկում",
    searchVehicles: "Փնտրել ավտոմեքենաներ...",
    filter: "Զտիչ",
    available: "Հասանելի",
    sold: "Վաճառված",
    pending: "Սպասման մեջ",

    // Car List
    addCar: "Ավելացնել Ավտոմեքենա",
    totalExpenses: "Ընդհանուր Ծախսեր",

    // Expense Detail
    financialOverview: "Ֆինանսական Ակնարկ",
    totalIncome: "Ընդհանուր Եկամուտ",
    netAmount: "Զուտ Գումար",
    allTransactions: "Բոլոր Գործարքները",
    income: "Եկամուտ",
    expenses: "Ծախսեր",
    sellVehicle: "Վաճառել Ավտոմեքենա",

    // Categories
    purchase: "Գնում",
    repair: "Նորոգում",
    maintenance: "Սպասարկում",
    service: "Սերվիս",
    partsSale: "Պահեստամասերի Վաճառք",
    accessories: "Աքսեսուարներ",

    // Sale Modal
    saleCompleted: "Վաճառքը Ավարտված է!",
    transactionProcessed: "Գործարքը հաջողությամբ մշակված է",
    salePrice: "Վաճառքի Գին",
    margin: "Շահույթ",
    financialBreakdown: "Ֆինանսական Բաշխում",
    partnershipSplit: "Գործընկերության Բաժանում",
    yourShare: "Ձեր Բաժին",
    partnerShare: "Գործընկերի Բաժին",
    profit: "Շահույթ",
    continue: "Շարունակել",
    vehicleSoldSuccessfully: "Ավտոմեքենան Հաջողությամբ Վաճառված է!",

    // Settings
    settings: "Կարգավորումներ",
    language: "Լեզու",
    notifications: "Ծանուցումներ",
    enableNotifications: "Միացնել Ծանուցումները",
    darkMode: "Մուգ Ռեժիմ",
    enableDarkMode: "Միացնել Մուգ Ռեժիմը",
    dataExport: "Տվյալների Արտահանում",
    exportToPDF: "Արտահանել PDF",
    exportToExcel: "Արտահանել Excel",
    exportPDFMessage: "PDF արտահանման գործառույթը շուտով հասանելի կլինի!",
    exportExcelMessage: "Excel արտահանման գործառույթը շուտով հասանելի կլինի!",
    about: "Ծրագրի Մասին",
    version: "Տարբերակ 1.0.0",
    save: "Պահպանել",
    cancel: "Չեղարկել",
    userInfo: "Օգտատիրոջ Տեղեկություններ",
    partnerNames: "Գործընկերների Անուններ",
    yourName: "Ձեր Անունը",
    partnerName: "Գործընկերի Անունը",
    yourNamePlaceholder: "Ես",
    partnerNamePlaceholder: "Գործընկեր",
    account: "Հաշիվ",
    logout: "Դուրս Գալ",

    // Add Car Modal
    addNewCar: "Ավելացնել Նոր Ավտոմեքենա",
    carMake: "Ավտոմեքենայի Մարկա",
    carModel: "Ավտոմեքենայի Մոդել",
    year: "Տարի",
    purchasePrice: "Գնման Գին",
    mileage: "Վազք",
    condition: "Վիճակ",
    notes: "Նշումներ",
    excellent: "Գերազանց",
    good: "Լավ",
    fair: "Բավարար",
    additionalInfo: "Լրացուցիչ տեղեկություններ",

    // Add Expense Modal
    addExpense: "Ավելացնել Ծախս",
    description: "Նկարագրություն",
    amount: "Գումար",
    category: "Կատեգորիա",
    date: "Ամսաթիվ",
    type: "Տեսակ",
    expense: "Ծախս",
    selectCategory: "Ընտրել Կատեգորիա",
    selectType: "Ընտրել Տեսակ",

    // Common
    close: "Փակել",
    add: "Ավելացնել",
    edit: "Խմբագրել",
    delete: "Ջնջել",
    confirm: "Հաստատել",
    success: "Հաջողություն",
    error: "Սխալ",

    // New keys
    paidBy: "Վճարված է",
    you: "Դուք",
    partner: "Գործընկեր",
    selectPayer: "Ընտրեք ով է վճարել",
    reminder: "Հիշեցում",
    sellReminderText: "Յուրաքանչյուր գործընկեր կվերադարձնի իր ծախսերը, իսկ մնացած շահույթը կբաժանվի 50/50:",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Ընդհանուր",
    account: "Հաշիվ",
    appearance: "Արտաքին տեսք",
    garage: "Գարաժ",
    data: "Տվյալներ",

    // Settings content
    generalSettings: "Ընդհանուր կարգավորումներ",
    enterYourName: "Մուտքագրեք ձեր անունը",
    enterPartnerName: "Մուտքագրեք գործընկերոջ անունը",
    receiveNotifications: "Ստացեք ծանուցումներ կարևոր իրադարձությունների մասին",
    accountInfo: "Հաշվի մասին տեղեկություններ",
    emailAddress: "Էլեկտրոնային հասցե",
    logoutAccount: "Դուրս գալ հաշվից",
    interfaceLanguage: "Ինտերֆեյսի լեզու",
    selectLanguageDescription: "Ընտրեք լեզուն հավելվածի ինտերֆեյսի ցուցադրման համար",
    autoDetect: "Ավտոմատ հայտնաբերում",
    detectedByBrowser: "Հայտնաբերվել է դիտարկիչի կարգավորումներով",
    current: "Ընթացիկ",
    useDarkTheme: "Օգտագործել ինտերֆեյսի մուգ թեման",
    garageSettings: "Ավտոտնակի կարգավորումներ",
    currentGarage: "Ընթացիկ ավտոտնակ",
    manageMembers: "Կառավարել անդամներին",
    selectGarageFirst: "Խնդրում ենք նախ ընտրել ավտոտնակ",
    exportDescription: "Արտահանեք ձեր տվյալները տարբեր ձևաչափերով",
    appDescription:
      "Դիմում ավտոմեքենաների բիզնեսի ֆինանսների կառավարման համար: Հետևեք ծախսերին, եկամուտներին և շահույթին ավտոմեքենաների վաճառքից:",
  },
  pl: {
    // Header
    carInventory: "Inwentarz Samochodów",
    vehiclesInFleet: "pojazdów w Twojej flocie",
    searchVehicles: "Szukaj pojazdów...",
    filter: "Filtr",
    available: "Dostępne",
    sold: "Sprzedane",
    pending: "Oczekujące",

    // Car List
    addCar: "Dodaj Samochód",
    totalExpenses: "Całkowite Wydatki",

    // Expense Detail
    financialOverview: "Przegląd Finansowy",
    totalIncome: "Całkowity Dochód",
    netAmount: "Kwota Netto",
    allTransactions: "Wszystkie Transakcje",
    income: "Dochód",
    expenses: "Wydatki",
    sellVehicle: "Sprzedaj Pojazd",

    // Categories
    purchase: "Zakup",
    repair: "Naprawa",
    maintenance: "Konserwacja",
    service: "Serwis",
    partsSale: "Sprzedaż Części",
    accessories: "Akcesoria",

    // Sale Modal
    saleCompleted: "Sprzedaż Zakończona!",
    transactionProcessed: "Transakcja pomyślnie przetworzona",
    salePrice: "Cena Sprzedaży",
    margin: "Marża",
    financialBreakdown: "Podział Finansowy",
    partnershipSplit: "Podział Partnerstwa",
    yourShare: "Twój Udział",
    partnerShare: "Udział Partnera",
    profit: "Zysk",
    continue: "Kontynuuj",
    vehicleSoldSuccessfully: "Pojazd Pomyślnie Sprzedany!",

    // Settings
    settings: "Ustawienia",
    language: "Język",
    notifications: "Powiadomienia",
    enableNotifications: "Włącz Powiadomienia",
    darkMode: "Tryb Ciemny",
    enableDarkMode: "Włącz Tryb Ciemny",
    dataExport: "Eksport Danych",
    exportToPDF: "Eksportuj do PDF",
    exportToExcel: "Eksportuj do Excel",
    exportPDFMessage: "Funkcja eksportu PDF będzie wkrótce dostępna!",
    exportExcelMessage: "Funkcja eksportu Excel będzie wkrótce dostępna!",
    about: "O Programie",
    version: "Wersja 1.0.0",
    save: "Zapisz",
    cancel: "Anuluj",
    userInfo: "Informacje o Użytkowniku",
    partnerNames: "Imiona Partnerów",
    yourName: "Twoje Imię",
    partnerName: "Imię Partnera",
    yourNamePlaceholder: "Ja",
    partnerNamePlaceholder: "Partner",
    account: "Konto",
    logout: "Wyloguj",

    // Add Car Modal
    addNewCar: "Dodaj Nowy Samochód",
    carMake: "Marka Samochodu",
    carModel: "Model Samochodu",
    year: "Rok",
    purchasePrice: "Cena Zakupu",
    mileage: "Przebieg",
    condition: "Stan",
    notes: "Notatki",
    excellent: "Doskonały",
    good: "Dobry",
    fair: "Zadowalający",
    additionalInfo: "Dodatkowe informacje",

    // Add Expense Modal
    addExpense: "Dodaj Wydatek",
    description: "Opis",
    amount: "Kwota",
    category: "Kategoria",
    date: "Data",
    type: "Typ",
    expense: "Wydatek",
    selectCategory: "Wybierz Kategorię",
    selectType: "Wybierz Typ",

    // Common
    close: "Zamknij",
    add: "Dodaj",
    edit: "Edytuj",
    delete: "Usuń",
    confirm: "Potwierdź",
    success: "Sukces",
    error: "Błąd",

    // New keys
    paidBy: "Zapłacone Przez",
    you: "Ty",
    partner: "Partner",
    selectPayer: "Wybierz kto zapłacił",
    reminder: "Przypomnienie",
    sellReminderText: "Każdy partner odzyska swoje wydatki, a pozostały zysk zostanie podzielony 50/50.",

    // Language names
    english: "English",
    russian: "Русский",
    french: "Français",
    german: "Deutsch",
    dutch: "Nederlands",
    spanish: "Español",
    italian: "Italiano",
    ukrainian: "Українська",
    georgian: "ქართული",
    turkish: "Türkçe",
    armenian: "Հայերեն",
    polish: "Polski",
    swedish: "Svenska",

    // Settings categories
    general: "Ogólne",
    account: "Konto",
    appearance: "Wygląd",
    garage: "Garaż",
    data: "Dane",

    // Settings content
    generalSettings: "Ustawienia ogólne",
    enterYourName: "Wpisz swoje imię",
    enterPartnerName: "Wpisz imię partnera",
    receiveNotifications: "Otrzymuj powiadomienia o ważnych wydarzeniach",
    accountInfo: "Informacje o koncie",
    emailAddress: "Adres e-mail",
    logoutAccount: "Wyloguj się z konta",
    interfaceLanguage: "Język interfejsu",
    selectLanguageDescription: "Wybierz język wyświetlania interfejsu aplikacji",
    autoDetect: "Automatyczne wykrywanie",
    detectedByBrowser: "Wykrywane przez ustawienia przeglądarki",
    current: "Bieżący",
    useDarkTheme: "Użyj ciemnego motywu interfejsu",
    garageSettings: "Ustawienia garażu",
    currentGarage: "Bieżący garaż",
    manageMembers: "Zarządzaj członkami",
    selectGarageFirst: "Najpierw wybierz garaż",
    exportDescription: "Eksportuj swoje dane w różnych formatach",
    appDescription:
      "Aplikacja do zarządzania finansami firmy samochodowej. Śledź wydatki, dochody i zyski ze sprzedaży samochodów.",
  },
  sv: {
    // Header
    carInventory: "Bilinventering",
    vehiclesInFleet: "fordon i din flotta",
    searchVehicles: "Sök fordon...",
    filter: "Filter",
    available: "Tillgänglig",
    sold: "Såld",
    pending: "Väntande",

    // Car List
    addCar: "Lägg till Bil",
    totalExpenses: "Totala Utgifter",

    // Expense Detail
    financialOverview: "Finansiell Översikt",
    totalIncome: "Total Inkomst",
    netAmount: "Nettobelopp",
    allTransactions: "Alla Transaktioner",
    income: "Inkomst",
    expenses: "Utgifter",
    sellVehicle: "Sälj Fordon",

    // Categories
    purchase: "Köp",
    repair: "Reparation",
    maintenance: "Underhåll",
    service: "Service",
    partsSale: "Delförsäljning",
    accessories: "Tillbehör",

    // Sale Modal
    saleCompleted: "Försäljning Slutförd!",
    transactionProcessed: "Transaktion framgångsrikt behandlad",
    salePrice: "Försäljningspris",
    margin: "Marginal",
    financialBreakdown: "Finansiell Uppdelning",
    partnershipSplit: "Partnerskapsdelning",
    yourShare: "Din Andel",
    partnerShare: "Partners Andel",
    profit: "Vinst",
    continue: "Fortsätt",
    vehicleSoldSuccessfully: "Fordon Framgångsrikt Sålt!",

    // Settings
    settings: "Inställningar",
    language: "Språk",
    notifications: "Notifikationer",
    enableNotifications: "Aktivera Notifikationer",
    darkMode: "Mörkt Läge",
    enableDarkMode: "Aktivera Mörkt Läge",
    dataExport: "Dataexport",
    exportToPDF: "Exportera till PDF",
    exportToExcel: "Exportera till Excel",
    exportPDFMessage: "PDF-exportfunktion kommer snart att vara tillgänglig!",
    exportExcelMessage: "Excel-exportfunktion kommer snart att vara tillgänglig!",
    about: "Om",
    version: "Version 1.0.0",
    save: "Spara",
    cancel: "Avbryt",
    userInfo: "Användarinformation",
    partnerNames: "Partnernamn",
    yourName: "Ditt Namn",
    partnerName: "Partners Namn",
    yourNamePlaceholder: "Jag",
    partnerNamePlaceholder: "Partner",
    account: "Konto",
    logout: "Logga ut",

    // Add Car Modal
    addNewCar: "Lägg till Ny Bil",
    carMake: "Bilmärke",
    carModel: "Bilmodell",
    year: "År",
    purchasePrice: "Inköpspris",
    mileage: "Mätarställning",
    condition: "Skick",
    notes: "Anteckningar",
    excellent: "Utmärkt",
    good: "Bra",
    fair: "Godtagbar",
    additionalInfo: "Ytterligare information",

    // Add Expense Modal
    addExpense: "Lägg till Utgift",
    description: "Beskrivning",
    amount: "Belopp",
    category: "Kategori",
    date: "Datum",
    type: "Typ",
    expense: "Utgift",
    selectCategory: "Välj Kategori",
    selectType: "Välj Typ",

    // Common
    close: "Stäng",
    add: "Lägg till",
    edit: "Redigera",
    delete: "Ta bort",
    confirm: "Bekräfta",
    success: "Framgång",
    error: "Fel",

    // New keys
    paidBy: "Betald Av",
    you: "Du",
    partner: "Partner",
    selectPayer: "Välj vem som betalade",
    reminder: "Påminnelse",
    sellReminderText: "Varje partner får tillbaka sina utgifter, och den återstående vinsten delas 50/50.",

    // Settings categories
    general: "Allmänt",
    account: "Konto",
    appearance: "Utseende",
    garage: "Garage",
    data: "Data",

    // Settings content
    generalSettings: "Allmänna inställningar",
    enterYourName: "Ange ditt namn",
    enterPartnerName: "Ange partnerns namn",
    receiveNotifications: "Få meddelanden om viktiga händelser",
    accountInfo: "Kontoinformation",
    emailAddress: "E-postadress",
    logoutAccount: "Logga ut från kontot",
    interfaceLanguage: "Gränssnittsspråk",
    selectLanguageDescription: "Välj språk för visning av applikationsgränssnittet",
    autoDetect: "Autodetektering",
    detectedByBrowser: "Detekteras av webbläsarinställningar",
    current: "Nuvarande",
    useDarkTheme: "Använd mörkt gränssnittstema",
    garageSettings: "Garageinställningar",
    currentGarage: "Nuvarande garage",
    manageMembers: "Hantera medlemmar",
    selectGarageFirst: "Välj en garage först",
    exportDescription: "Exportera dina data i olika format",
    appDescription:
      "Applikation för att hantera bilföretags ekonomi. Spåra utgifter, intäkter och vinster från bilförsäljning.",
  },
}

// Function to detect browser language
export const detectBrowserLanguage = (): Language => {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language || navigator.languages?.[0] || "en"
  const langCode = browserLang.split("-")[0].toLowerCase()

  // Map browser language codes to our supported languages
  const languageMap: Record<string, Language> = {
    en: "en",
    ru: "ru",
    fr: "fr",
    de: "de",
    nl: "nl",
    es: "es",
    it: "it",
    uk: "uk",
    ka: "ka",
    tr: "tr",
    hy: "hy",
    pl: "pl",
    sv: "sv",
  }

  return languageMap[langCode] || "en"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("car-finance-language") as Language
    const hasVisited = localStorage.getItem("car-finance-has-visited")

    if (!hasVisited) {
      // First visit - detect browser language automatically
      const detectedLanguage = detectBrowserLanguage()
      setLanguageState(detectedLanguage)
      setIsFirstVisit(true)
      localStorage.setItem("car-finance-language", detectedLanguage)
      localStorage.setItem("car-finance-has-visited", "true")
      // Don't set auto-language flag on first visit - user gets detected language but can change it
    } else if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      // Returning user - use saved language (user's choice is remembered)
      setLanguageState(savedLanguage)
      setIsFirstVisit(false)
    } else {
      // Fallback to English
      setLanguageState("en")
      setIsFirstVisit(false)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("car-finance-language", lang)
    setIsFirstVisit(false)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isFirstVisit }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
