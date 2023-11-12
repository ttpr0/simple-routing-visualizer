import { Map3D } from 'map/Map3D';

interface ILayer {
    getName(): string;
    setName(name: string);
    setMap(map: Map3D);
    getType(): string;

    getAllFeatures(): number[];
    getSelectedFeatures(): number[];

    selectFeature(id: number);
    selectFeatures(ids: number[]);
    unselectFeature(id: number);
    unselectFeatures(ids: number[]);
    isSelected(id: number): boolean;
    selectAll();
    unselectAll();

    getFeature(id: number): any;

    getAttributes(): Array<[string, string]>;
    addAttribute(name: string, dtype: string);
    removeAttribute(name: string);

    setProperty(id: number, prop: string, value: any);
    getProperty(id: number, prop: string): any;

    getGeometry(id: number): any;

    // getFeaturesInExtend(extend: any): number[];
    // getFeaturesAtCoordinate(coord: number[]): number[];

    getStyle(): any;
    setStyle(style: any);

    on(type: string, listener);
    un(type: string, listener);

    isOL(): boolean;
    isDeck(): boolean;
    getLayer(): any;
}

export { ILayer }