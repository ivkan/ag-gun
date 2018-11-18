import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TodoService } from './todo.service';
import { Todo } from '../shared/models';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector   : 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls  : ['./todo.component.scss']
})
export class TodoComponent implements OnInit
{
    currentTodo: Todo;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _todoService: TodoService
    )
    {
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit()
    {
        this._todoService.onCurrentTodoChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([currentTodo, formType]) => {
                if ( !currentTodo )
                {
                    this.currentTodo = null;
                }
                else
                {
                    this.currentTodo = currentTodo;
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
}
