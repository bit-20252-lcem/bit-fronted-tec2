import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import type { Department } from '../../interfaces/department';
import type { Employee, EmployeeCreateDTO, EmployeeUpdateDTO } from '../../interfaces/empoyee';

@Component({
  standalone: true,
  selector: 'app-empleados-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empleados-form.html',
  styleUrls: ['./empleados-form.css']
})
export class EmpleadosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private empSvc = inject(EmployeeService);
  private deptSvc = inject(DepartmentService);

  loading = false;
  isEdit = false;
  originalName: string | null = null;
  departments: Department[] = [];

  // dept_code puede ser null en el formulario; lo validamos/casteamos al enviar
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    lastName1: ['', [Validators.required, Validators.maxLength(80)]],
    lastName2: ['', [Validators.required, Validators.maxLength(80)]],
    dept_code: this.fb.control<number | null>(null, { validators: [Validators.required] })
  });

    cancel() {
    this.router.navigate(['/empleados']); // navega directo a la lista
  }

  ngOnInit() {
    this.deptSvc.list().subscribe({
      next: (d) => this.departments = [...d].sort((a,b) => a.code - b.code),
      error: (err) => Swal.fire('Error', err?.error?.message ?? 'No se pudieron cargar los departamentos', 'error')
    });

    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      this.isEdit = !!name;
      this.originalName = name;
      if (this.isEdit && name) {
        this.loading = true;
        this.empSvc.getByName(name).subscribe({
          next: (emp) => {
            const code = this.getDeptCode(emp);
            this.form.reset({
              name: emp.name,
              lastName1: emp.lastName1,
              lastName2: emp.lastName2,
              dept_code: code,
            });
            this.loading = false;
          },
          error: (err) => { this.loading = false; Swal.fire('Error', err?.error?.message ?? 'No se pudo cargar el empleado', 'error'); }
        });
      }
    });
  }

  private getDeptCode(e: Employee): number | null {
    if (e && typeof e.department === 'object' && e.department && 'code' in e.department) {
      
      return e.department.code as number;
    }
    return e.dept_code ?? null;
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    if (v.dept_code == null) {
      // Evitar enviar null; el backend exige número
      this.form.controls.dept_code.markAsTouched();
      Swal.fire('Validación', 'Selecciona un departamento', 'warning');
      return;
    }

    // Construimos DTOs tipados, casteando dept_code a number
    const createDto: EmployeeCreateDTO = {
      name: v.name.trim(),
      lastName1: v.lastName1.trim(),
      lastName2: v.lastName2.trim(),
      dept_code: Number(v.dept_code),
    };

    const updateDto: EmployeeUpdateDTO = {
      name: v.name.trim(),
      lastName1: v.lastName1.trim(),
      lastName2: v.lastName2.trim(),
      dept_code: Number(v.dept_code),
    };

    this.loading = true;
    const req$ = this.isEdit && this.originalName
      ? this.empSvc.updateByName(this.originalName, updateDto)
      : this.empSvc.create(createDto);

    req$.subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Éxito', 'Empleado guardado correctamente', 'success');
        this.router.navigate(['/empleados']);
      },
      error: (err) => { this.loading = false; Swal.fire('Error', err?.error?.message ?? 'No se pudo guardar el empleado', 'error'); }
    });
  }
}