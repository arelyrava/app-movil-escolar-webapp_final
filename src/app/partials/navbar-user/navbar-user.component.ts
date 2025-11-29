import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  // Control para el menu dropdown
  public expandedMenu: string | null = null;

  public userInitial: string = '';
  public isMobileView: boolean = window.innerWidth <= 992;
  public showUserMenu: boolean = false;
  public mobileOpen: boolean = false;
  public userRole: string = '';

  // Configuración de Paleta
  paletteMode: 'light' | 'dark' = 'light';
  colorPalettes = {
    light: {
      '--background-main': '#f4f7fb',
      '--sidebar-bg': '#23395d',
      '--navbar-bg': '#fff',
      '--text-main': '#222',
      '--table-bg': '#fff',
      '--table-header-bg': '#cfe2ff',
    },
    dark: {
      '--background-main': '#181a1b',
      '--sidebar-bg': '#1a2636',
      '--navbar-bg': '#222',
      '--text-main': '#e4ecfa',
      '--table-bg': '#222',
      '--table-header-bg': '#30507a',
    }
  };

  constructor(private router: Router, private facadeService: FacadeService) {
    const name = this.facadeService.getUserCompleteName();
    if (name && name.length > 0) {
      this.userInitial = name.trim()[0].toUpperCase();
    } else {
      this.userInitial = '?';
    }

    this.userRole = this.facadeService.getUserGroup();

    // Listener inicial
    this.onResize();

    // Tema por defecto
    this.applyPalette();
  }

  ngOnInit(): void {}

  applyPalette() {
    const palette = this.colorPalettes[this.paletteMode];
    Object.keys(palette).forEach(key => {
      document.documentElement.style.setProperty(key, palette[key]);
    });
  }

  togglePalette() {
    this.paletteMode = this.paletteMode === 'light' ? 'dark' : 'light';
    this.applyPalette();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth <= 992;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar() {
    this.mobileOpen = false;
  }

  // Lógica del Dropdown
  toggleMenu(menu: string) {
    if (this.expandedMenu === menu) {
        this.expandedMenu = null;
    } else {
        this.expandedMenu = menu;
    }
  }

  logout() {
    this.facadeService.logout().subscribe(
      () => {
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      () => {
        // Fallback en caso de error
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // --- PERMISOS DE ROL ---

  isAdmin(): boolean {

    return this.userRole?.toLowerCase() === 'administrador';
  }

  isTeacher(): boolean {
    return this.userRole?.toLowerCase() === 'maestro';
  }

  isStudent(): boolean {
    return this.userRole?.toLowerCase() === 'alumno';
  }

  canSeeAdminItems(): boolean {
    return this.isAdmin();
  }

  canSeeTeacherItems(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeStudentItems(): boolean {
    return this.isAdmin() || this.isTeacher() || this.isStudent();
  }

  canSeeRegisterItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }
}
