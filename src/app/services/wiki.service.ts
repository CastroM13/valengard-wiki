import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { marked } from 'marked';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly cache = new Map<string, string>();

  constructor() {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

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

  getArticle(articleName: string): Observable<string> {
    const cacheKey = articleName;
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    const fileName = articleName === 'index' ? 'index.md' : `${articleName}.md`;
    const url = this.buildUrl(`wiki/${fileName}`);

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((markdown: string) => {
        const html = this.parseMarkdown(markdown);
        this.cache.set(cacheKey, html);
        return html;
      }),
      catchError(() => {
        return of('');
      })
    );
  }

  private parseMarkdown(markdown: string): string {
    // Parse markdown to HTML
    const html = marked.parse(markdown) as string;
    
    // Convert internal links in HTML to Angular router links
    return this.convertInternalLinks(html);
  }

  private convertInternalLinks(html: string): string {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a[href]');
    
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external links
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        return;
      }
      
      // Skip anchor links
      if (href.startsWith('#')) {
        return;
      }
      
      // Convert internal wiki links
      // Handle both /wiki/article-name and article-name formats
      let articleName = href;
      if (href.startsWith('/wiki/')) {
        articleName = href.replace('/wiki/', '');
      } else {
        // Remove .md extension if present
        articleName = href.replace(/\.md$/, '');
      }
      
      // Set the href to the router path
      link.setAttribute('href', `/wiki/${articleName}`);
      // Add a data attribute to identify internal links for Angular router handling
      link.setAttribute('data-internal-link', 'true');
    });
    
    return doc.body.innerHTML;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

