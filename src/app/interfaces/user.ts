export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    has_password?: boolean;
    photo?: string;
    lang?: string;
    groups?: string[]
}
export interface Group {
    id: number;
    name: string;
}
