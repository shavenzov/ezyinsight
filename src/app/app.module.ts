import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {CardComponent} from './components/card-grid/card/card.component';
import {StreamTitleComponent} from './components/card-grid/card/stream-title/stream-title.component';
import {CardGridComponent} from './components/card-grid/card-grid.component';
import {FiltersButtonComponent} from './components/toolbar/filters-button/filters-button.component';
import {MyAccordionModule} from './my-ui-kit/accordion/accordion.module';
import {MySliderModule} from './my-ui-kit/slider/slider.module';
import { NumCardsChooserComponent } from './components/toolbar/num-cards-chooser/num-cards-chooser.component';
import { RefreshIntervalChooserComponent } from './components/toolbar/refresh-interval-chooser/refresh-interval-chooser.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    CardComponent,
    StreamTitleComponent,
    CardGridComponent,
    FiltersButtonComponent,
    NumCardsChooserComponent,
    RefreshIntervalChooserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MyAccordionModule,
    MySliderModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
