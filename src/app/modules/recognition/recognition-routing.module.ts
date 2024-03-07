import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecognitionPageComponent } from './pages/recognition-page/recognition-page.component';

const routes: Routes = [
  { path: '', component: RecognitionPageComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecognitionRoutingModule { }
