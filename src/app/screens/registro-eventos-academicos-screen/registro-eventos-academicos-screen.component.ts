import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarEventoModalComponent } from 'src/app/modals/editar-evento-modal/editar-evento-modal.component';

@Component({
  selector: 'app-registro-eventos-academicos-screen',
  templateUrl: './registro-eventos-academicos-screen.component.html',
  styleUrls: ['./registro-eventos-academicos-screen.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }]
})
export class RegistroEventosAcademicosScreenComponent implements OnInit {

  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idEvento: number = 0;

  public usersList: any[] = [];
  public fechaActual = new Date();

  constructor(
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.evento = this.eventosService.esquemaEvento();

    // 1. Cargar lista de responsables (Admins + Maestros)
    this.obtenerUsuariosParaSelect();

    // 2. Verificar si es edición (si hay ID en la URL)
    if (this.route.snapshot.params['id']) {
      this.editar = true;
      this.idEvento = this.route.snapshot.params['id'];
      // Cargar datos del evento
      this.obtenerEventoPorId();
    }
  }

  // --- CARGA DE DATOS ---

  public obtenerUsuariosParaSelect() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (admins: any) => {
        const listaAdmins = admins.map((a: any) => ({
            id: a.user.id,
            first_name: a.user.first_name,
            last_name: a.user.last_name,
            rol: 'Administrador'
        }));

        this.maestrosService.obtenerListaMaestros().subscribe(
          (maestros: any) => {
            const listaMaestros = maestros.map((m: any) => ({
                id: m.user.id,
                first_name: m.user.first_name,
                last_name: m.user.last_name,
                rol: 'Maestro'
            }));
            this.usersList = [...listaAdmins, ...listaMaestros];
          },
          (error) => { console.error("Error al obtener maestros", error); }
        );
      },
      (error) => { console.error("Error al obtener admins", error); }
    );
  }

  public obtenerEventoPorId() {
    this.eventosService.obtenerEventoPorID(this.idEvento).subscribe(
      (response: any) => {
        this.evento = response;

        // 1. Convertir fecha string a objeto Date para el datepicker
        if (this.evento.fecha) {
            this.evento.fecha = new Date(this.evento.fecha + 'T00:00:00');
        }

        // 2. Formatear Horas (Quitar segundos que envía Django)
        // Recibimos "10:00:00" -> Convertimos a "10:00"
        if(this.evento.hora_inicio && this.evento.hora_inicio.length > 5){
            this.evento.hora_inicio = this.evento.hora_inicio.slice(0, 5);
        }
        if(this.evento.hora_fin && this.evento.hora_fin.length > 5){
            this.evento.hora_fin = this.evento.hora_fin.slice(0, 5);
        }
      },
      (error) => {
        alert("No se pudo obtener la información del evento");
        this.location.back();
      }
    );
  }

  // --- MANEJO DE FORMULARIO ---

  public regresar() {
    this.location.back();
  }

  // Permite letras, números, espacios y acentos
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&  // A-Z
      !(charCode >= 97 && charCode <= 122) && // a-z
      !(charCode >= 48 && charCode <= 57) &&  // 0-9
      charCode !== 32 && // Espacio
      charCode !== 241 && charCode !== 209 && // ñ, Ñ
      charCode !== 193 && charCode !== 201 && charCode !== 205 && charCode !== 211 && charCode !== 218 && // ÁÉÍÓÚ
      charCode !== 225 && charCode !== 233 && charCode !== 237 && charCode !== 243 && charCode !== 250    // áéíóú
    ) {
      event.preventDefault();
    }
  }

  public hasPublico(opcion: string): boolean {
    if (!this.evento.publico_objetivo) return false;
    return this.evento.publico_objetivo.includes(opcion);
  }

  public checkboxChange(event: any, opcion: string) {
    let actuales = this.evento.publico_objetivo ? this.evento.publico_objetivo.split(',') : [];
    actuales = actuales.filter((x: string) => x.trim() !== '');

    if (event.checked) {
      if (!actuales.includes(opcion)) actuales.push(opcion);
    } else {
      const index = actuales.indexOf(opcion);
      if (index > -1) actuales.splice(index, 1);
    }
    this.evento.publico_objetivo = actuales.join(',');

    if (!this.esParaEstudiantes()) {
      this.evento.programa_educativo = null;
    }
  }

  public esParaEstudiantes(): boolean {
    return this.hasPublico('Estudiantes');
  }

  // --- ACCIONES CRUD ---

  public registrar() {
    // 1. Validar
    this.errors = this.eventosService.validarEvento(this.evento);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // 2. Preparar datos
    const dataToSend = { ...this.evento };
    if (dataToSend.fecha instanceof Date) {
        dataToSend.fecha = dataToSend.fecha.toISOString().split('T')[0];
    }
    dataToSend.cupo = Number(dataToSend.cupo);

    // 3. Enviar
    this.eventosService.registrarEvento(dataToSend).subscribe(
      (response) => {
        alert("Evento registrado correctamente");
        this.router.navigate(['/eventos-lista']);
      },
      (error) => {
        alert("Ocurrió un error al registrar el evento");
      }
    );
    return true;
  }

  public actualizar() {
    // 1. Validar primero
    this.errors = this.eventosService.validarEvento(this.evento);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // 2. Abrir Modal de Confirmación
    const dialogRef = this.dialog.open(EditarEventoModalComponent, {
      height: '288px',
      width: '328px',
      data: {}
    });

    // 3. Esperar confirmación del usuario
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isConfirmed) {

        // 4. Preparar datos y enviar al backend
        const dataToSend = { ...this.evento };
        if (dataToSend.fecha instanceof Date) {
            dataToSend.fecha = dataToSend.fecha.toISOString().split('T')[0];
        }
        dataToSend.cupo = Number(dataToSend.cupo);

        this.eventosService.actualizarEvento(this.idEvento, dataToSend).subscribe(
          (response) => {
            alert("Evento actualizado correctamente");
            this.router.navigate(['/eventos-lista']);
          },
          (error) => {
            alert("Ocurrió un error al actualizar el evento");
            console.error(error);
          }
        );
      }
    });

    return true;
  }
}
