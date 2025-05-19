import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule } from '@angular/router'; 

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      HttpClientModule, 
      RouterModule.forRoot([]) 
    )
  ]
}).catch(err => console.error(err));