import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { AuthGaurdService } from './auth-gaurd.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { AuthUserComponent } from './auth-user/auth-user.component';
import { ChatComponent } from './chat/chat.component';
import { PreLaunchComponent } from './pre-launch/pre-launch.component';
import { ExploreDecisionComponent } from './pre-launch/explore-decision/explore-decision.component';
import { SocialLoginComponent } from './pre-launch/social-login/social-login.component';
import { BtRegisterComponent } from './pre-launch/bt-register/bt-register.component';
import { RouteGaurdService } from './pre-launch/route-gaurd.service';
import { ChooseMentorComponent } from './pre-launch/choose-mentor/choose-mentor.component';
import { MailComponent } from './pre-launch/mail/mail.component';
import { CongratulationsComponent } from './pre-launch/congratulations/congratulations.component';
import { LogInComponent } from './log-in/log-in.component';
import { BtAdminPanelComponent } from './bt-admin-panel/bt-admin-panel.component';
import { ContentComponent } from './bt-admin-panel/content/content.component';
const routes: Routes = [
  { path: '', component: LogInComponent, pathMatch: 'full' },
  {
    path: 'dashboard', component: BtAdminPanelComponent, children: [{
      path: 'androidDetails', component: ContentComponent
    }]
  },
  { path: 'social', component: SocialLoginComponent },
  { path: 'register', component: BtRegisterComponent, canActivate: [RouteGaurdService] },
  { path: 'chooseMentor', component: ChooseMentorComponent },
  { path: 'confirmation', component: CongratulationsComponent },
  { path: 'mail', component: MailComponent },
  { path: 'auth', component: AuthUserComponent },
  { path: 'test', component: SearchComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGaurdService] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
