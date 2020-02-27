import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MentorComponent } from './component/mentor/mentor.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"; 
import { MentorPipe } from './pipe/mentor.pipe';
import { FormsModule } from "@angular/forms";
import { AuthInterceptor } from './interceptor/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeaderComponent } from './component/header/header.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { ActionComponent } from './component/action/action.component';
import { ApiService } from './service/api.service';
import { ActionPipe } from './pipe/action.pipe';
import { ProjectComponent } from './component/project/project.component';
import { ProjectPipe } from './pipe/project.pipe';
import {MatRadioModule} from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MentorComponent,
    MentorPipe,
    ActionComponent,
    ActionPipe,
    ProjectComponent,
    ProjectPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatChipsModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,    
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,   
  ],
  providers: [ApiService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
