import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Department, DepartmentCreateDTO, DepartmentUpdateDTO } from '../interfaces/department';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/department`;

  /** GET /departments */
  list(): Observable<Department[]> {
    return this.http.get<Department[]>(this.base);
  }

  /** GET /departments/:code */
  getByCode(code: number): Observable<Department> {
    return this.http.get<Department>(`${this.base}/${code}`);
  }

  /** POST /departments { name, code } */
  create(payload: DepartmentCreateDTO): Observable<Department> {
    return this.http.post<Department>(this.base, payload);
  }

  /** PUT /departments/:code (usa code en la URL como clave) */
  updateByCode(code: number, payload: DepartmentUpdateDTO): Observable<Department> {
    return this.http.put<Department>(`${this.base}/${code}`, payload);
  }

  /** DELETE /departments/:code  (el back valida que no tenga empleados asociados) */
  deleteByCode(code: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${code}`);
  }
}
