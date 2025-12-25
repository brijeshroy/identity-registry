export enum UserCategory {
    CUSTOMER = 'cust',
    ADMIN = 'admin',
    PAYMENT = 'pymnt',
    COLLECTION = 'colcn',
    NIGHTLY = 'nightly',
    BILLING = 'billing'
};

export type UserCategoryKey = keyof typeof UserCategory;
export const USER_CATEGORY_KEYS = Object.keys(UserCategory) as UserCategoryKey[];