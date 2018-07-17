import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatCardModule, MatNativeDateModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatTabsModule,
    MatCardModule, MatNativeDateModule, MatRadioModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatTabsModule,
    MatCardModule, MatNativeDateModule, MatRadioModule
  ]
})
export class AngualrMaterialModule { }
