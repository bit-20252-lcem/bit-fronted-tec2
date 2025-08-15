import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { DepartmentService } from '../../services/department.service';
import type { Department } from '../../interfaces/department';

@Component({
  standalone: true,
  selector: 'app-departamentos-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './departamentos-list.html',
  styleUrls: ['./departamentos-list.css']
})
export class DepartamentosListComponent implements OnInit {
  private deptSvc = inject(DepartmentService);

  loading = false;
  search = '';
  departments: Department[] = [];
  skeleton = Array.from({ length: 6 });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.deptSvc.list().subscribe({
      next: (d) => { this.departments = d.sort((a,b) => a.code - b.code); this.loading = false; },
      error: (err) => { this.loading = false; Swal.fire('Error', err?.error?.message ?? 'No se pudieron cargar los departamentos', 'error'); }
    });
  }

  get filtered(): Department[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.departments;
    return this.departments.filter(d => d.name.toLowerCase().includes(q) || String(d.code).includes(q));
  }

  confirmDelete(d: Department) {
    Swal.fire({
      title: `Eliminar ${d.name}?`,
      text: 'No se puede deshacer. Si tiene empleados asociados, el servidor lo impedirá.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(res => {
      if (res.isConfirmed) {
        this.deptSvc.deleteByCode(d.code).subscribe({
          next: () => { Swal.fire('Eliminado', 'Departamento eliminado', 'success'); this.load(); },
          error: (err) => {
            const msg = err?.error?.message ?? 'No se pudo eliminar';
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }

  trackSk = (i: number) => i;
  trackDept = (_: number, d: Department) => d.code;
}