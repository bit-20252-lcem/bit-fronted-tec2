import { Routes } from '@angular/router';
import { EmpleadosListComponent } from './pages/empleados-list/empleados-list';
import { EmpleadosFormComponent } from './components/empleados-form/empleados-form';
import { DeptUsuariosComponent } from './pages/dept-usuarios/dept-usuarios.component';

import { DepartamentosListComponent } from './pages/departamentos-list/departamentos-list';
import { DepartamentosFormComponent } from './components/departamentos-form/departamentos-form';

export const routes: Routes = [
  { path: '', redirectTo: 'reportes/dept-usuarios', pathMatch: 'full' },
  { path: 'reportes/dept-usuarios', component: DeptUsuariosComponent, title: 'Departamentos y Usuarios' },
     { path: 'empleados', component: EmpleadosListComponent, title: 'Empleados' },
  { path: 'empleados/nuevo', component: EmpleadosFormComponent, title: 'Nuevo Empleado' },
  { path: 'empleados/:name/editar', component: EmpleadosFormComponent, title: 'Editar Empleado' },
  { path: 'departamentos', component: DepartamentosListComponent, title: 'Departamentos' },
  { path: 'departamentos/nuevo', component: DepartamentosFormComponent, title: 'Nuevo Departamento' },
  { path: 'departamentos/:code/editar', component: DepartamentosFormComponent, title: 'Editar Departamento' },
  { path: '**', redirectTo: 'reportes/dept-usuarios' },
];