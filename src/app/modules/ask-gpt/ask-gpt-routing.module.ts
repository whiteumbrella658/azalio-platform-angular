import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskGptPageComponent } from './pages/ask-gpt-page/ask-gpt-page.component';
import { EmpCommPageComponent } from './pages/emp-comm-page/emp-comm-page.component';
import { MyChartsComponent } from './pages/my-charts/my-charts.component';
import { ResponsesPageComponent } from './pages/responses-page/responses-page.component';

const routes: Routes = [
  { path: '', component: AskGptPageComponent},
  { path: 'mycharts', component: MyChartsComponent},
  { path: 'communication', component: EmpCommPageComponent},
  { path: 'communication/history', component: ResponsesPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AskGPTRoutingModule { }
