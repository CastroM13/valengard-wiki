import { Component, inject, signal, effect, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, Article } from '../../services/search.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);
  
  readonly searchQuery = signal<string>('');
  readonly searchResults = signal<Article[]>([]);
  readonly showResults = signal<boolean>(false);
  readonly isSearching = signal<boolean>(false);
  
  private searchSubject = new Subject<string>();

  constructor() {
    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        this.isSearching.set(true);
        return this.searchService.searchArticles(query);
      })
    ).subscribe((results) => {
      this.searchResults.set(results);
      this.isSearching.set(false);
      this.showResults.set(this.searchQuery().trim().length > 0);
    });

    // Close results when clicking outside
    effect(() => {
      if (this.searchQuery().length === 0) {
        this.showResults.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  onSearchFocus(): void {
    if (this.searchResults().length > 0 && this.searchQuery().trim().length > 0) {
      this.showResults.set(true);
    }
  }

  selectArticle(article: Article): void {
    this.searchQuery.set('');
    this.showResults.set(false);
    this.router.navigate(['/wiki', article.path]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.showResults.set(false);
    }
  }
}

