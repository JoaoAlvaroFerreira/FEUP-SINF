import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { ApiInteraction } from 'src/app/api/apiInteractions.component'
import { ApiService } from '../api/api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})

export class GeneralComponent extends ApiInteraction implements OnInit, DoCheck{
  
  @Input() id: string;

  constructor(api: ApiService) {
    super(api, '/sales/orders');
  }

  ngOnInit() {
    this.getRequest();

  }

  ngDoCheck() {
    }
}