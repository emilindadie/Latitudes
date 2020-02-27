import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Skill } from '../../model/skill.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject, forkJoin, zip, of} from 'rxjs';
import {MatAutocomplete} from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { ApiService } from 'src/app/service/api.service';
import { Project } from 'src/app/model/projet.model';
import { ProjectFilter } from 'src/app/pipe/project.pipe';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  watcher: Subscription;
  activeMediaQuery = '';
  gridCols : BehaviorSubject<number> = new BehaviorSubject<number>(4);
  chipsListPlaceHolder : BehaviorSubject<string> = new BehaviorSubject<string>("New Skills...");
  loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  emptyData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  projectFilter:ProjectFilter;
  projects: Project[];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillsCtrl = new FormControl();
  selectSkillsList: Observable<Skill[]>;
  selectedSkillsList: Skill[]; 
  filteredSkillsList: Skill[]; 
  @ViewChild('skillsInput') skillsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public apiService: ApiService, mediaObserver: MediaObserver, private activatedRoute: ActivatedRoute, private dataService : DataService) { 
    this.selectSkillsList = this.skillsCtrl.valueChanges.pipe(
      startWith(null),
      map((skills: string | null) => skills ? this._filter(skills) : this.filteredSkillsList.slice()));
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

    this.activatedRoute.params.subscribe(params => {
      let id = params['id']; 

      this.apiService.getActionById(id).subscribe(res => {
        if(res.projects){
          this.apiService.getProjectById(res.projects).subscribe(res => {
            this.loading.next(false);
            this.projects = res;
          });
        } else {
          this.loading.next(false);
          this.emptyData.next(true);
        }
      });
    });
  
    this.selectedSkillsList = [];
    this.filteredSkillsList = [
      Skill.BACK_END,
      Skill.FRONT_END,
      Skill.MOBILE,
      Skill.DATA,
      Skill.DATA_SCIENCES,
      Skill.ESS,
      Skill.INVEST,
      Skill.BLOCKCHAIN,
      Skill.DEVOPS,
      Skill.DEEP_LEARNING,
      Skill.PRODUCT_OWNER,
      Skill.UX_UI,
      Skill.ENTREPRENARIAT,
      Skill.UNKNOW,
      Skill.OTHERS,
    ];
    this.projectFilter = {
      searchText : '' , 
      skills: []
    };

  }

  add(event: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.selectedSkillsList.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
    this.skillsCtrl.setValue(null);
  }

  remove(skills: Skill): void {
    const index = this.selectedSkillsList.indexOf(skills);
    if (index >= 0) {
      this.selectedSkillsList.splice(index, 1);
    }
    this.filteredSkillsList.push(skills)
    this.skillsCtrl.setValue(null);
    this.projectFilter.skills.splice(this.projectFilter.skills.indexOf(skills),1);
  }

  selected(event: any): void {
    this.projectFilter.skills.push(event.option.viewValue);
    this.selectSkillsList.pipe().source
    this.selectedSkillsList.push(event.option.viewValue);
    this.skillsInput.nativeElement.value = '';
    this.skillsCtrl.setValue(null);
  }

  private _filter(skills: string): Skill[] {
    this.filteredSkillsList = this.filteredSkillsList.filter(value => value.toLocaleLowerCase() !== skills.toLocaleLowerCase());
    return this.filteredSkillsList;
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
    this.gridCols.unsubscribe();
  }
}
