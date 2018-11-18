import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AgGun } from 'ag-gun';

@Component({
    selector   : 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls  : ['./sidebar.component.scss']
})
export class SidebarComponent
{
    filters$: Observable<any[]>;

    constructor(
        private _agGun: AgGun
    )
    {

        this.filters$ = this._agGun.get('filters').list();
    }
}
