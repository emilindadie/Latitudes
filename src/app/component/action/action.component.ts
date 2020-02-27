import { Component, OnInit } from '@angular/core';
import { Subscription, BehaviorSubject} from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Action } from 'src/app/model/action.model';
import { ActionFilter } from 'src/app/pipe/action.pipe';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {

  watcher: Subscription;
  activeMediaQuery = '';
  gridCols : BehaviorSubject<number> = new BehaviorSubject<number>(4);
  selectedRadio = 'coming';
  loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  actionFilter:ActionFilter;
  actions: Action[];

  constructor(private apiService: ApiService, mediaObserver: MediaObserver, private router: Router, private dataService : DataService) { 
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if ( change.mqAlias == 'xs') {
          this.gridCols.next(1);
      } else if(change.mqAlias == 'sm'){
        this.gridCols.next(2);
      } else {
        this.gridCols.next(4);
      }
    });
  }

  ngOnInit(): void {  
    this.actionFilter = {
      searchText : '' , 
    };
    this.apiService
      .getActions(this.selectedRadio)
      .subscribe(actions => {
        this.loading.next(false);
        this.actions = actions;
      });
  }

  goToProjectPage(action: Action){
    this.dataService.changePorjects(action.projects);
    this.router.navigateByUrl(`/project/${action.id}`);
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
    this.gridCols.unsubscribe();
  }

  radioChange(event: any) {
    this.selectedRadio = event.value;
    this.apiService
    .getActions(this.selectedRadio)
    .subscribe(actions => {
      this.actions = actions
    });
  }
}
