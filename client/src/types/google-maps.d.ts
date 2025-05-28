// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panBy(x: number, y: number): void;
      setMapTypeId(mapTypeId: string): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
      getDiv(): Element;
      getMapTypeId(): string;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setIcon(icon: string | Icon | Symbol): void;
      setLabel(label: string | MarkerLabel): void;
      setDraggable(draggable: boolean): void;
      setVisible(visible: boolean): void;
      getPosition(): LatLng;
      getTitle(): string;
      getIcon(): string | Icon | Symbol;
      getLabel(): MarkerLabel;
      getDraggable(): boolean;
      getVisible(): boolean;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: MVCObject): void;
      close(): void;
      setContent(content: string | Node): void;
      setPosition(position: LatLng | LatLngLiteral): void;
      setZIndex(zIndex: number): void;
      getContent(): string | Node;
      getPosition(): LatLng;
      getZIndex(): number;
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      styles?: any[];
      [k: string]: any;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      draggable?: boolean;
      visible?: boolean;
      animation?: Animation;
      [k: string]: any;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
      zIndex?: number;
      [k: string]: any;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
      toString(): string;
      toJSON(): LatLngLiteral;
      equals(other: LatLng): boolean;
      toUrlValue(precision?: number): string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBounds {
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toSpan(): LatLng;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MarkerLabel {
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      text: string;
    }

    interface Icon {
      url: string;
      anchor?: Point;
      labelOrigin?: Point;
      origin?: Point;
      scaledSize?: Size;
      size?: Size;
    }

    interface Symbol {
      path: SymbolPath | string;
      anchor?: Point;
      fillColor?: string;
      fillOpacity?: number;
      labelOrigin?: Point;
      rotation?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface Point {
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    interface Size {
      height: number;
      width: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2,
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2,
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4,
    }

    class MVCObject {
      addListener(eventName: string, handler: Function): MapsEventListener;
      bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
      get(key: string): any;
      notify(key: string): void;
      set(key: string, value: any): void;
      setValues(values: any): void;
      unbind(key: string): void;
      unbindAll(): void;
    }
  }
}
