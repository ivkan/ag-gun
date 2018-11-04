import { AgGunOptions } from './lib/ag-gun.options';

declare module 'gun'
{
    function opt(options: AgGunOptions): void;
    function get(key: any): any;
    function put(data: any): any;
    function set(data: any);
    function back(): any;
    function map(config?: any): any;
    function on(): any;
    function once(): any;
    function open(): any;
}
