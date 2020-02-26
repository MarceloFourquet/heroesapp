import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HeroeModel } from '../../model/heroe.model';
import { HeroesService } from '../../services/heroes.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit {

  heroe: HeroeModel;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.heroe = new HeroeModel();
   }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if ( id !== 'nuevo' ) {
      this.heroesService
        .getHeroe( id )
        .subscribe( ( resp: HeroeModel ) => {
          this.heroe = resp;
          this.heroe.id = id;
      });
    }
  }

  guardar( form: NgForm ) {
    if ( form.invalid ) {
      console.log( 'Formulario no válido' );
      return;
    }
    Swal.fire({
      title: 'Espera',
      text: 'Guardando la información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if  ( this.heroe.id ) {
      peticion = this.heroesService.actualizarHeroe( this.heroe );
    } else {
      peticion = this.heroesService.crearHeroe( this.heroe );
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizo correctamente',
        icon: 'success'
      });
    });
  }

}
