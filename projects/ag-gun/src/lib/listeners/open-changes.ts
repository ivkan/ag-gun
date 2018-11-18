import { BehaviorSubject } from 'rxjs';

import { extractData } from '../utils';
import { AgGunFactory } from '../ag-gun-factory';

export function openChanges<T>(service: AgGunFactory, subjectKey: string): void
{
    // run Gun listener outside angular
    service.agGun.zone.runOutsideAngular(() =>
    {
        service.gun.open((data: T, key: string, at: any, ev: any) =>
        {
            // get active subjects
            const subjects = service.getActiveSubjects(subjectKey);

            // stop the listener if there are no active subscribers
            if (subjects.length === 0)
            {
                // clear cache
                service.clearCache(subjectKey);

                // stop the Gun listener
                return ev.off();
            }

            const value = extractData(data, key);

            // share data with each subscriber
            subjects.forEach((subject: BehaviorSubject<any>) =>
            {
                service.agGun.zone.run(() => subject.next(value));
            });
        });
    });
}
