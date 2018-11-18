import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Todo } from '../../../shared/models';
import { TodoService } from '../../todo.service';

@Component({
    selector   : 'app-todo-list-item',
    templateUrl: './todo-list-item.component.html',
    styleUrls  : ['./todo-list-item.component.scss']
})
export class TodoListItemComponent implements OnInit
{
    @Input()
    todo: Todo;

    @HostBinding('class.selected')
    selected: boolean;

    @HostBinding('class.completed')
    completed: boolean;

    @HostBinding('class.move-disabled')
    moveDisabled: boolean;

    constructor(
        private _todoService: TodoService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        this.todo      = new Todo(this.todo);
        this.completed = this.todo.completed;
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

        this.todo.toggleCompleted();
        this._todoService.updateTodo(this.todo);
    }
}
