import { pickBy, set } from 'lodash';

export function isNil(obj: any): boolean
{
    return obj === undefined || obj === null;
}

export function isAgGunFactory(value: any): boolean
{
    return !isNil(value) && typeof value === 'object' && value.constructor.name === 'AgGunFactory';
}

export function extractData(data: any, key: string): any
{
    if (typeof data === 'object' && !isNil(data))
    {
        const value = pickBy(data, (_val: any, _key: any) => !isNil(_val) && _key !== '_');
        return set(value, '$key', key);
    }
    else
    {
        return data;
    }
}

export function isEmpty(value: any): boolean
{
    if (Array.isArray(value))
    {
        return value.length === 0;
    }
    else if (typeof value === 'object')
    {
        return Object.keys(value).length === 0;
    }
    else if (typeof value === 'string')
    {
        return String(value).length === 0;
    }
    else if (typeof value === 'number')
    {
        return value === 0;
    }
}
