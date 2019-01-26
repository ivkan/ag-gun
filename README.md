# ag-Gun

Don't use me yet.

Angular 6+ wrapper for [Gun](https://github.com/amark/gun), a realtime, distributed, offline-first, graph database engine. Support server-side rendering.

> GUN is a small, easy, and fast data sync and storage system that runs everywhere JavaScript does. The aim of GUN is to let you focus on the data that needs to stored, loaded, and shared in your app without worrying about servers, network calls, databases, or tracking offline changes or concurrency conflicts.

## Install
```
npm i ag-gun --save
```

## API
The `AgGun` service is a wrapper around the native [`Gun API's`](https://gun.eco/docs/API):
* `.opt(options)`
* `.get(key)`
* `.put(data)`
* `.set(data)`
* `.back()`
* `.map(callback)`
* `.open()`
* `.on()`
* `.once()`
* `.list()` ( very similar to `.on`, except that it gives you an array with each update.

## Usage

First, import the `AgGunModule` with options to your `AppModule`:

```typescript
import { AgGunModule } from 'ag-gun';

@NgModule({
  imports: [ 
      AgGunModule.forRoot({
            peers: ['https://localhost:8080/gun']
          })
   ]
})
export class AppModule { }
```
After adding `AgGun` service to your component:
```typescript
import { Component } from '@angular/core';
import { AgGun } from 'ag-gun';
import { Observable } from 'rxjs';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
  items$: Observable<any[]>;

  constructor(private agGun: AgGun)
  {
    this.items$ = this.agGun.get('schema').list();
  }
}
```
