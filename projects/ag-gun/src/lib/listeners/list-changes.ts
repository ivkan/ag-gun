import { QueryFn } from '../interfaces';
import { extractData } from '../utils';
import { BehaviorSubject } from 'rxjs';
import { AgGunFactory } from '../ag-gun-factory';
import { auditTime, map } from 'rxjs/operators';

export function listChanges<T = any>(service: AgGunFactory, subjectKey: string, queryFn?: QueryFn): void
{
    const obj = {};
    const ref = !!queryFn ? service.gun.map(queryFn) : service.gun.map();

    // run Gun listener outside angular
    service.agGun.zone.runOutsideAngular(() =>
    {
        ref.on((data: T, key, at, ev) =>
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

            // set data to container
            obj[key] = extractData(data, key);

            // share data with each subscriber
            subjects.forEach((subject: BehaviorSubject<any>) =>
            {
                service.agGun.zone.run(() => subject.next(obj));
            });
        });
    });
}

export function listTransform(subject: BehaviorSubject<any>)
{
    return subject.pipe(
        map((entities: any) =>
        {
            return Object.keys(entities).map((_key: string) => entities[_key]).filter(entity => !!entity);
        }),
        auditTime(0)
    );
}
