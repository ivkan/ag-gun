import { ChangeDetectorRef } from '@angular/core';

export class Utils
{
    public static refresh(cd: ChangeDetectorRef): void
    {
        if (!cd['destroyed'])
        {
            cd.detectChanges();
        }
    }
}
