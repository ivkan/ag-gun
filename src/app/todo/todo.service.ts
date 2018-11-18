import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { AgGun } from 'ag-gun';

import { TodoFakeDb } from '../shared/data';
import { Todo } from '../shared/models';

@Injectable()
export class TodoService implements Resolve<any>
{
    taskFilterChanged: BehaviorSubject<string>;
    onCurrentTodoChanged: BehaviorSubject<any>;

    routeParams: any;

    constructor(
        private _agGun: AgGun
    )
    {
        this.onCurrentTodoChanged = new BehaviorSubject([]);
        this.taskFilterChanged    = new BehaviorSubject<string>(null);

        setTimeout(() =>
        {
            console.log(this._agGun.subjectMap);
        }, 0);
    }

    /**
     * Resolver
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve) =>
        {
            this.initTasks();

            if (this.routeParams.todoId)
            {
                this.setCurrentTodo(this.routeParams.todoId);
            }
            else
            {
                this.onCurrentTodoChanged.next([]);
            }

            resolve();
        });
    }

    private initTasks(): void
    {
        if (this.routeParams.filterHandle)
        {
            this.taskFilterChanged.next(this.routeParams.filterHandle);
            return;
        }
        this.taskFilterChanged.next(null);
    }

    setCurrentTodo(todoId: string): void
    {
        if (todoId === 'new')
        {
            this.onCurrentTodoChanged.next([{}, 'new']);
            return;
        }
        this._agGun.get('tasks').get(todoId).once().subscribe((currentTodo: Todo) =>
        {
            this.onCurrentTodoChanged.next([currentTodo, 'edit']);
        });
    }

    updateTodo(todo): void
    {
        this._agGun.get('tasks').get(todo.id).put(todo);
    }

    setFakeData(): void
    {
        const filters = TodoFakeDb.filters.reduce((_filters, filter) =>
        {
            return {
                ..._filters,
                [filter.id]: filter
            };
        }, {});

        const tasks = TodoFakeDb.tasks.reduce((_tasks, todo) =>
        {
            return {
                ..._tasks,
                [todo.id]: todo
            };
        }, {});

        this._agGun.get('filters').put(filters);
        this._agGun.get('tasks').put(tasks);
    }
}
