import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EzyStoriesResultModel, EzyStoryModel} from './models/story.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class EzyinsightService {

  private readonly storiesEndpoint = 'filter/17887/public/stories';

  constructor(
    private http: HttpClient
  ) {}

  getStories( limit: number ): Observable<EzyStoryModel[]> {
    return this.http.get<EzyStoriesResultModel>( `${environment.root}${this.storiesEndpoint}?limit=${limit}` ).pipe(
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
