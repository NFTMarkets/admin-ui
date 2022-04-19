import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { CollectionPage } from './collection/collection.page'

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'collection/:contractAddress',
    component: CollectionPage,
  },
]
@NgModule({
  declarations: [CollectionPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
