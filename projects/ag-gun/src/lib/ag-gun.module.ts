import { ModuleWithProviders, NgModule } from '@angular/core';

import { AgGunOptions } from './ag-gun.options';
import { GunZoneScheduler } from './ag-gun-scheduler';

@NgModule({
    providers: [
        GunZoneScheduler
    ]
})
export class AgGunModule
{
    static forRoot(config?: AgGunOptions): ModuleWithProviders
    {
        return {
            ngModule : AgGunModule,
            providers: [
                {provide: 'agGunOptions', useValue: config}
            ]
        };
    }
}
