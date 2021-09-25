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

export interface Technology {
    id: string;
    area: string;
    name: string;
}

export interface Skill {
    user: string;
    technology: Technology;
    price?: number | null;
    experience_time?: number | null;
}