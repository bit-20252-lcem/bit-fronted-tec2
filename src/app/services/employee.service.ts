import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Employee, EmployeeCreateDTO, EmployeeUpdateDTO } from '../interfaces/empoyee';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  
  private base = `${environment.apiUrl}/employee`;

  /** GET /employees -> lista con department populate */
  list(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.base);
  }

  /** GET /employees/:name -> 1 empleado (name es unique en tus endpoints) */
  getByName(name: string): Observable<Employee> {
    const safe = encodeURIComponent(name);
    return this.http.get<Employee>(`${this.base}/${safe}`);
  }

  /** POST /employees -> crea. Debe incluir: name, lastName1, lastName2, dept_code */
  create(payload: EmployeeCreateDTO): Observable<Employee> {
    return this.http.post<Employee>(`${this.base}/create`, payload);
  }

  /** PUT /employees/:name -> actualiza. Si mandas dept_code, el back resuelve department */
  updateByName(name: string, payload: EmployeeUpdateDTO): Observable<Employee> {
    const safe = encodeURIComponent(name);
    return this.http.put<Employee>(`${this.base}/${safe}`, payload);
  }

  /** DELETE /employees/:name -> elimina por nombre */
  deleteByName(name: string): Observable<{ message: string }> {
    const safe = encodeURIComponent(name);
    return this.http.delete<{ message: string }>(`${this.base}/${safe}`);
  }
}
