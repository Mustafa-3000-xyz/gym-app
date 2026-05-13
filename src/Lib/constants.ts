export const styleDate = "yyyy/MM/dd";

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
        key: USING_ACTIVE_SOME_SESSIONS,
    }
];