import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {AppComponent} from './app.component'
import {HeaderComponent} from './structure/header-component'
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
    declarations: [
      AppComponent,
      HeaderComponent
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {
  constructor(){
    console.log('App Module');
  }
}
