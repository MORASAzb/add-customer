import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from './api.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  isVisible = true;
  addCustomer: FormGroup;
  isFormFilled: boolean = false;
  isSubmitted = false;
  isCancelClicked = false;

  constructor(private fb: FormBuilder, private apiService: ApiService){
  // constructor(private fb: FormBuilder) {
    this.addCustomer = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      nationalCode: ['', Validators.required],
      economicCode: ['', Validators.required],
      postalCode: ['', Validators.required],
      companyName: ['', Validators.required],

    });

    this.addCustomer.valueChanges.subscribe(() => {
      this.isFormFilled = this.addCustomer.dirty && !this.addCustomer.invalid;
    });
  }

  resetForm() {
    this.isCancelClicked=true;
    this.addCustomer.reset();
    this.addCustomer.markAsPristine();
    this.addCustomer.markAsUntouched();
    this.isFormFilled = false;
    this.isSubmitted = false;
    setTimeout(() => this.isCancelClicked = false, 0);
  }

  // onSubmit() {
  //   if (this.isCancelClicked) return;
  //   this.isSubmitted = true;
  //   if (this.addCustomer.valid) { 
  //     const formData = this.addCustomer.value;
  //     console.log('Form Data:', formData);
  //     this.resetForm(); 
  //     this.addCustomer.valid;
  //   }else{
  //     this.addCustomer.markAllAsTouched();
  //     console.log('empty'); 
  //   }
  // } 


  onSubmit() {
    if (this.isCancelClicked) return;
    this.isSubmitted = true;
    if (this.addCustomer.valid) {
      const formData = this.addCustomer.value;
      this.apiService.addCustomer(formData).subscribe(response => {
        if (response) {
          this.apiService.showNotification('داده‌ها با موفقیت ارسال شدند', 'success');
          this.resetForm();
        } else {
          this.apiService.showNotification('داده‌ها ارسال نشدند', 'error');
        }
      }, error => {
        this.apiService.showNotification('خطا در ارسال داده‌ها', 'error');
      });
    } else {
      this.addCustomer.markAllAsTouched();
      this.apiService.showNotification('لطفاً همه فیلدها را کامل کنید', 'error');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addCustomer.get(fieldName);
    return (field?.invalid && this.isSubmitted) || false;
  }

  updateFormStatus() {
    this.isFormFilled = this.addCustomer.valid;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}








