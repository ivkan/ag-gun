import { AgGun } from './ag-gun';
import { Observable } from 'rxjs';
import { extractData } from './utils';
import { auditTime, map } from 'rxjs/operators';
import { QueryFn } from './interfaces';

export function listChanges<T = any>(ngRef: AgGun, queryFn: QueryFn): Observable<T[]>
{
    const obj: any = {};

    return Observable.create(subscriber =>
    {
        subscriber.next(obj);
        let stopped = false;
        ngRef.gun.map(queryFn).on((data: T, key: string, at: any, ev: any) =>
        {
            if (stopped)
            {
                subscriber.complete();
                return ev.off();
            }
            obj[key] = extractData(data, key);
            subscriber.next(obj);
        });
        return () =>
        {
            // Caller unsubscribe
            stopped = true;
        };
    }).pipe(
        map((entities: any) => Object.keys(entities).map((id) => entities[id])),
        auditTime(10),
    );
}
