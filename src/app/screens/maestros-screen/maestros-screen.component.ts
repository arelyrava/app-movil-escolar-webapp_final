import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-maestros-screen',
  templateUrl: './maestros-screen.component.html',
  styleUrls: ['./maestros-screen.component.scss']
})
export class MaestrosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_maestros: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['id_trabajador', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'cubiculo', 'area_investigacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_maestros as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredicate();
  }

  constructor(
    public facadeService: FacadeService,
    public maestrosService: MaestrosService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    //Obtener maestros
    this.obtenerMaestros();
  }


  private setFilterPredicate() {
    this.dataSource.filterPredicate = (data: DatosUsuario, filter: string) => {
        // Combina Nombre y Apellido para buscar en ambos campos
        const dataStr = (data.first_name + ' ' + data.last_name).toLowerCase();
        return dataStr.includes(filter);
    };
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Se aplica el filtro en minúsculas y se limpian espacios al inicio/fin
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Al filtrar, se asegura que la tabla vuelva a la primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Consumimos el servicio para obtener los maestros
  //Obtener maestros
  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        console.log("Lista users: ", this.lista_maestros);
        if (this.lista_maestros.length > 0) {
          //Agregar datos del nombre e email
          this.lista_maestros.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Maestros: ", this.lista_maestros);

          if (this.dataSource) {
                    this.dataSource.data = this.lista_maestros as DatosUsuario[];
                  } else {
                    this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_maestros as DatosUsuario[]);
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
        console.error("Error al obtener la lista de maestros: ", error);
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/maestros/" + idUser]);
  }

  public delete(idUser: number) {
    // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
    const userIdSession = Number(this.facadeService.getUserId());
    // --------- Pero el parametro idUser (el de la función) es el ID del maestro que se quiere eliminar ---------
    // Administrador puede eliminar cualquier maestro
    // Maestro solo puede eliminar su propio registro
    if (this.rol === 'Administrador' || (this.rol === 'maestro' && userIdSession === idUser)) {
      //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'maestro'}, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Maestro eliminado");
        alert("Maestro eliminado correctamente.");
        //Recargar página
        window.location.reload();
      }else{
        alert("Maestro no se ha podido eliminar.");
        console.log("No se eliminó el maestro");
      }
    });
    }else{
      alert("No tienes permisos para eliminar este maestro.");
    }
  }

}

//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  telefono: string,
  rfc: string,
  cubiculo: string,
  area_investigacion: number,
}

