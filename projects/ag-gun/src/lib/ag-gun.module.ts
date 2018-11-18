import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import * as Gun from 'gun';

import { AgGunOptions } from './ag-gun.options';
import { BehaviorSubject } from 'rxjs';
import { isEmpty } from './utils';

export const agGunOptions = new InjectionToken<AgGunOptions>('agGunOptions.app.options');

export function initGun(options: AgGunOptions): Function
{
    return isEmpty(options) ? new Gun() : new Gun({...options});
}

@NgModule()
export class AgGunModule
{
    static forRoot(config?: AgGunOptions): ModuleWithProviders
    {
        return {
            ngModule : AgGunModule,
            providers: [
                {provide: agGunOptions, useValue: config},
                {provide: 'listenMap', useValue: new Map<string, any>()},
                {provide: 'subjectMap', useValue: new Map<string, BehaviorSubject<any>[]>()},
                {provide: 'Gun', useFactory: initGun, deps: [agGunOptions]}
            ]
        };
    }
}
