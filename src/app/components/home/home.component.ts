import { Component, inject, signal, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WikiService } from '../../services/wiki.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly wikiService = inject(WikiService);
  private subscription?: Subscription;

  readonly content = signal<string>('');
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(false);
    this.content.set('');

    this.subscription = this.wikiService.getArticle('index').subscribe({
      next: (html) => {
        if (html) {
          this.content.set(html);
          this.loading.set(false);
          this.error.set(false);
          // Process links after content is rendered
          setTimeout(() => this.processLinks(), 0);
        } else {
          this.error.set(true);
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private processLinks(): void {
    const container = document.querySelector('.wiki-content');
    if (!container) return;

    const links = container.querySelectorAll<HTMLAnchorElement>('a[data-internal-link="true"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          this.router.navigateByUrl(href);
        }
      });
    });
  }
}

