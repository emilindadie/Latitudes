import { Pipe, PipeTransform } from '@angular/core';
import { Action } from '../model/action.model';

@Pipe({
    name: 'actionFilter',
    pure: false
})
export class ActionPipe implements PipeTransform {
    transform(actions: Action[], actionFilter: ActionFilter): Action[] {
        if(actions){
            return actions
                .filter(e => e.name? e.name.toLocaleLowerCase().includes(actionFilter.searchText.toLocaleLowerCase()) : null)
        } 
        return actions;
    }
}

export interface ActionFilter {
    searchText: string;
}