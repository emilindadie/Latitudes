export interface Action {
    id: string;
    title: string;
    name: string;
    type: string;
    startDate: string;
    year: string;
    registeredDate: Date;
    projects: string[];
}