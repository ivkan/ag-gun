import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';

import * as Gun from 'gun';

import { BehaviorSubject } from 'rxjs';

import { AgGunFactory } from './ag-gun-factory';

@Injectable({
    providedIn: 'root'
})
export class AgGun
{
    constructor(
        @Inject(PLATFORM_ID) public platformId: Object,
        public zone: NgZone,
        @Inject('listenMap') public listenMap: Map<string, any>,
        @Inject('subjectMap') public subjectMap: Map<string, BehaviorSubject<any>[]>,
        @Inject('Gun') public gun: any,
    )
    {
    }

    /**
     * Create AgGunFactory
     */
    get(key: string | number): AgGunFactory
    {
        const service = new AgGunFactory(this);
        return service.get(key);
    }
}


