import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MatSort } from '@angular/material/sort';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];

  // Para la tabla
   displayedColumns: string[] = [
    'matricula',
    'first_name',
    'last_name',
    'email',
    'fecha_nacimiento',
    'curp',
    'rfc',
    'edad',
    'telefono',
    'ocupacion',
    'editar',
    'eliminar'
  ];
  dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredicate();
    }

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    // Validar que haya inicio de sesión
    // Obtener el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }

    // Obtener alumnos
    this.obtenerAlumnos();
  }


  private setFilterPredicate() {
    this.dataSource.filterPredicate = (data: DatosAlumno, filter: string) => {
        const dataStr = (data.first_name + ' ' + data.last_name).toLowerCase();
        return dataStr.includes(filter);
    };
  }

  // FUNCIÓN AGREGADA PARA EL FILTRADO
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Consumimos el servicio para obtener la lista de alumnos
  //obtner alumnos
  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach(alumno => {
            // agregar datos del nombre e email
            alumno.first_name = alumno.user.first_name;
            alumno.last_name = alumno.user.last_name;
            alumno.email = alumno.user.email;
          });



        if (this.dataSource) {
          this.dataSource.data = this.lista_alumnos as DatosAlumno[];
        } else {
          this.dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);
        }

        // Revinvulamos el paginator y el sort después de asignar los datos
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });


        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'first_name': return item.first_name?.toLowerCase() || '';
            case 'last_name': return item.last_name?.toLowerCase() || '';
            case 'email': return item.email?.toLowerCase() || '';
            default: return item[property];
          }
        };

        this.setFilterPredicate();
      }

      }, (error) => {
        console.error("Error al obtener la lista de alumnos: ", error);
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/alumnos/" + idUser]);
  }

  public delete(idUser: number) {
    const userIdSession = Number(this.facadeService.getUserId());

    // Administrador puede eliminar cualquier alumno
    //alumno solo puede eliminar su propio registro
    if (this.rol === 'Administrador' || (this.rol === 'alumno' && userIdSession === idUser)) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'alumno'},
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.isDelete){
          console.log("Alumno eliminado");
          alert("Alumno eliminado correctamente");
          window.location.reload();
        }// Aquí puedes manejar cualquier acción después de cerrar el modal, si es necesario
      });
    }else{
      alert("No tienes permiso para eliminar este alumno.");
    }

  }
}
//Esto va fuera de la llave que cierra la clase
export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
