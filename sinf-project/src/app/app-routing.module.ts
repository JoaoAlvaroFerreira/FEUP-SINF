import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisaoGeralComponent } from './visao-geral/visao-geral.component';
import { VendasComponent } from './vendas/vendas.component';
import { ComprasComponent } from './compras/compras.component';
import { InventarioComponent } from './inventario/inventario.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';


const routes: Routes = [
  { path: 'visaogeral', component: VisaoGeralComponent },
  { path: 'vendas', component: VendasComponent },
  { path: 'compras', component: ComprasComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'financeiro', component: FinanceiroComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
