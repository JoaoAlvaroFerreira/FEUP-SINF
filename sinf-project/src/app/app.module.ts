import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here (needed for text inputs)
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralComponent } from './general/general.component';
import { GraficoBarrasComponent } from './grafico-barras/grafico-barras.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GraficoBoloComponent } from './grafico-bolo/grafico-bolo.component';
import { GraficoLinearComponent } from './grafico-linear/grafico-linear.component';
import { MessagesComponent }    from './messages/messages.component';
import { MessageService }       from './message.service';
import { VisaoGeralComponent } from './visao-geral/visao-geral.component';
import { VendasComponent } from './vendas/vendas.component';
import { ComprasComponent } from './compras/compras.component';
import { InventarioComponent } from './inventario/inventario.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { ApiService } from './api/api.service';
import { ApiInteraction } from './api/apiInteractions.component';



@NgModule({
  declarations: [
    AppComponent,
    GeneralComponent,
    GraficoBarrasComponent,
    MessagesComponent,
    GraficoBoloComponent,
    GraficoLinearComponent,
    VisaoGeralComponent,
    VendasComponent,
    ComprasComponent,
    InventarioComponent,
    FinanceiroComponent,
    ApiInteraction
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FontAwesomeModule
  ],
  providers: [
    MessageService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }