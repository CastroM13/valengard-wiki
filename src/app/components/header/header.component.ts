import { Component, inject, signal, effect, HostListener, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, Article } from '../../services/search.service';
import { ThemeService } from '../../services/theme.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);
  readonly themeService = inject(ThemeService);
  
  readonly searchQuery = signal<string>('');
  readonly searchResults = signal<Article[]>([]);
  readonly showResults = signal<boolean>(false);
  readonly isSearching = signal<boolean>(false);
  readonly randomFont = signal<string>('');
  readonly titleFontSize = signal<string>('');
  
  @ViewChild('billboardTitle', { read: ElementRef }) billboardTitle?: ElementRef<HTMLSpanElement>;
  
  private searchSubject = new Subject<string>();

  private readonly billboardFonts = [
    'Bebas Neue',
    'Oswald',
    'Righteous',
    'Bungee',
    'Bungee Shade',
    'Bungee Inline',
    'Creepster',
    'Fascinate',
    'Fascinate Inline',
    'Faster One',
    'Freckle Face',
    'Fredoka One',
    'Lilita One',
    'Monoton',
    'Nova Square',
    'Orbitron',
    'Passion One',
    'Permanent Marker',
    'Press Start 2P',
    'Russo One',
    'Staatliches',
    'Titan One',
    'Ultra',
    'Wallpoet',
    'Abril Fatface',
    'Alfa Slab One',
    'Black Ops One',
    'Bungee Hairline',
    'Butcherman',
    'Eater',
    'Fontdiner Swanky',
    'Griffy',
    'Iceberg',
    'Jolly Lodger',
    'Knewave',
    'Londrina Outline',
    'Londrina Shadow',
    'Londrina Sketch',
    'Londrina Solid',
    'Megrim',
    'Nosifer',
    'Ribeye',
    'Ribeye Marrow',
    'Rye',
    'Sonsie One',
    'Spicy Rice',
    'UnifrakturCook',
    'UnifrakturMaguntia',
    'Vast Shadow',
    'Vampiro One'
  ];

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

  ngOnInit(): void {
    this.loadRandomFont();
  }

  ngAfterViewInit(): void {
    // Wait for font to load, then adjust size
    setTimeout(() => this.adjustTitleSize(), 100);
  }

  private loadRandomFont(): void {
    // Pick a random font from the list
    const randomIndex = Math.floor(Math.random() * this.billboardFonts.length);
    const selectedFont = this.billboardFonts[randomIndex];
    
    // Convert font name to Google Fonts API format (replace spaces with +)
    const fontFamily = selectedFont;
    const fontApiName = selectedFont.replace(/\s+/g, '+');
    
    // Load the font from Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontApiName}:wght@400;700;900&display=swap`;
    document.head.appendChild(link);
    
    // Set the font family signal
    this.randomFont.set(`"${fontFamily}", sans-serif`);
    
    // Adjust size after font loads
    link.onload = () => {
      setTimeout(() => this.adjustTitleSize(), 50);
    };
  }

  private adjustTitleSize(): void {
    if (!this.billboardTitle?.nativeElement) {
      // Retry after a short delay if element isn't ready
      setTimeout(() => this.adjustTitleSize(), 50);
      return;
    }
    
    const element = this.billboardTitle.nativeElement;
    const maxWidth = 150;
    const minFontSize = 10;
    const maxFontSize = 36;
    
    // Binary search to find the right font size
    let low = minFontSize;
    let high = maxFontSize;
    let bestFit = minFontSize;
    
    while (low <= high) {
      const fontSize = Math.floor((low + high) / 2);
      element.style.fontSize = `${fontSize}px`;
      
      // Force reflow to get accurate measurements
      void element.offsetHeight;
      
      const width = element.scrollWidth;
      
      if (width <= maxWidth) {
        bestFit = fontSize;
        low = fontSize + 1;
      } else {
        high = fontSize - 1;
      }
    }
    
    // Set the final font size (use bestFit which is the largest that fits)
    this.titleFontSize.set(`${bestFit}px`);
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

