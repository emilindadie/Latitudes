import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, of, BehaviorSubject } from 'rxjs';
import { Mentor } from '../model/mentor.model';
import { map } from 'rxjs/operators';
import { Action } from '../model/action.model';
import { Project } from '../model/projet.model';
import * as _ from 'lodash';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class ApiService {
    private action_path = "/Actions";
    private individus_path = "/Individus";
    private inscription_path = "/Inscriptions et retours";
    private projets_path = "/Projets";
    
    constructor(private httpClient: HttpClient){}

    getAllIndividus() : Observable<Mentor[]> {
    return this
        .httpClient
        .get<Mentor[]>(`${environment.baseUrl}${this.individus_path}?maxRecords=200`)
        .pipe(
            map((response: any) => {
                return response['records'].map( 
                    (record: any) => {
                        let skills = record['fields']['++Compétences'];
                        if(skills === undefined){
                            skills = [];
                        }
                        let mentor : Mentor = {
                            firstname: record['fields']['!Prénom'],
                            lastname: record['fields']['!Nom'],
                            email: record['fields']['!Email'],
                            fullName: record['fields']['Name'],
                            skills: skills,
                            registeredDate: record['createdTime'],
                        };
                        return mentor;
                    }
                )
            })
        );
    }

    getActions(type: string) : Observable<Action[]> {
        if(type == 'coming'){
            return this
            .httpClient
            .get<Action[]>(`${environment.baseUrl}${this.action_path}?filterByFormula=IS_AFTER({Date de début}, TODAY())`)
            .pipe(
                map((response: any) => {
                    return response['records'].map( 
                        (record: any) => {
                            let action : Action = {
                                id: record['id'],
                                title: record['fields']["Titre de l'action"],
                                name: record['fields']["Name"],
                                type: record['fields']["Type d'action"],
                                startDate: record['fields']['Date de début'],
                                projects: record['fields']["Projets associés"],
                                year: record['fields']["Année"],
                                registeredDate: record["createdTime"],
                            };
                            return action;
                        }
                    )
                })
            );
        } 
        return this
        .httpClient
        .get<Action[]>(`${environment.baseUrl}${this.action_path}`)
        .pipe(
            map((response: any) => {
                return response['records'].map( 
                    (record: any) => {
                        let action : Action = {
                            id: record['id'],
                            title: record['fields']["Titre de l'action"],
                            name: record['fields']["Name"],
                            type: record['fields']["Type d'action"],
                            startDate: record['fields']['Date de début'],
                            projects: record['fields']["Projets associés"],
                            year: record['fields']["Année"],
                            registeredDate: record["createdTime"],
                        };
                        return action;
                    }
                )
            })
        );
    }

    getActionById(id: string) : Observable<Action>{
        return this.httpClient.get<Project>(`${environment.baseUrl}${this.action_path}/${id}`).pipe(map((response: any) => {
            let action : Action = {
                id: response['id'],
                title: response['fields']["Titre de l'action"],
                name: response['fields']["Name"],
                type: response['fields']["Type d'action"],
                startDate: response['fields']['Date de début'],
                projects: response['fields']["Projets associés"],
                year: response['fields']["Année"],
                registeredDate: response["createdTime"],
            };
            return action;
        }));
    }

    getProjectById(projectsID : string[]) : Observable<Project[]> {
                let projectArray =  projectsID.map(( id ) => {
                return this.httpClient.get<Project>(`${environment.baseUrl}${this.projets_path}/${id}`).pipe(map((response: any) => {
                    let project : Project = {
                        id: response["id"],
                        name: response['fields']["Name"],
                        smallDescription: response['fields']["+Description courte"],
                        largeDescription: response['fields']["+Description longue"],
                        skills: response['fields']["+Expertises"],
                        inscription: response['fields']["@inscription"],
                    };
                    return project;
                }));
            });
        return combineLatest(projectArray);
    }
}