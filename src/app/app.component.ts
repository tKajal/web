
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { WebserviceService } from './services/webservice.service';
import { MessageService } from './services/message.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  
}