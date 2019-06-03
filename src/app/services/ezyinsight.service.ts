import { Injectable } from '@angular/core';
import {Observable, Subject, timer} from 'rxjs';
import {EzyStoriesResultModel, EzyStoryModel} from './models/story.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class EzyinsightService {

  private readonly root = '//app.ezyinsights.com/api/';
  private readonly storiesEndpoint = 'filter/17887/public/stories';

  constructor(
    private http: HttpClient
  ) {}

  getStories( limit: number ): Observable<EzyStoryModel[]> {
    return this.http.get<EzyStoriesResultModel>( `${this.root}${this.storiesEndpoint}?limit=${limit}` ).pipe(
      map( data => data.result.map(
        story => {
          const source = story.sources[0];

          return {
            pictureUrl: source.picture_url,
            streamLogoUrl: source.stream_logo_url,
            streamName: source.stream_name,
            headline: source.headline,
            description: source.description
          };
        }
      ) )
    );
  }

}
