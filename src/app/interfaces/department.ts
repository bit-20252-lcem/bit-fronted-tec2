export interface Department {
  _id?: string;      // Mongoose agrega _id; lo marcamos opcional
  name: string;      // required
  code: number;      // required, único
}

// Útiles para requests
export type DepartmentCreateDTO = Omit<Department, '_id'>;
export type DepartmentUpdateDTO = Partial<DepartmentCreateDTO>;