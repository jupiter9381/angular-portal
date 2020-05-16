import { ChangeDetectorRef } from '@angular/core';
// Angular
import {Component, Inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// RxJS
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
// Services and Models
import { SPECIFICATIONS_DICTIONARY } from '../../../../../../../../core/e-commerce';

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../../../../../../../../environments/environment';

const URL = environment.apiUrl;

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-attachment-edit-dialog',
	templateUrl: './attachment-edit-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})


export class AttachmentEditDialogComponent implements OnInit {
	// Public properties
	attachmentEditForm: FormGroup;
	viewLoading = true;
	loadingAfterSubmit = false;
	specificationsDictionary: string[] = SPECIFICATIONS_DICTIONARY;

	attachmentId ;
  public uploader: FileUploader = new FileUploader({
    url: URL + 'api/invoiceAttachments/upload',
    itemAlias: 'file'
  })
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<SpecificationEditDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<AttachmentEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initSpecificationForm();
		/* Server loading imitation. Remove this on real code */
		of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
			this.viewLoading = false; // Remove this line
			this.cdr.detectChanges(); // Remove this line
    }); // Remove this line
    
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      if(response) {
        this.attachmentEditForm.controls['filename'].setValue(JSON.parse(response)['filename'])
      }
    }
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initSpecificationForm() {
		const filename: string = this.data.value;
		this.attachmentId = this.data.attachmentId;
		this.attachmentEditForm = this.fb.group({
      		filename: [filename, [Validators.required]]
		});
	}

	/**
	 * Close dialog
	 */
	onNoClick(): void {
		this.dialogRef.close({ isUpdated : false });
	}

	/**
	 * Save specification
	 */
	save() {
		const controls = this.attachmentEditForm.controls;
		/** check form */
		if (this.attachmentEditForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loadingAfterSubmit = true;
		this.viewLoading = true;

		const file = controls.filename.value;
		/* Server loading imitation. Remove this on real code */
		of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
			this.viewLoading = false;
			this.closeDialog(file);
		}); // Remove this line
	}

	/**
	 * Close dialog
	 *
	 * @param attachmentId: any
	 */
	closeDialog(file) {
		this.dialogRef.close({
			isUpdated: true,
			value: file
		});
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.attachmentEditForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	private getSpecificationIndexByName(name: string): number {
		return this.specificationsDictionary.findIndex(el => el === name);
  }
  
  onFileSelect({srcElement: { files = []} = {}}): void {
    this.uploader.uploadAll();
  }
}
