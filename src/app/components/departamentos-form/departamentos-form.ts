import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DepartmentService } from '../../services/department.service';
import type { Department } from '../../interfaces/department';

@Component({
  standalone: true,
  selector: 'app-departamentos-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departamentos-form.html',
  styleUrls: ['./departamentos-form.css']
})
export class DepartamentosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deptSvc = inject(DepartmentService);

  loading = false;
  isEdit = false;
  originalCode: number | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    code: this.fb.control<number | null>(null, { validators: [Validators.required] })
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const codeParam = params.get('code');
      this.isEdit = !!codeParam;
      if (this.isEdit && codeParam) {
        const code = Number(codeParam);
        if (Number.isNaN(code)) return;
        this.originalCode = code;
        this.loading = true;
        this.deptSvc.getByCode(code).subscribe({
          next: (d) => {
            this.form.reset({ name: d.name, code: d.code });
            this.loading = false;
          },
          error: (err) => { this.loading = false; Swal.fire('Error', err?.error?.message ?? 'No se pudo cargar el departamento', 'error'); }
        });
      }
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    if (v.code == null) {
      this.form.controls.code.markAsTouched();
      Swal.fire('Validación', 'Ingresa el código', 'warning');
      return;
    }

    const payload = { name: v.name.trim(), code: Number(v.code) };
    this.loading = true;

    const req$ = this.isEdit && this.originalCode != null
      ? this.deptSvc.updateByCode(this.originalCode, payload)
      : this.deptSvc.create(payload);

    req$.subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Éxito', 'Departamento guardado correctamente', 'success');
        this.router.navigate(['/departamentos']);
      },
      error: (err) => { this.loading = false; Swal.fire('Error', err?.error?.message ?? 'No se pudo guardar el departamento', 'error'); }
    });
  }

  cancel() { this.router.navigate(['/departamentos']); }
}