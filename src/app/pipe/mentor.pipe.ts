import { PipeTransform, Pipe } from '@angular/core';
import { Mentor } from '../model/mentor.model';
import { Skill } from '../model/skill.model';

@Pipe({
    name: 'mentorFilter',
    pure: false
})
export class MentorPipe implements PipeTransform {
    transform(mentors: Mentor[], mentorFilter: MentorFilter): Mentor[] {
        if(mentors){
            return mentors
                .filter(e => e.fullName.toLocaleLowerCase().includes(mentorFilter.searchText.toLocaleLowerCase()))
                .filter(e => mentorFilter.skills.every((skill:Skill) => e.skills.includes(skill)))
        } 
        return mentors;
    }
}

export interface MentorFilter {
    searchText: string;
    skills: Skill[];
}