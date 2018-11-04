/// <reference path="../../../../node_modules/zone.js/dist/zone.js.d.ts" />

import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { Observable, Subscription, queueScheduler as queue } from 'rxjs';

@Injectable()
export class GunZoneScheduler
{
    constructor(
        public zone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object,
    )
    {
    }

    schedule(...args: any[]): Subscription
    {
        return <Subscription>this.zone.runGuarded(function ()
        {
            return queue.schedule.apply(queue, args);
        });
    }

    keepUnstableUntilFirst<T>(obs$: Observable<T>)
    {
        if (isPlatformServer(this.platformId))
        {
            return new Observable<T>(subscriber =>
            {
                const noop = () =>
                {
                };
                const task = Zone.current.scheduleMacroTask('gunZoneBlock', noop, {}, noop, noop);
                obs$.subscribe(
                    next =>
                    {
                        if (task.state === 'scheduled')
                        {
                            task.invoke();
                        }
                        subscriber.next(next);
                    },
                    error =>
                    {
                        if (task.state === 'scheduled')
                        {
                            task.invoke();
                        }
                        subscriber.error(error);
                    },
                    () =>
                    {
                        if (task.state === 'scheduled')
                        {
                            task.invoke();
                        }
                        subscriber.complete();
                    }
                );
            });
        }
        else
        {
            return obs$;
        }
    }

    runOutsideAngular<T>(obs$: Observable<T>): Observable<T>
    {
        return new Observable<T>(subscriber =>
        {
            return this.zone.runOutsideAngular(() =>
            {
                return obs$.subscribe(
                    value => this.zone.run(() => subscriber.next(value)),
                    error => this.zone.run(() => subscriber.error(error)),
                    () => this.zone.run(() => subscriber.complete()),
                );
            });
        });
    }
}

