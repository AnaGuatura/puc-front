export interface User {
    id: string;
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
    id?: string;
    area: Area;
    name: string;
    other?: string;
}

export interface Skill {
    user: string;
    technology: Technology;
    price?: number | null;
    experience_time?: number | null;
}

export interface Skills {
    user: string;
    technology?: string;
    price?: number | null;
    experience_time?: number | null;
}

export interface Payment {
    user: string;
    payment: string;
}

export interface Area {
    id: string;
    name: string;
}

export interface EventInfo {
    name: string;
    color: string;
    start: string;
    end: string;
}

export interface ScheduleInfo {
    date: string;
    start: string;
    end: string;
}

export interface Mentoring {
    id: string;
    name: string;
    mentor: string;
    student: string;
    dt_initial: Date;
    dt_final: Date;
    invitation_text: string;
    decline_text: string;
    status: string;
}

export interface Feedback {
    id: string;
    mentor: string;
    student: string;
    dt_create: string;
    feedback_text: string;
    rating: number;
    status: string;
    user: string;
}

