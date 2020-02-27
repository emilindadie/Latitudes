import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Mentor } from '../../model/mentor.model';
import { Skill } from '../../model/skill.model';
import { MentorFilter } from '../../pipe/mentor.pipe';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject} from 'rxjs';
import {MatAutocomplete} from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.scss']
})
export class MentorComponent implements OnInit {

  watcher: Subscription;
  activeMediaQuery = '';
  gridCols : BehaviorSubject<number> = new BehaviorSubject<number>(4);
  chipsListPlaceHolder : BehaviorSubject<string> = new BehaviorSubject<string>("New Skills...");
  loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  mentorFilter:MentorFilter;
  mentors: Mentor[];
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

  constructor(private apiService: ApiService, mediaObserver: MediaObserver) { 
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
      Skill.OTHERS
    ];
    this.mentorFilter = {
      searchText : '' , 
      skills: []
    };
    this.apiService
      .getAllIndividus()
      .subscribe(mentors => {
        this.loading.next(false);
        this.mentors = mentors;
      });
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
    this.mentorFilter.skills.splice(this.mentorFilter.skills.indexOf(skills),1);
  }

  selected(event: any): void {
    this.mentorFilter.skills.push(event.option.viewValue);
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
  }
}
