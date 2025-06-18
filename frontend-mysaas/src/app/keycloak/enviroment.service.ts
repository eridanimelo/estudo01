import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
    private platformId = inject(PLATFORM_ID);

    isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
}
