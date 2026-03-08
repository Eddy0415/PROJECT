import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../../../shared/interfaces/product';

export type ProductFormValue = Omit<IProduct, 'id' | 'rating'>;

@Component({
  selector: 'product-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form-modal.html',
  styleUrl: './product-form-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormModal implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly product = input<IProduct | null>(null); // null = add, product = edit
  readonly saved = output<ProductFormValue>();
  readonly cancelled = output<void>();

  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    title:       this.fb.nonNullable.control('',  [Validators.required]),
    price:       this.fb.nonNullable.control(0,   [Validators.required, Validators.min(0.01)]),
    category:    this.fb.nonNullable.control('',  [Validators.required]),
    description: this.fb.nonNullable.control('',  [Validators.required]),
    image:       this.fb.nonNullable.control('',  [Validators.required]),
  });

  get isEdit(): boolean { return !!this.product(); }

  ngOnInit(): void {
    const p = this.product();
    if (p) {
      this.form.patchValue({
        title: p.title, price: p.price, category: p.category,
        description: p.description, image: p.image,
      });
    }
  }

  err(control: FormControl): boolean {
    return this.submitted() && control.invalid;
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.saved.emit(this.form.getRawValue() as ProductFormValue);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
