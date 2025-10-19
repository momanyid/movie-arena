import { Injectable, signal, computed } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly _items = signal<Movie[]>(
    this._loadFromStorage()
  );

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);

  isInWatchlist(id: number): boolean {
    return this._items().some((m) => m.id === id);
  }

  toggle(movie: Movie): void {
    this._items.update((items) => {
      const exists = items.some((m) => m.id === movie.id);
      const updated = exists
        ? items.filter((m) => m.id !== movie.id)
        : [...items, movie];
      this._saveToStorage(updated);
      return updated;
    });
  }

  private _saveToStorage(items: Movie[]): void {
    try {
      localStorage.setItem('ma_watchlist', JSON.stringify(items));
    } catch {}
  }

  private _loadFromStorage(): Movie[] {
    try {
      const raw = localStorage.getItem('ma_watchlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
