import { BehaviorSubject } from 'rxjs';
import { extractData } from '../utils';
import { AgGunFactory } from '../ag-gun-factory';

export function onceChanges<T>(service: AgGunFactory, subjectKey: string): void
{
    // run Gun listener outside angular
    service.agGun.zone.runOutsideAngular(() =>
    {
        service.gun.once((data: T, key: string) =>
        {
            // get active subjects
            const subjects = service.getActiveSubjects(subjectKey);

            const value = extractData(data, key);

            // share data with each subscriber
            subjects.forEach((subject: BehaviorSubject<any>) =>
            {
                service.agGun.zone.run(() => subject.next(value));
            });

            // clear cache
            service.clearCache(subjectKey);
        });
    });
}
