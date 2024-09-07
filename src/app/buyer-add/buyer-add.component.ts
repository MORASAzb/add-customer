import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ApiService } from '../api.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatOption, MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';




@Component({
  selector: 'app-buyer-add',
  templateUrl: './buyer-add.component.html',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
    MatCard,
    MatDivider,
    MatToolbar,
    MatSelect,
    MatOption,
    MatCheckbox,


  ],
  styleUrl: './buyer-add.component.scss'
})
export class BuyerAddComponent {

  isVisible = true;
  addCustomer: FormGroup;
  isFormFilled: boolean = false;
  isSubmitted = false;
  isCancelClicked = false;
  options: any;
  filteredOptions: Observable<any[]> = of([]);
  selectedType: any;


  constructor(private fb: FormBuilder, private apiService: ApiService, private http: HttpClient) {

    this.addCustomer = this.fb.group({

      type: [0, Validators.required],
      name: ['', Validators.required],
      brandName: ['', Validators.required],
      economicNumber: ['', [Validators.required, this.economicNumberValidator.bind(this)]],
      nationalId: ['', Validators.required],
      moblie: [''],
      passportNumber: [''],
      status: [0],
      email: [''],
      address: [''],
      inqueryStatus: [0],
      BranchCode: [''],
      BranchName: [''],
      isMainBranch: [false]
    });

    this.addCustomer.valueChanges.subscribe(() => {
      this.isFormFilled = this.addCustomer.dirty && !this.addCustomer.invalid;
    });
  }


  ngOnInit(): void {

    const url = 'http://172.18.70.15:20946/api/v1/metadata/economicactivisttype?userid=4Ow5Fn';
    this.http.get<any>(url).subscribe(
      res => {
        this.options = res.data;
        this.filteredOptions = of(Object.values(this.options));
      },
      error => {
        console.error('Error loading options:', error);
      }
    );

    this.addCustomer.get('isMainBranch')?.valueChanges.subscribe(isChecked => {
      if (isChecked) {
        this.addCustomer.patchValue({
          BranchCode: '0000',
          BranchName: '0000',
        });
        this.addCustomer.get('BranchCode')?.disable();
        this.addCustomer.get('BranchName')?.disable();
      } else {
        this.addCustomer.get('BranchCode')?.enable();
        this.addCustomer.get('BranchName')?.enable();
        this.addCustomer.patchValue({
          BranchCode: '',
          BranchName: '',
        });
      }
    });

    this.addCustomer.get('type')?.valueChanges.subscribe((selectedValue) => {
      this.selectedType = selectedValue;
      this.addCustomer.get('economicNumber')?.updateValueAndValidity();
    });


  }


  resetForm() {
    this.isCancelClicked = true;
    this.addCustomer.reset();
    this.addCustomer.markAsPristine();
    this.addCustomer.markAsUntouched();
    this.isFormFilled = false;
    this.isSubmitted = false;
    setTimeout(() => this.isCancelClicked = false, 0);
  }


  economicNumberValidator(control: any) {
    if (!control.value || !this.selectedType) {
      return null;
    }

    const value = control.value.toString();

    if (this.selectedType === 1) {
      if (/^\d{14}$/.test(value)) {
        return null;
      } else {
        return { invalidEconomicNumber: true };
      }
    } else if (this.selectedType === 2) {
      if (/^\d{11}$/.test(value)) {
        return null;
      } else {
        return { invalidEconomicNumber: true };
      }
    } else if (this.selectedType === 3) {
      if (/^\d{11}$/.test(value)) {
        return null;
      } else {
        return { invalidEconomicNumber: true };
      }
    } else if (this.selectedType === 4) {
      if (/^\d{14}$/.test(value)) {
        return null;
      } else {
        return { invalidEconomicNumber: true };
      }
    }

    return { invalidEconomicNumber: true };
  }


  onSubmit() {
    if (this.isCancelClicked) return;
    this.isSubmitted = true;

    const isMainBranch = this.addCustomer.get('isMainBranch')?.value;

    if (isMainBranch) {
      this.addCustomer.patchValue({
        BranchCode: '0000',
        BranchName: '0000',
      });
    }

    if (this.addCustomer.valid) {
      const formData = this.addCustomer.value;
      this.apiService.addCustomerWithId(formData).subscribe(response => {
        if (response.isSuccess) {
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








