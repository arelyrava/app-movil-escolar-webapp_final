import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { ChartData } from 'chart.js';

@Component({
selector: 'app-graficas-screen',
templateUrl: './graficas-screen.component.html',
styleUrls: ['./graficas-screen.component.scss']
})

export class GraficasScreenComponent implements OnInit{

// Declaraciónes inicializadas para cada rol
public total_user: { admins: number, maestros: number, alumnos: number } = { admins: 0, maestros: 0, alumnos: 0 };


// Histograma
lineChartData: ChartData<'line'> = {
  labels: ["Administradores", "Maestros", "Alumnos"],
   datasets: [
      {
        data:[0, 0, 0], // Se inicializa en cero
        label: 'Total de Usuarios por Rol',
        backgroundColor: 'rgba(248, 132, 6, 0.7)',
        borderColor: '#F88406',
        pointBackgroundColor: '#F88406',
        pointBorderColor: '#fff',
        tension: 0.4,
      }
    ]
  }
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  // Barras
  barChartData: ChartData<'bar'> = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Total de Usuarios por Rol',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];

  // Circular
  pieChartData: ChartData<'pie'> = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:false
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  // Grafica de Dona
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:false
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Hacemos el consumo de la funcion para obtener el total de usuarios
  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response: { admins: number, maestros: number, alumnos: number })=>{
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);

        // Se crea un arrreglo con los datos obtenidos
        const userCounts = [
          this.total_user.admins,
          this.total_user.maestros,
          this.total_user.alumnos
        ];

        // Se actualizan las 4 graficas

        // Gráfica de Línea (Histograma)
        this.lineChartData.datasets[0].data = userCounts;
        this.lineChartData = { ...this.lineChartData };

        // Gráfica de Barras
        this.barChartData.datasets[0].data = userCounts;
        this.barChartData = { ...this.barChartData };

        // Gráfica Circular
        this.pieChartData.datasets[0].data = userCounts;
        this.pieChartData = { ...this.pieChartData };

        // Gráfica de Dona
        this.doughnutChartData.datasets[0].data = userCounts;
        this.doughnutChartData = { ...this.doughnutChartData };


      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

}
