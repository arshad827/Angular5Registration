import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClient, HttpHeaders, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule } from '..//..//node_modules/ng2-charts/ng2-charts';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  MatSidenavModule,
  MatSelectModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatRadioModule,
} from '@angular/material';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,


} from 'angular5-social-login';
import { LinkedInSdkModule } from 'angular-linkedin-sdk';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { SearchComponent } from './search/search.component';
import { ApiInterceptor } from './api.interceptor';
import { AuthGaurdService } from './auth-gaurd.service';
import { AngualrMaterialModule } from './angualr-material/angualr-material.module';
import { SearchResultsComponent } from './search-results/search-results.component';
import { AuthUserComponent } from './auth-user/auth-user.component';
import { ChatComponent } from './chat/chat.component';
import { ChatService } from './chat.service';
import { UserDetailsService } from './services/user-details.service';
import { SearchService } from './search/search.service';
import { BtAuthService } from './bt-auth.service';
import { PreLaunchComponent } from './pre-launch/pre-launch.component';
import { ExploreDecisionComponent } from './pre-launch/explore-decision/explore-decision.component';
import { SocialLoginComponent } from './pre-launch/social-login/social-login.component';
import { BtHeaderComponent } from './pre-launch/bt-header/bt-header.component';
import { BtRegisterComponent } from './pre-launch/bt-register/bt-register.component';
import { RouteGaurdService } from './pre-launch/route-gaurd.service';
import { ChooseMentorComponent } from './pre-launch/choose-mentor/choose-mentor.component';
import { MailComponent } from './pre-launch/mail/mail.component';
import { CongratulationsComponent } from './pre-launch/congratulations/congratulations.component';
import { LogInComponent } from './log-in/log-in.component';
import { BtAdminPanelComponent } from './bt-admin-panel/bt-admin-panel.component';
import { HeaderComponent } from './bt-admin-panel/header/header.component';
import { FooterComponent } from './bt-admin-panel/footer/footer.component';
import { SidebarComponent } from './bt-admin-panel/sidebar/sidebar.component';
import { ContentComponent } from './bt-admin-panel/content/content.component';

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1911181972538871')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('606080540130-235d878p8qkggg7ojrno1n9mb4noqe15.apps.googleusercontent.com')
      }
    ]
  );
  return config;
}

const httpInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiInterceptor,
  multi: true
};
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultsComponent,
    AuthUserComponent,
    ChatComponent,
    PreLaunchComponent,
    ExploreDecisionComponent,
    SocialLoginComponent,
    BtHeaderComponent,
    BtRegisterComponent,
    ChooseMentorComponent,
    MailComponent,
    CongratulationsComponent,
    LogInComponent,
    BtAdminPanelComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,

  ],
  imports: [
    NgxChartsModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    NgProgressModule,
    AppRoutingModule,
    AngualrMaterialModule,
    ReactiveFormsModule,
    SocialLoginModule,
    LinkedInSdkModule,
    MatSelectModule,
    MatSidenavModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    { provide: 'apiKey', useValue: '81fl7lzxies0uk' },
    { provide: 'authorize', useValue: 'true' }, // OPTIONAL by default: false
    { provide: 'isServer', useValue: 'true' },  // OPTIONAL by default: false
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    BtAuthService,
    AuthGaurdService,
    RouteGaurdService,
    httpInterceptor,
    ChatService,
    UserDetailsService,
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
