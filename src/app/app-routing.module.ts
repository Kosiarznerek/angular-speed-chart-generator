import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {MainViewComponent} from './main-view/main-view.component';
import {InstructionManualComponent} from './instruction-manual/instruction-manual.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'main-view'},
    {path: 'main-view', component: MainViewComponent},
    {path: 'instruction-manual', component: InstructionManualComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
