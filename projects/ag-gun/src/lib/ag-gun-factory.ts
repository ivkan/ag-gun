import { BehaviorSubject, Observable } from 'rxjs';

import { AgGunOptions } from './ag-gun.options';
import { QueryFn } from './interfaces';
import { isAgGunFactory } from './utils';
import { listChanges, listTransform, onceChanges, onChanges, openChanges } from './listeners';
import { AgGun } from './ag-gun';

export class AgGunFactory
{
    pathSegments: any[];
    gun: any;

    constructor(
        public agGun: AgGun
    )
    {
        this.pathSegments = [];
        this.gun          = this.agGun.gun;
    }

    /**
     * Create service
     */
    static create(gun: any, agGun: AgGun, paths: string[]): AgGunFactory
    {
        const service        = new AgGunFactory(agGun);
        service.pathSegments = [...paths];
        service.gun          = gun;
        return service;
    }

    /**
     * Set Options
     */
    opt(options: AgGunOptions): AgGunFactory
    {
        this.agGun.zone.runOutsideAngular(() => this.gun.opt(options));

        return this;
    }

    /**
     * Get
     */
    get(key: string | number): AgGunFactory
    {
        key = `${key}`;

        this.pathSegments.push(key);

        return this.agGun.zone.runOutsideAngular(() =>
        {
            return AgGunFactory.create(this.gun.get(key), this.agGun, this.pathSegments);
        });
    }

    /**
     * Map
     */
    map(queryFn?: QueryFn): AgGunFactory
    {
        this.pathSegments.push('map');

        return this.agGun.zone.runOutsideAngular(() =>
        {
            return !!queryFn
                ? AgGunFactory.create(this.gun.map(queryFn), this.agGun, this.pathSegments)
                : AgGunFactory.create(this.gun.map(), this.agGun, this.pathSegments);
        });
    }

    /**
     * Put
     */
    put(data: any | AgGun): AgGunFactory
    {
        return this.agGun.zone.runOutsideAngular(() =>
        {
            return isAgGunFactory(data)
                ? AgGunFactory.create(this.gun.put(data.gun), this.agGun, this.pathSegments)
                : AgGunFactory.create(this.gun.put(data), this.agGun, this.pathSegments);
        });
    }

    /**
     * Set
     */
    set(data: any | AgGun): AgGunFactory
    {
        return this.agGun.zone.runOutsideAngular(() =>
        {
            return isAgGunFactory(data)
                ? AgGunFactory.create(this.gun.set(data.gun), this.agGun, this.pathSegments)
                : AgGunFactory.create(this.gun.set(data), this.agGun, this.pathSegments);
        });
    }

    /**
     * Back
     */
    back(): AgGunFactory
    {
        return this.agGun.zone.runOutsideAngular(() =>
        {
            return AgGunFactory.create(this.gun.back(), this.agGun, this.pathSegments);
        });
    }

    /**
     * Open
     */
    open<T>(): Observable<T>
    {
        const key     = this.getKey('open');
        const subject = new BehaviorSubject({});

        // create new subject and put it in cache
        this.saveSubject(key, subject);

        // create a listener Gun if it is not
        if (!this.hasListener(key))
        {
            openChanges(this, key);

            // put listener in cache
            this.saveListener(key);
        }

        return subject.asObservable() as Observable<T>;
    }

    /**
     * Once
     */
    once<T>(): Observable<T>
    {
        const key     = this.getKey('once');
        const subject = new BehaviorSubject({});

        // create new subject and put it in cache
        this.saveSubject(key, subject);

        onceChanges(this, key);

        return subject.asObservable() as Observable<T>;
    }

    /**
     * On
     */
    on<T>(): Observable<T>
    {
        const key     = this.getKey('on');
        const subject = new BehaviorSubject({});

        // create new subject and put it in cache
        this.saveSubject(key, subject);

        // create a listener Gun if it is not
        if (!this.hasListener(key))
        {
            onChanges(this, key);

            // put listener in cache
            this.saveListener(key);
        }

        return subject.asObservable() as Observable<T>;
    }

    /**
     * List
     */
    list<T>(queryFn?: QueryFn): Observable<T[]>
    {
        const key     = this.getKey('list', queryFn);
        const subject = new BehaviorSubject({});

        // create new subject and put it in cache
        this.saveSubject(key, subject);

        // create a listener Gun if it is not
        if (!this.hasListener(key))
        {
            listChanges(this, key, queryFn);

            // put listener in cache
            this.saveListener(key);
        }

        // transform an object into an array
        return listTransform(subject) as Observable<T[]>;
    }

    /**
     * Clear cache
     */
    clearCache(key: string): void
    {
        this.agGun.subjectMap.delete(key);
        this.agGun.listenMap.delete(key);
    }

    /**
     * Get active subjects
     */
    getActiveSubjects(key: string): BehaviorSubject<any>[]
    {
        const subjects = this.agGun.subjectMap.get(key) || [];

        return subjects.filter(subject => !subject.isStopped);
    }

    /**
     * Sets subject in cache
     */
    private saveSubject(key: string, subject: BehaviorSubject<any>): void
    {
        if (!this.agGun.subjectMap.has(key))
        {
            this.agGun.subjectMap.set(key, [subject]);
        }
        else
        {
            if (this.agGun.subjectMap.get(key).length > 0)
            {
                subject.next(this.agGun.subjectMap.get(key)[0].getValue());
            }
            const array = [...this.agGun.subjectMap.get(key), subject];
            this.agGun.subjectMap.set(key, array);
        }
    }

    /**
     * Sets Gun listener in cache
     */
    private saveListener(key: string): void
    {
        this.agGun.listenMap.set(key, true);
    }

    /**
     * Checks if the listener exists in cache
     */
    private hasListener(key: string): boolean
    {
        return this.agGun.listenMap.has(key);
    }

    /**
     * Create a new key to store listeners and subjects
     */
    private getKey(method: string, queryFn?: QueryFn): string
    {
        const queryFnString = !!queryFn ? `(${queryFn.toString()})` : '';
        method              = method + queryFnString;

        return [...this.pathSegments, method].join('-');
    }
}

