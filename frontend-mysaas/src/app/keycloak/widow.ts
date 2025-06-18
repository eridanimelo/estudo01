import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window | null>('WindowToken', {
    factory: () => (typeof window !== 'undefined' ? window : null),
});
