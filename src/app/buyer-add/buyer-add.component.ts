import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-buyer-add',
  templateUrl: './buyer-add.component.html',
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
      name: [''],
      brandName: [''],
      economicNumber: ['', Validators.required],
      nationalId: [''],
      moblie: [''],
      branchCountry: [''],
      branchProvince: [''],
      branchCity: [''],
      branchAddress: [''],
      isMainBranch: [false],
      branchCode: ['',Validators.required],
      branchName: ['',Validators.required],
      passportNumber: [''],
      branchPostalCode: [''],
      email: [''],
      status: [0],
    });

    this.addCustomer.valueChanges.subscribe(() => {
      this.isFormFilled = this.addCustomer.dirty && !this.addCustomer.invalid;
    });
  }


  ngOnInit(): void {

    const url = 'http://172.18.70.15:91/api/v1/metadata/economicactivisttype?userid=4Ow5Fn';
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
          branchCode: '0000',
          branchName: 'شعبه مرکزی',
        });
        this.addCustomer.get('branchCode')?.disable();
        this.addCustomer.get('branchName')?.disable();
        this.addCustomer.get('branchCountry')?.disable();
        this.addCustomer.get('branchProvince')?.disable();
        this.addCustomer.get('branchCity')?.disable();
        this.addCustomer.get('branchAddress')?.disable();



      } else {
        this.addCustomer.get('branchCode')?.enable();
        this.addCustomer.get('branchName')?.enable();
        this.addCustomer.get('branchCountry')?.enable();
        this.addCustomer.get('branchProvince')?.enable();
        this.addCustomer.get('branchCity')?.enable();
        this.addCustomer.get('branchAddress')?.enable();


        this.addCustomer.patchValue({
          branchCode: '',
          branchName: '',
        });
      }
    });

    this.addCustomer.get('type')?.valueChanges.subscribe((selectedValue) => {
      this.selectedType = selectedValue;
      this.addCustomer.get('economicNumber')?.updateValueAndValidity();
    });

    this.addCustomer.get('type')?.valueChanges.subscribe(selectedValue => {
      console.log('Selected type:', selectedValue); // Debugging
      this.selectedType = selectedValue;
      this.manageFormFields(this.selectedType);
      this.addCustomer.get('economicNumber')?.updateValueAndValidity();
    });

    this.manageFormFields(this.selectedType);
  }

  manageFormFields(selectedType: number) {
    console.log('Managing form fields for type:', selectedType); // Debugging 

    const nameControl = this.addCustomer.get('name');
    const brandNameControl = this.addCustomer.get('brandName');
    const nationalIdControl = this.addCustomer.get('nationalId');
  
    nameControl?.clearValidators();
    brandNameControl?.clearValidators();
    nationalIdControl?.clearValidators();
  
    if (selectedType === 1) {
      nameControl?.setValidators([Validators.required]);
      nationalIdControl?.setValidators([Validators.required]);
    } else if (selectedType === 2) {
      brandNameControl?.setValidators([Validators.required]);
    } else if (selectedType === 3) {
      nameControl?.setValidators([Validators.required]);
    }
  
    nameControl?.updateValueAndValidity();
    brandNameControl?.updateValueAndValidity();
    nationalIdControl?.updateValueAndValidity();
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


  // economicNumberValidator(control: any) {
  //   if (!control.value || !this.selectedType) {
  //     return null;
  //   }

  //   const value = control.value.toString();

  //   if (this.selectedType === 1) {
  //     if (/^\d{14}$/.test(value)) {
  //       return null;
  //     } else {
  //       return { invalidEconomicNumber: true };
  //     }
  //   } else if (this.selectedType === 2) {
  //     if (/^\d{11}$/.test(value)) {
  //       return null;
  //     } else {
  //       return { invalidEconomicNumber: true };
  //     }
  //   } else if (this.selectedType === 3) {
  //     if (/^\d{11}$/.test(value)) {
  //       return null;
  //     } else {
  //       return { invalidEconomicNumber: true };
  //     }
  //   } else if (this.selectedType === 4) {
  //     if (/^\d{14}$/.test(value)) {
  //       return null;
  //     } else {
  //       return { invalidEconomicNumber: true };
  //     }
  //   }

  //   return { invalidEconomicNumber: true };
  // }

  onSubmit() {
    
    if (this.isCancelClicked) return;
    this.isSubmitted = true;

    const isMainBranch = this.addCustomer.get('isMainBranch')?.value;

    if (isMainBranch) {
      this.addCustomer.patchValue({
        branchCode: '0000',
        branchName: 'شعبه مرکزی',
      });
    }

    this.addCustomer.get('name')?.updateValueAndValidity();
    this.addCustomer.get('brandName')?.updateValueAndValidity();
    this.addCustomer.get('nationalId')?.updateValueAndValidity();

    if (this.addCustomer.valid) {
      const formData = this.addCustomer.value;
      console.log('Submitting form data:', formData);
      this.apiService.addCustomerWithId(formData).subscribe(response => {
        if (response) {
          this.apiService.showNotification('داده‌ها با موفقیت ارسال شدند', 'success');
          this.resetForm();
        } else {
          console.error('Response was empty or invalid:', response); 
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








