import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private articlesCache: Article[] | null = null;

  getArticles(): Observable<Article[]> {
    if (this.articlesCache) {
      return of(this.articlesCache);
    }

    return this.http.get<{ articles: Article[] }>('/wiki/articles.json').pipe(
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

