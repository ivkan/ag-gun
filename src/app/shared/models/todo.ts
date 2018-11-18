export class Todo
{
    id: string;
    title: string;
    notes: string;
    completed: boolean;
    starred: boolean;
    important: boolean;
    deleted: boolean;

    constructor(todo)
    {
        {
            this.id        = todo.id || null;
            this.title     = todo.title || null;
            this.notes     = todo.notes || null;
            this.completed = todo.completed || null;
            this.starred   = todo.starred || null;
            this.important = todo.important || null;
            this.deleted   = todo.deleted || null;
        }
    }

    toggleStar(): void
    {
        this.starred = !this.starred;
    }

    toggleImportant(): void
    {
        this.important = !this.important;
    }

    toggleCompleted(): void
    {
        this.completed = !this.completed;
    }

    toggleDeleted(): void
    {
        this.deleted = !this.deleted;
    }
}
