import type { Department } from './department';

export interface Employee {
  _id?: string;                     // opcional en el cliente
  name: string;                     // required
  lastName1: string;                // required
  lastName2: string;                // required
  dept_code: number;                // required (numérico del depto)
  // Si el backend hace populate, puede venir el objeto Department;
  // si no, suele venir el id (string). Lo dejamos como unión:
  department?: string | Department; // ref opcional
}

// Útiles para requests (crear/actualizar)
export type EmployeeCreateDTO =
  Omit<Employee, '_id' | 'department'> & { department?: string };

export type EmployeeUpdateDTO = Partial<EmployeeCreateDTO>;