// Angular
import { Component } from '@angular/core';
import {LayoutConfigService} from '../../../../core/_base/layout';

@Component({
  selector: 'kt-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  userDisplay = true;
  userLayout = 'offcanvas';
  userDropdownStyle = 'light';

  constructor(private layoutConfigService: LayoutConfigService) {
    this.userDisplay = this.layoutConfigService.getConfig('extras.user.display');
    this.userLayout = this.layoutConfigService.getConfig('extras.user.layout');
    this.userDropdownStyle = this.layoutConfigService.getConfig('extras.user.dropdown.style');
  }
}
