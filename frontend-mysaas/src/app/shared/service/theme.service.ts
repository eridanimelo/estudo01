import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'darkTheme';
  private darkThemeSubject: BehaviorSubject<boolean>;
  darkTheme$: Observable<boolean>;

  constructor() {
    const savedTheme = this.getSavedTheme();
    this.darkThemeSubject = new BehaviorSubject<boolean>(savedTheme);
    this.darkTheme$ = this.darkThemeSubject.asObservable();

    if (this.isBrowser()) {
      document.body.classList.toggle('dark-theme', savedTheme);
    }
  }

  toggleTheme(): void {
    const newTheme = !this.darkThemeSubject.value;
    this.darkThemeSubject.next(newTheme);

    if (this.isBrowser()) {
      document.body.classList.toggle('dark-theme', newTheme);
      this.saveTheme(newTheme);
    }
  }

  isDarkTheme(): boolean {
    return this.darkThemeSubject.value;
  }

  private getSavedTheme(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem(this.themeKey) === 'true';
    }
    return false; // Default para ambientes fora do navegador
  }

  private saveTheme(theme: boolean): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.themeKey, String(theme));
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
