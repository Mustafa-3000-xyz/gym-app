export const styleDate = "yyyy/MM/dd";
export const maxSessions = 60;
export const maxSubscriptionPrice = 999999;

// These for subscription state
export const stateIsActive = "active";
export const stateIsPending = "pending";
export const stateIsFinished = "finished";

// These for filter
export const fromOldToNew = "fromOldToNew";
export const fromNewToOld = "fromNewToOld";
export const allSubscriptions = "allSubscriptions";
export const activeSubscriptions = "activeSubscriptions";
export const pendingSubscriptions = "pendingSubscriptions";
export const finishedSubscriptions = "finishedSubscriptions";


// These pages paths
export const trainerPagePath = "/trainers-page";
export const attendanceRecordePagePath = "/attendance-recorde-page";
export const subscriptionsMenuPath = "/subscriptions-menu";
export const accountesPagePath = "/accountes-page";
export const profilePagePath = "/profile-page/:accountId";
export const profitsAndExpensesPagePath = "/profits-and-expenses-page";
export const settingsPagePath = "/settings-page";
export const expalinAppPagePath = "/explain-app-page";


// Permissions
export const USING_ACTIVE_SOME_SESSIONS = "USING_ACTIVE_SOME_SESSIONS";
export const REMOVE_TRAINERS = "REMOVE_TRAINERS";
export const WITHDRAW_SUBSCRIPTION = "WITHDRAW_SUBSCRIPTION";
export const RENEWAL_SUBSCRIPTION = "RENEWAL_SUBSCRIPTION";
export const ADD_NEW_SUBSCRIPTION_MENU = "ADD_NEW_SUBSCRIPTION_MENU";
export const EDITING_SUBSCRIPTION_MENU = "EDITING_SUBSCRIPTION_MENU";
export const CREATE_NEW_ACCOUNTS = "CREATE_NEW_ACCOUNTS";


// All permissions
export const allPermissions = [
    {
        title: "صفحة المتدربين",
        key: trainerPagePath
    },
    {
        title: "صفحة سجل الحضور",
        key: attendanceRecordePagePath
    },
    {
        title: "صفحة قائمة الاشتراكات",
        key: subscriptionsMenuPath
    },
    {
        title: "صفحة الحسابات",
        key: accountesPagePath
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
        title: "استخدام ميزة تفعيل بعض الحصص",
        key: USING_ACTIVE_SOME_SESSIONS
    },
    {
        title: "حذف المتدربين",
        key: REMOVE_TRAINERS
    },
    {
        title: "سحب اشتراكات المتدربين",
        key: WITHDRAW_SUBSCRIPTION
    },
    {
        title: "تجديد اشتراك المتدربين",
        key: RENEWAL_SUBSCRIPTION
    },
    {
        title: "إضافة قوائم اشتراكات جديده",
        key: ADD_NEW_SUBSCRIPTION_MENU
    },
    {
        title: "تعديل على قوائم الاشتراكات",
        key: EDITING_SUBSCRIPTION_MENU
    },
    {
        title: "إنشاء حسابات جديده",
        key: CREATE_NEW_ACCOUNTS
    }
];