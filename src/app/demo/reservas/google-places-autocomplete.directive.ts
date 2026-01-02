import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output } from '@angular/core';

import { GoogleMapsLoaderService } from './google-maps-loader.service';

declare const window: any;

export interface GooglePlaceSelection {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
  name: string;
}

@Directive({
  selector: '[appGooglePlacesAutocomplete]',
  standalone: true
})
export class GooglePlacesAutocompleteDirective implements AfterViewInit, OnDestroy {
  @Input() componentRestrictions: { country?: string } | undefined;
  @Input() types: string[] = ['establishment'];
  @Output() placeSelected = new EventEmitter<GooglePlaceSelection>();
  @Output() placeSelectionError = new EventEmitter<string>();

  private autocompleteElement: any;
  private placeListener: any;
  private originalDisplay?: string;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private zone: NgZone,
    private mapsLoader: GoogleMapsLoaderService
  ) {}

  ngAfterViewInit(): void {
    this.initAutocomplete();
  }

  ngOnDestroy(): void {
    if (this.autocompleteElement && this.placeListener) {
      this.autocompleteElement.removeEventListener('gmp-placeselect', this.placeListener);
    }
    if (this.originalDisplay !== undefined) {
      this.elementRef.nativeElement.style.display = this.originalDisplay;
    }
  }

  private initAutocomplete(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.mapsLoader
      .load()
      .then(() => {
        console.info('[PlacesAutocomplete] Loader resuelto. google?', !!window.google);
        const places = window.google?.maps?.places;
        if (!places) {
          console.error('[PlacesAutocomplete] google.maps.places no disponible');
          this.placeSelectionError.emit('Google Places no esta disponible.');
          return;
        }

        if (places.PlaceAutocompleteElement) {
          console.info('[PlacesAutocomplete] Usando PlaceAutocompleteElement (modo recomendado)');
          try {
            this.autocompleteElement = new places.PlaceAutocompleteElement();
            this.applyPlaceTheme(this.autocompleteElement);
            const descriptor = Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(this.autocompleteElement),
              'inputElement'
            );
            const canSetInput = !!descriptor?.set || descriptor?.writable;

            if (canSetInput) {
              this.autocompleteElement.inputElement = this.elementRef.nativeElement;
            } else {
              this.mountElementWithInternalInput();
            }
          } catch (error) {
            console.error('[PlacesAutocomplete] Error al inicializar PlaceAutocompleteElement', error);
            this.placeSelectionError.emit('No se pudo inicializar Google Places en este navegador.');
            return;
          }

          this.autocompleteElement.componentRestrictions = this.normalizeComponentRestrictions(
            this.componentRestrictions ?? { country: 'cr' }
          );
          this.autocompleteElement.types = this.types?.length ? this.types : ['establishment'];

          this.placeListener = (event: any) => {
            this.zone.run(() => this.handlePlaceSelected(event));
          };
          this.autocompleteElement.addEventListener('gmp-placeselect', this.placeListener);
          return;
        }

        // Autocomplete clasico ya no esta disponible para nuevos proyectos; emitimos error claro.
        console.error('[PlacesAutocomplete] PlaceAutocompleteElement no disponible y Autocomplete deshabilitado');
        this.placeSelectionError.emit('Google Places no esta disponible en este navegador o proyecto.');
        return;
      })
      .catch(error => {
        console.error('[PlacesAutocomplete] Error al cargar Google Maps', error);
        this.placeSelectionError.emit(typeof error === 'string' ? error : 'No se pudo cargar Google Maps.');
      });
  }

  private handlePlaceSelected(event: any): void {
    const place = event?.detail?.place;
    if (!place) {
      console.warn('[PlacesAutocomplete] Evento sin place');
      this.placeSelectionError.emit('Seleccione una opcion del listado de Google para obtener coordenadas.');
      return;
    }

    const location = place.location;
    const lat = typeof location?.lat === 'function' ? location.lat() : location?.lat;
    const lng = typeof location?.lng === 'function' ? location.lng() : location?.lng;

    if (lat === undefined || lng === undefined) {
      console.warn('[PlacesAutocomplete] Place sin coordenadas');
      this.placeSelectionError.emit('Seleccione una opcion del listado de Google para obtener coordenadas.');
      return;
    }

    this.placeSelectionError.emit('');

    this.placeSelected.emit({
      formattedAddress: place.formattedAddress ?? place.displayName ?? '',
      lat,
      lng,
      placeId: place.id ?? '',
      name: place.displayName ?? ''
    });
  }

  private applyPlaceTheme(element: HTMLElement): void {
    element.classList.add('places-autocomplete-themed');
    const style = (element as HTMLElement).style;
    style.setProperty('--gmpx-color-surface', '#ffffff');
    style.setProperty('--gmpx-color-on-surface', '#212529');
    style.setProperty('--gmpx-color-outline', '#d0d5db');
    style.setProperty('--gmpx-color-primary', '#0d6efd');
    style.setProperty('--gmpx-shadow-elevation-1', '0 6px 18px rgba(0, 0, 0, 0.08)');
    style.display = 'block';
    style.width = '100%';
    style.borderRadius = '12px';
  }

  private mountElementWithInternalInput(): void {
    // Para proyectos nuevos, Autocomplete clasico esta deshabilitado y algunos builds exponen inputElement como solo lectura.
    // En ese caso, insertamos el web component con su input interno y ocultamos el input original.
    const input = this.elementRef.nativeElement;
    const parent = input.parentElement;
    if (!parent) {
      console.error('[PlacesAutocomplete] No se pudo ubicar el input en el DOM');
      this.placeSelectionError.emit('No se pudo inicializar Google Places en este navegador.');
      return;
    }

    this.originalDisplay = input.style.display;
    input.style.display = 'none';

    const placeholder = input.getAttribute('placeholder') ?? '';
    if (placeholder) {
      this.autocompleteElement.setAttribute('placeholder', placeholder);
    }
    parent.insertBefore(this.autocompleteElement, input.nextSibling);
  }

  private normalizeComponentRestrictions(
    restrictions: { country?: string | string[] }
  ): { country?: string[] } | undefined {
    if (!restrictions?.country) {
      return undefined;
    }
    return { country: Array.isArray(restrictions.country) ? restrictions.country : [restrictions.country] };
  }

  private handlePlaceChanged(): void {
    // Metodo legado (Autocomplete clasico) eliminado porque ya no aplica para proyectos nuevos.
  }
}
