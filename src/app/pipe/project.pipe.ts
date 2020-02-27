import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../model/projet.model';

@Pipe({
    name: 'projectFilter',
    pure: false
})
export class ProjectPipe implements PipeTransform {
    transform(projects: Project[], projectFilter: ProjectFilter): Project[] {
        if(projects){
            return projects
                .filter(e => e.name? e.name.toLocaleLowerCase().includes(projectFilter.searchText.toLocaleLowerCase()) : null)
                .filter(e => projectFilter.skills.every((skill: string) => e.skills? e.skills.includes(skill): null))
        } 
        return projects;
    }
}

export interface ProjectFilter {
    searchText: string;
    skills: string[];
}