import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable, map, catchError, of } from 'rxjs';

export interface Article {
  name: string;
  title: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private articlesCache: Article[] | null = null;

  private getBaseHref(): string {
    const baseTag = this.document.querySelector('base');
    const href = baseTag ? baseTag.getAttribute('href') || '' : '';
    // Ensure base href ends with / if it's not empty and doesn't already end with /
    return href && !href.endsWith('/') ? href + '/' : href;
  }

  private buildUrl(path: string): string {
    const baseHref = this.getBaseHref();
    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Combine base href and path, ensuring no double slashes
    return baseHref + cleanPath;
  }

  getArticles(): Observable<Article[]> {
    if (this.articlesCache) {
      return of(this.articlesCache);
    }

    const url = this.buildUrl('wiki/articles.json');

    return this.http.get<{ articles: Article[] }>(url).pipe(
      map((response) => {
        this.articlesCache = response.articles;
        return response.articles;
      }),
      catchError(() => {
        return of([]);
      })
    );
  }

  searchArticles(query: string): Observable<Article[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const searchTerm = query.toLowerCase().trim();

    return this.getArticles().pipe(
      map((articles) => {
        return articles.filter((article) => {
          const nameMatch = article.name.toLowerCase().includes(searchTerm);
          const titleMatch = article.title.toLowerCase().includes(searchTerm);
          return nameMatch || titleMatch;
        });
      })
    );
  }

  clearCache(): void {
    this.articlesCache = null;
  }
}

