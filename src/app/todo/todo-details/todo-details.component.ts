import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Todo } from '../../shared/models';
import { TodoService } from '../todo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector   : 'app-todo-details',
    templateUrl: './todo-details.component.html',
    styleUrls  : ['./todo-details.component.scss']
})
export class TodoDetailsComponent implements OnInit, OnDestroy
{
    todo: Todo;
    formType: string;
    todoForm: FormGroup;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _todoService: TodoService,
        private _formBuilder: FormBuilder,
        private _router: Router
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
            .subscribe(([todo, formType]) =>
            {
                if (todo && formType === 'edit')
                {
                    this.formType = 'edit';
                    this.todo     = new Todo(todo);
                    this.todoForm = this.createTodoForm();

                    this.todoForm.valueChanges
                        .pipe(
                            takeUntil(this._unsubscribeAll),
                            debounceTime(500),
                            distinctUntilChanged()
                        )
                        .subscribe(data =>
                        {
                            this._todoService.updateTodo(data);
                            this.todo = {
                                ...this.todo,
                                ...data
                            };
                        });
                }
                else if (formType === 'new')
                {
                    this.formType = 'new';
                    this.todo     = new Todo({});
                    this.todo.id  = generateGUID();
                    this.todoForm = this.createTodoForm();
                }
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    toggleStar(event): void
    {
        event.stopPropagation();
        this.todo.toggleStar();
        this._todoService.updateTodo(this.todo);
    }

    toggleImportant(event): void
    {
        event.stopPropagation();
        this.todo.toggleImportant();
        this._todoService.updateTodo(this.todo);
    }

    toggleCompleted(event): void
    {
        event.stopPropagation();
        this.todo.completed = !this.todo.completed;
        this._todoService.updateTodo(this.todo);
    }

    toggleDeleted(event): void
    {
        event.stopPropagation();
        this.todo.toggleDeleted();
        this._todoService.updateTodo(this.todo);
    }

    addTodo(): void
    {
        this._todoService.updateTodo(this.todoForm.getRawValue());

        this._router.navigate(['/apps/todo/all']);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private createTodoForm(): FormGroup
    {
        return this._formBuilder.group({
            'id'       : [this.todo.id],
            'title'    : [this.todo.title],
            'notes'    : [this.todo.notes],
            'completed': [this.todo.completed],
            'starred'  : [this.todo.starred],
            'important': [this.todo.important],
            'deleted'  : [this.todo.deleted],
        });
    }
}


function generateGUID(): string
{
    function S4(): string
    {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return S4() + S4();
}
