import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSubmissionResponse, PolicyRecord } from '../models/policy.model';

@Injectable({ providedIn: 'root' })
export class PolicyApiService {
  // Mock endpoint from the challenge prompt.
  private readonly endpoint = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private readonly http: HttpClient) {}

  submitPolicies(policies: PolicyRecord[]): Observable<ApiSubmissionResponse> {
    // Keep HTTP details out of component logic.
    return this.http.post<ApiSubmissionResponse>(this.endpoint, policies);
  }
}
