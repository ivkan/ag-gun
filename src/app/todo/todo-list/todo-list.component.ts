import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TodoService } from '../todo.service';
import { Todo } from '../../shared/models';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AgGun } from '../../../../projects/ag-gun/src/lib/ag-gun';
import { Utils } from '../../shared/utils';

@Component({
    selector       : 'app-todo-list',
    templateUrl    : './todo-list.component.html',
    styleUrls      : ['./todo-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit, OnDestroy
{
    tasks: Todo[];
    tasks$: Observable<any[]>;
    currentTodo: Todo;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _agGun: AgGun,
        private _changeDetectorRef: ChangeDetectorRef,
        private _todoService: TodoService
    )
    {
        this.tasks$          = this._agGun.get('tasks').list();
        this.tasks           = [];
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit()
    {
        setTimeout(() =>
        {
            console.log(this._agGun.subjectMap);
        }, 0);
        this._todoService.taskFilterChanged
            .pipe(
                switchMap((filter: string) =>
                {
                    return this.tasks$.pipe(
                        map((tasks: any[]) =>
                        {
                            console.log(tasks);
                            if (!!filter)
                            {
                                return tasks.filter(task => !!task[filter]);
                            }
                            return tasks;
                        })
                    );
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((tasks: Todo[]) =>
            {
                this.tasks = tasks;
                this.detectChanges();
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private detectChanges(): void
    {
        Utils.refresh(this._changeDetectorRef);
    }
}
