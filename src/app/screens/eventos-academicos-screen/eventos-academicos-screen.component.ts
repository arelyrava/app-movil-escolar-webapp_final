import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosService } from 'src/app/services/eventos.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-eventos-academicos-screen',
  templateUrl: './eventos-academicos-screen.component.html',
  styleUrls: ['./eventos-academicos-screen.component.scss']
})
export class EventosAcademicosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_eventos: any[] = [];

  // Columnas que se mostrarán en la tabla
  public displayedColumns: string[] = [
    'nombre',
    'tipo',
    'fecha',
    'horario',
    'lugar',
    'responsable_nombre',
    'cupo',
    'editar',
    'eliminar'
  ];

  public dataSource = new MatTableDataSource<any>(this.lista_eventos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public facadeService: FacadeService,
    public eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // 1. Obtener datos del usuario logueado
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // 2. Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    if(this.token == ""){
      this.router.navigate(["/"]);
    }

    // 3. Regla de Negocio: Si NO es Admin, ocultar acciones
    if(this.rol !== 'Administrador'){
        // Filtramos para quitar las columnas de editar y eliminar
        this.displayedColumns = this.displayedColumns.filter(c => c !== 'editar' && c !== 'eliminar');
    }

    // 4. Cargar la lista de eventos
    this.obtenerEventos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredicate();
  }

  // Configuración del filtro personalizado (Nombre o Tipo)
  private setFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
        const dataStr = (data.nombre + ' ' + data.tipo).toLowerCase();
        return dataStr.includes(filter);
    };
  }

  // Aplicar filtro al escribir en el input
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // --- SERVICIOS ---

  // Obtener lista desde el Backend
  public obtenerEventos() {
    this.eventosService.obtenerEventos().subscribe(
      (response: any) => {
        console.log("Respuesta completa del backend:", response);

        // Manejo de respuesta paginada de Django (results) o array directo
        if (response.results) {
            this.lista_eventos = response.results;
        } else {
            this.lista_eventos = response;
        }

        if (this.lista_eventos.length > 0) {
          this.dataSource.data = this.lista_eventos;

          // Refrescar paginador y ordenamiento después de cargar datos
          setTimeout(() => {
            if(this.paginator) this.dataSource.paginator = this.paginator;
            if(this.sort) this.dataSource.sort = this.sort;
          });
        }
      },
      (error) => {
        console.error("Error al obtener eventos: ", error);
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }


  public goEditar(idEvento: number) {
    this.router.navigate(["eventos-registro/" + idEvento]);
  }

  // Eliminar evento usando el modal
  public delete(idEvento: number) {
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: {
        id: idEvento,
        rol: 'evento'
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isDelete) {

        alert("Evento eliminado correctamente");
        this.obtenerEventos();
      }
    });
  }
}
