import {Component, OnInit} from '@angular/core';
import {EzyinsightService} from './services/ezyinsight.service';
import {Observable} from 'rxjs';
import {EzyStoryModel} from './services/models/story.model';

@Component({
  selector: 'ezy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  stories: Observable<EzyStoryModel[]>;

  constructor(
    private ezyServise: EzyinsightService
  ) {}

  ngOnInit(): void {
    this.stories = this.ezyServise.getStories( 30 );
  }
}
