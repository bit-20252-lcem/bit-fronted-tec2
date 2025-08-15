import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { EmployeeService } from '../../services/employee.service';
import type { Employee } from '../../interfaces/empoyee';

@Component({
  standalone: true,
  selector: 'app-empleados-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './empleados-list.html',
  styleUrls: ['./empleados-list.css']
})
export class EmpleadosListComponent implements OnInit {
  private empSvc = inject(EmployeeService);

  loading = false;
  search = '';
  employees: Employee[] = [];
  skeleton = Array.from({ length: 6 });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.empSvc.list().subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: (err) => { this.loading = false; Swal.fire('Error', err?.error?.message ?? 'No se pudieron cargar los empleados', 'error'); }
    });
  }

  get filtered(): Employee[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.employees;
    return this.employees.filter(e =>
      `${e.name} ${e.lastName1} ${e.lastName2}`.toLowerCase().includes(q)
      || String(this.getDeptCode(e)).includes(q)
      || (this.getDeptName(e).toLowerCase().includes(q))
    );
  }

  getDeptCode(e: Employee): number | null {
    if (e && typeof e.department === 'object' && e.department && 'code' in e.department) {
     
      return e.department.code as number;
    }
    return e.dept_code ?? null;
  }

  getDeptName(e: Employee): string {
    if (e && typeof e.department === 'object' && e.department && 'name' in e.department) {
      
      return e.department.name as string;
    }
    return '';
  }

  confirmDelete(e: Employee) {
    Swal.fire({
      title: `Eliminar ${e.name}?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(res => {
      if (res.isConfirmed) {
        this.empSvc.deleteByName(e.name).subscribe({
          next: () => { Swal.fire('Eliminado', 'Empleado eliminado', 'success'); this.load(); },
          error: (err) => Swal.fire('Error', err?.error?.message ?? 'No se pudo eliminar', 'error')
        });
      }
    });
  }

  trackSk = (i: number) => i;
  trackEmp = (_: number, e: Employee) => e._id ?? `${e.name}-${e.dept_code}`;
}