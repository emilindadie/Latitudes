import { Skill } from "../model/skill.model";

export interface Mentor {
    firstname: string;
    lastname: string;
    email: string;
    fullName: string;
    registeredDate: Date;
    skills?: Skill[];
}