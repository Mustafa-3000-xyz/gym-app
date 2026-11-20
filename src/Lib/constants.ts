export const styleDate = "yyyy/MM/dd";

// Maxes
export const maxSessions = 60;
export const maxSubscriptionPrice = 999999;
export const maxForCreateItems = 24;

// These for subscription status
export const statusIsActive = "active";
export const statusIsPending = "pending";
export const statusIsFinished = "finished";

// These for filter
export const fromOldToNew = "fromOldToNew";
export const fromNewToOld = "fromNewToOld";
export const allTrainers = "allTrainers";
export const women = "women";
export const men = "men";
export const allSubscriptions = "allSubscriptions";
export const activeSubscriptions = "activeSubscriptions";
export const pendingSubscriptions = "pendingSubscriptions";
export const finishedSubscriptions = "finishedSubscriptions";

// These pages paths
export const trainerPagePath = "/trainers-page";
export const attendanceRecordePagePath = "/attendance-recorde-page";
export const subscriptionsMenuPath = "/subscriptions-menu";
export const accountesPagePath = "/accounts-page";
export const profilePagePath = "/profile-page/:accountId";
export const profitsAndExpensesPagePath = "/profits-and-expenses-page";
export const settingsPagePath = "/settings-page";
export const logInPagePath = "/log-in-page";
export const addTrainerPagePath = "/add-trainer";
export const trainerDetailsPagePath = "/trainer-details-page/:trainerId";
export const preferencesPagePath = "/preferences-page";
export const anotherSettingsPagePath = "/another-settings-page";
export const reportsPagePath = "/reports-page";


// Permissions
export const REMOVE_TRAINERS = "REMOVE_TRAINERS";
export const CANCEL_SUBSCRIPTION = "CANCEL_SUBSCRIPTION";
export const RENEWAL_SUBSCRIPTION = "RENEWAL_SUBSCRIPTION";
export const CREATE_NEW_ACCOUNTS = "CREATE_NEW_ACCOUNTS";


// All permissions
export const allPermissions = [
    {
        title: "صفحة قوائم الإشتراكات",
        key: subscriptionsMenuPath
    },
    {
        title: "صفحة الارباح والمصروفات",
        key: profitsAndExpensesPagePath
    },
    {
        title: "صفحة الاعدادات",
        key: settingsPagePath
    },
    {
        title: "حذف المتدربين",
        key: REMOVE_TRAINERS
    },
    {
        title: "الغاء الإشتراكات",
        key: CANCEL_SUBSCRIPTION
    },
    {
        title: "تجديد الإشتراكات",
        key: RENEWAL_SUBSCRIPTION
    },
    {
        title: "إنشاء حسابات جديده",
        key: CREATE_NEW_ACCOUNTS
    }
];

export const listOfMonthes = [
    {
        monthNumber: 1,
        month: "يناير",
        days: 31
    },
    {
        monthNumber: 2,
        month: "فبراير",
        days: new Date(new Date().getFullYear(), 2, 0).getDate()
    },
    {
        monthNumber: 3,
        month: "مارس",
        days: 31
    },
    {
        monthNumber: 4,
        month: "ابريل",
        days: 30
    },
    {
        monthNumber: 5,
        month: "مايو",
        days: 31
    },
    {
        monthNumber: 6,
        month: "يونيو",
        days: 30
    },
    {
        monthNumber: 7,
        month: "يوليو",
        days: 31
    },
    {
        monthNumber: 8,
        month: "اغسطس",
        days: 31
    },
    {
        monthNumber: 9,
        month: "سبتمبر",
        days: 30
    },
    {
        monthNumber: 10,
        month: "اكتوبر",
        days: 31
    },
    {
        monthNumber: 11,
        month: "نوفمبر",
        days: 30
    },
    {
        monthNumber: 12,
        month: "ديسمبر",
        days: 31
    }
];