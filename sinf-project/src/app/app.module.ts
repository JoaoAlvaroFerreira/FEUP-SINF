import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here (needed for text inputs)
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralComponent } from './general/general.component';
import { GraficoBarrasComponent } from './grafico-barras/grafico-barras.component';
import { ApiTesterComponent } from './api-tester/api-tester.component';


@NgModule({
  declarations: [
    AppComponent,
    GeneralComponent,
    GraficoBarrasComponent,
    ApiTesterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }