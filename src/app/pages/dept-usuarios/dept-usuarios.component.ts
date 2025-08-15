import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import type { Department } from '../../interfaces/department';
import type { Employee } from '../../interfaces/empoyee';

@Component({
  standalone: true,
  selector: 'app-dept-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './dept-usuarios.component.html',
  styleUrls: ['./dept-usuarios.component.css'],
})
export class DeptUsuariosComponent implements OnInit {
  private deptSvc = inject(DepartmentService);
  private empSvc = inject(EmployeeService);

  loading = false;
  departments: Department[] = [];
  employees: Employee[] = [];

  private index = new Map<number, Employee[]>();

  search = '';
  skeleton = Array.from({ length: 6 });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    forkJoin({
      departments: this.deptSvc.list(),
      employees: this.empSvc.list(), 
    }).subscribe({
      next: ({ departments, employees }) => {
        this.departments = [...departments].sort((a, b) => a.code - b.code);
        this.employees = employees;
        this.buildIndex();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', err?.error?.message ?? 'No se pudo cargar la información', 'error');
      },
    });
  }

  private buildIndex() {
    this.index.clear();
    for (const e of this.employees) {
      const code = this.getDeptCode(e);
      if (code == null) continue;
      if (!this.index.has(code)) this.index.set(code, []);
      this.index.get(code)!.push(e);
    }
    for (const [k, arr] of this.index) {
      this.index.set(k, [...arr].sort((a, b) => a.name.localeCompare(b.name)));
    }
  }

  private isPopulatedDepartment(d: unknown): d is Department {
    return !!d && typeof d === 'object' && 'code' in (d as any) && 'name' in (d as any);
  }

  private getDeptCode(e: Employee): number | null {
    if (this.isPopulatedDepartment(e.department)) return e.department.code;
    return e.dept_code ?? null;
  }

  getDeptLabel(e: Employee): string {
    const code = this.getDeptCode(e);
    if (this.isPopulatedDepartment(e.department)) return `${code} - ${e.department.name}`;
    return `${code}`;
  }

  byDept(code: number): Employee[] {
    return this.index.get(code) ?? [];
  }

  get filteredDepartments(): Department[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.departments;
    return this.departments.filter(d =>
      d.name.toLowerCase().includes(q) || String(d.code).includes(q)
    );
  }

  // trackBys
  trackSk = (i: number) => i;
  trackDept = (_: number, d: Department) => d.code;
  trackEmp = (_: number, e: Employee) => e._id ?? `${e.name}-${e.dept_code}`;
}
