import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import * as Gun from 'gun';
import 'gun/lib/open';

import { Observable } from 'rxjs';

import { QueryFn } from './interfaces';
import { extractData, isAgGun, isEmpty } from './utils';
import { AgGunOptions } from './ag-gun.options';
import { GunZoneScheduler } from './ag-gun-scheduler';
import { listChanges } from './list-changes';

@Injectable({
    providedIn: 'root'
})
export class AgGun
{
    public gun: Gun;

    constructor(
        @Inject(PLATFORM_ID) public platformId: Object,
        public scheduler: GunZoneScheduler,
        @Inject('agGunOptions') private options: AgGunOptions,
    )
    {
        // Create the Gun instance
        this.gun = this.scheduler.zone.runOutsideAngular(() => AgGun.newGun(options));
    }

    /**
     * Create
     */
    static create(gun: Gun, scheduler: GunZoneScheduler, options: AgGunOptions, platformId: Object): AgGun
    {
        const newRef = new AgGun(platformId, scheduler, options);
        newRef.gun   = gun;
        return newRef;
    }

    /**
     * Create the Gun instance
     */
    static newGun(options: AgGunOptions): Gun
    {
        return isEmpty(options) ? new Gun() : new Gun({...options});
    }

    /**
     * Set Options
     */
    opt(options: AgGunOptions): AgGun
    {
        this.scheduler.zone.runOutsideAngular(() =>
        {
            this.gun.opt(options);
        });

        return this;
    }

    /**
     * get
     */
    get(key: string): AgGun
    {
        return this.scheduler.zone.runOutsideAngular(() =>
        {
            return AgGun.create(this.gun.get(key), this.scheduler, this.options, this.platformId);
        });
    }

    /**
     * put
     */
    put(data: any | AgGun): AgGun
    {
        return this.scheduler.zone.runOutsideAngular(() =>
        {
            return isAgGun(data)
                ? AgGun.create(this.gun.put(data.gun), this.scheduler, this.options, this.platformId)
                : AgGun.create(this.gun.put(data), this.scheduler, this.options, this.platformId);
        });
    }

    /**
     * set
     */
    set(data: any | AgGun): AgGun
    {
        return this.scheduler.zone.runOutsideAngular(() =>
        {
            return isAgGun(data)
                ? AgGun.create(this.gun.set(data.gun), this.scheduler, this.options, this.platformId)
                : AgGun.create(this.gun.set(data), this.scheduler, this.options, this.platformId);
        });
    }

    /**
     * back
     */
    back(): AgGun
    {
        return this.scheduler.zone.runOutsideAngular(() =>
        {
            return AgGun.create(this.gun.back(), this.scheduler, this.options, this.platformId);
        });
    }

    /**
     * map
     */
    map(queryFn?: QueryFn): AgGun
    {
        return this.scheduler.zone.runOutsideAngular(() =>
        {
            return !!queryFn
                ? AgGun.create(this.gun.map(queryFn), this.scheduler, this.options, this.platformId)
                : AgGun.create(this.gun.map(), this.scheduler, this.options, this.platformId);
        });
    }

    /**
     * open
     */
    open<T>(): Observable<T>
    {
        const observable$ = Observable.create(subscriber =>
        {
            let stopped = false;
            this.gun.open((data: T, key: any, at: any, ev: any) =>
            {
                if (stopped)
                {
                    subscriber.complete();
                    return ev.off();
                }
                subscriber.next(extractData(data, key));
            });
            return () =>
            {
                // Caller unsubscribe
                stopped = true;
            };
        });
        return this.scheduler.keepUnstableUntilFirst(
            this.scheduler.runOutsideAngular(
                observable$
            )
        );
    }

    /**
     * once
     */
    once<T>(): Observable<T>
    {
        const observable$ = Observable.create(subscriber =>
        {
            this.gun.once((data: T, key: string, at: any, ev: any) =>
            {
                subscriber.next(extractData(data, key));
                subscriber.complete();
                return ev.off();
            });
        });
        return this.scheduler.keepUnstableUntilFirst(
            this.scheduler.runOutsideAngular(
                observable$
            )
        );
    }

    /**
     * on
     */
    on<T>(): Observable<T>
    {
        const observable$ = Observable.create(subscriber =>
        {
            let stopped = false;
            this.gun.on((data: T, key: string, at: any, ev: any) =>
            {
                if (stopped)
                {
                    subscriber.complete();
                    return ev.off();
                }
                subscriber.next(extractData(data, key));
            });
            return () =>
            {
                // Caller unsubscribe
                stopped = true;
            };
        });
        return this.scheduler.keepUnstableUntilFirst(
            this.scheduler.runOutsideAngular(
                observable$
            )
        );
    }

    /**
     * on
     */
    list<T>(queryFn?: QueryFn): Observable<T[]>
    {
        if (!queryFn)
        {
            queryFn = item => !!item ? item : undefined;
        }
        const snapshotChanges$ = listChanges<T>(this, queryFn);
        return this.scheduler.keepUnstableUntilFirst(
            this.scheduler.runOutsideAngular(
                snapshotChanges$
            )
        );
    }
}
