import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-evento-modal',
  templateUrl: './editar-evento-modal.component.html',
  styleUrls: ['./editar-evento-modal.component.scss']
})
export class EditarEventoModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditarEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  // Se ejecuta al dar clic en la "X" o en "Cancelar"
  public cerrar_modal() {
    // Retornamos false para indicar que NO se confirmó la acción
    this.dialogRef.close({ isConfirmed: false });
  }

  // Se ejecuta al dar clic en el botón rojo "Editar"
  public confirmarEdicion() {
    // Retornamos true para indicar que SÍ se confirmó
    this.dialogRef.close({ isConfirmed: true });
  }
}
