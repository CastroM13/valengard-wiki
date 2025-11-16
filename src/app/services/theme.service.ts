import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'diem' | 'penumbra' | 'umbra';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme on initialization
    this.applyTheme(this.currentTheme());

    // Watch for theme changes and persist to localStorage
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      localStorage.setItem('wiki-theme', theme);
    });
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const saved = localStorage.getItem('wiki-theme') as Theme;
    if (saved && ['diem', 'penumbra', 'umbra'].includes(saved)) {
      return saved;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'umbra';
    }
    // Default to light
    return 'diem';
  }

  cycleTheme(): void {
    const themes: Theme[] = ['diem', 'penumbra', 'umbra'];
    const currentIndex = themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme.set(themes[nextIndex]);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  getThemeIcon(): string {
    switch (this.currentTheme()) {
      case 'diem':
        return 'sun';
      case 'penumbra':
        return 'moon';
      case 'umbra':
        return 'eclipse';
      default:
        return 'sun';
    }
  }
}

