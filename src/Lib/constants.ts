import { createClient } from '@supabase/supabase-js'
// ========================================================== //
export const styleDate = "yyyy/MM/dd";

// Maxes
export const maxSessions = 60;
export const maxSubscriptionPrice = 999999;
export const maxTargetInYear = 2700000;
export const maxTargetInMonth = maxTargetInYear / 12;
export const maxTargetInDay = maxTargetInMonth / 30;
export const maxPriceInOneItem = 9999999;
export const maxForCreateItems = 24;

// These for profits and expenses page
export const addNewTrainer = "إضافة متدرب";
export const withDrawSubscription = "سحب اشتراك";
export const renewalSubscription = "تجديد اشتراك";

// These for subscription status
export const statusIsActive = "active";
export const statusIsPending = "pending";
export const statusIsFinished = "finished";

// These for filter
export const fromOldToNew = "fromOldToNew";
export const fromNewToOld = "fromNewToOld";
export const allTrainers = "allTrainers";
export const allMens = "allMens";
export const allWomens = "allWomens";
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
export const authenticationPagePath = "/authentication-page";
export const errorInAppPagePath = "/error-in-app-page";
export const tryOrBuyAppPagePath = "/try-or-buy-app-page";
export const stepsForBuyAppPage = "steps-for-buy-app-page";

// Permissions
export const USING_ACTIVE_SOME_SESSIONS = "USING_ACTIVE_SOME_SESSIONS";
export const REMOVE_TRAINERS = "REMOVE_TRAINERS";
export const WITHDRAW_SUBSCRIPTION = "WITHDRAW_SUBSCRIPTION";
export const CANCEL_SUBSCRIPTION = "CANCEL_SUBSCRIPTION";
export const RENEWAL_SUBSCRIPTION = "RENEWAL_SUBSCRIPTION";
export const ADD_NEW_SUBSCRIPTION_MENU = "ADD_NEW_SUBSCRIPTION_MENU";
export const EDITING_SUBSCRIPTION_MENU = "EDITING_SUBSCRIPTION_MENU";
export const CREATE_NEW_ACCOUNTS = "CREATE_NEW_ACCOUNTS";
export const CHANGE_ACCOUNT_COLOR = "CHANGE_ACCOUNT_COLOR";

export const supabase = createClient('https://alqlzackgkgirrtxdzku.supabase.co', "sb_publishable_4bG9Qerp318eML_BRvNtsQ_u7BB0l7D")


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
        title: "الغاء اشتراكات المتدربين",
        key: CANCEL_SUBSCRIPTION
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
    },
    {
        title: "تغير لون الحساب",
        key: CHANGE_ACCOUNT_COLOR
    }
];

export const monthsWithHisDays = [
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