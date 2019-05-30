import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {CardComponent} from './components/card/card.component';
import {StreamTitleComponent} from './components/stream-title/stream-title.component';
import {CardGridComponent} from './components/card-grid/card-grid.component';
import {FiltersButtonComponent} from './components/filters-button/filters-button.component';
import {MyAccordionModule} from './my-ui-kit/accordion/accordion.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    CardComponent,
    StreamTitleComponent,
    CardGridComponent,
    FiltersButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MyAccordionModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
