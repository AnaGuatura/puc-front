export interface User {
    name: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    role: string;
    about_user_description: string;
    experiences_description: string;
}

export interface Credentials {
    email: string;
    password: string;
}