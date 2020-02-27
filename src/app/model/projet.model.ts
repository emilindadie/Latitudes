import {Subscription, BehaviorSubject } from 'rxjs';

export interface Project {
    id: string;
    name: string;
    smallDescription: string;
    largeDescription: string;
    skills?: string[];
    inscription: string[];
}