import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EventosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaEvento() {
    return {
      'nombre': '',
      'tipo': '',
      'fecha': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_objetivo': '',
      'programa_educativo': '',
      'responsable': '',
      'descripcion': '',
      'cupo': null
    }
  }

  // --- VALIDACIONES ---
  public validarEvento(data: any) {
    console.log("Validando evento... ", data);
    let error: any = [];

    //Nombre
    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = this.errorService.required;
    } else if (!this.validatorService.alphaNumeric(data["nombre"])) {
      error["nombre"] = "Solo se permiten letras, números y espacios";
    }

    //Tipo
    if (!this.validatorService.required(data["tipo"])) {
      error["tipo"] = this.errorService.required;
    }

    //Fecha
    if (!this.validatorService.required(data["fecha"])) {
      error["fecha"] = this.errorService.required;
    } else {
      const fechaIngresada = new Date(data["fecha"]).setHours(0,0,0,0);
      const hoy = new Date().setHours(0,0,0,0);
      if (fechaIngresada < hoy) {
        error["fecha"] = "La fecha no puede ser anterior al día de hoy";
      }
    }

    //Horario
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = this.errorService.required;
    }
    if (data["hora_inicio"] && data["hora_fin"]) {
        if (data["hora_inicio"] >= data["hora_fin"]) {
            error["hora_fin"] = "La hora final debe ser mayor a la inicial";
        }
    }

    //Lugar
    if (!this.validatorService.required(data["lugar"])) {
      error["lugar"] = this.errorService.required;
    } else if (!this.validatorService.alphaNumeric(data["lugar"])) {
       error["lugar"] = "Solo caracteres alfanuméricos y espacios";
    }

    // Publico Objetivo
    if (!this.validatorService.required(data["publico_objetivo"])) {
      error["publico_objetivo"] = "Selecciona al menos un público";
    }

    //Programa Educativo
    if (data["publico_objetivo"] && data["publico_objetivo"].includes("Estudiantes")) {
        if (!this.validatorService.required(data["programa_educativo"])) {
            error["programa_educativo"] = this.errorService.required;
        }
    }

    //Responsable
    if (!this.validatorService.required(data["responsable"])) {
      error["responsable"] = this.errorService.required;
    }

    //Descripción
    if (!this.validatorService.required(data["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    } else if (!this.validatorService.max(data["descripcion"], 300)) {
        error["descripcion"] = this.errorService.max(300);
    }

    //Cupo
    if (!this.validatorService.required(data["cupo"])) {
      error["cupo"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["cupo"])) {
      error["cupo"] = this.errorService.numeric;
    } else {
        const cupoNum = Number(data["cupo"]);
        if (cupoNum <= 0) error["cupo"] = "Debe ser mayor a 0";
        if (cupoNum > 999) error["cupo"] = "Máximo 3 dígitos";
    }

    return error;
  }

  private getHeaders(): HttpHeaders {
    const token = this.facadeService.getSessionToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  public registrarEvento(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, { headers: this.getHeaders() });
  }

  public obtenerEventos(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, { headers: this.getHeaders() });
  }

  public obtenerEventoPorID(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/eventos/${id}/`, { headers: this.getHeaders() });
  }

  public actualizarEvento(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/eventos/${id}/`, data, { headers: this.getHeaders() });
  }

  public eliminarEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/eventos/${id}/`, { headers: this.getHeaders() });
  }


}
