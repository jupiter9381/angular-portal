import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { fromEvent, merge, BehaviorSubject, Subscription, Observable, of } from 'rxjs';

@Component({
  selector: 'kt-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss']
})
export class AttachmentListComponent implements OnInit {

  // Incoming data
  @Input() invoiceId$: Observable<number>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
