import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter , Input} from '@angular/core';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit  {
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Input() myLocation: any;
    @Input() pastLocation: any;
    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

    map: google.maps.Map;
    lat = null;
    lng = null;
    loading:boolean;
    selectedLocationName:string;
    showErrorPermession:boolean = false;
    constructor(private loderService: LoaderService) {}

    isDisplayLocation() {
      if(this.myLocation) {
        return true;
      }
      else {
        return false;
      }
    }

    ngAfterViewInit() {
      document.getElementById('pac-input').focus();
      if (navigator && !this.isDisplayLocation())
      {
      navigator.geolocation.getCurrentPosition( pos => {
          if(this.pastLocation && Number(this.pastLocation.lng)) {
            this.lng = this.pastLocation.lng;
            this.lat = this.pastLocation.lat;
          }
          else {
            this.lng = +pos.coords.longitude;
            this.lat = +pos.coords.latitude;
          }
          if(this.lat && this.lng) {
            this.mapInitializer();
          }
          else {
            this.lat = 32.0045056;
            this.lng = 35.9366656;
            this.mapInitializer();
          }
        });
      }
      else {
        this.lat = this.myLocation.lat;
        this.lng = this.myLocation.lng;
        if(this.lat && this.lng) {
          this.mapInitializer();
        }
      }

      this.getCoords().then((coords) => {
        if(!coords) {
          this.showErrorPermession = true
        }
      });
    }

    mapInitializer() {
      var me = this;
      let coordinates = new google.maps.LatLng(this.lat, this.lng);

      let mapOptions: google.maps.MapOptions = {
       center: coordinates,
       zoom: 14
      };
  
      let marker = new google.maps.Marker({
        position: coordinates,
        map: this.map,
        draggable: !this.isDisplayLocation()
      });

      this.map = new google.maps.Map(this.gmap.nativeElement, 
      mapOptions);
      marker.setMap(this.map);

      google.maps.event.addListener(marker, 'dragend', function(a) {
        // me.loderService.setIsLoading = true;
        me.lat = a.latLng.lat();
        me.lng = a.latLng.lng();
        var draggedL = a.latLng.lat() + ', ' + a.latLng.lng(); //Place the value in input box
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var options = {
        componentRestrictions: {country: 'jo'}
      };
      var searchBox = new google.maps.places.Autocomplete(input as HTMLInputElement, options);
      searchBox.addListener('place_changed', () => {
        let me = this;
        var place = searchBox.getPlace();
        if (!place) {
          return;
        }
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.mapInitializer();
      });
    }

    geocodeLatLng( map ) {
      var me = this;
      var input = this.lat+','+this.lng;
      var latlngStr = input.split(',', 2);
      var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (results && results.length > 1) {
          me.selectedLocationName = results[1].formatted_address;
        } else {
          me.selectedLocationName = 'عمان';
        }
      });
      setTimeout(() => {
        this.loderService.setIsLoading = false;
      }, 2000)
    }

    removeLoading() {
      // this.loderService.setIsLoading = true;
      setTimeout(() => {
        this.loderService.setIsLoading = false;
      }, 2000)
    }

    emmitLocation() {
      let obj = {lat:this.lat, lng: this.lng};
      this.change.emit(obj);
    }

    checkIchanged(event) {
      if(event.target.value !== this.selectedLocationName) {
        this.removeLoading();
      }
    }

    getCoords() {
      return new Promise((resolve, reject) =>
        navigator.permissions ?
    
          // Permission API is implemented
          navigator.permissions.query({
            name: 'geolocation'
          }).then(permission =>
            // is geolocation granted?
            permission.state === "granted"
              ? navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords)) 
              : resolve(null)
          ) :
    
        // Permission API was not implemented
        reject(new Error("Permission API is not supported"))
      )
    }
}
