import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';


interface ILayer
{
    getName() : string;
    getType() : string;
    getOlLayer() : any;

    addFeature(feature: any);
    getFeature(id: number) : any;
    removeFeature(id: number);
    getAllFeatures() : number[];

    getAttributes() : Array<[string, string]>;
    addAttribute(name: string, dtype: string);
    removeAttribute(name: string);

    setProperty(id: number, prop: string, value: any);
    getProperty(id: number, prop: string) : any;

    setGeometry(id: number, geom: any);
    getGeometry(id: number) : any;

    selectFeature(id: number);
    unselectFeature(id: number);
    isSelected(id: number) : boolean;
    unselectAll();
    getSelectedFeatures(): number[];

    getFeaturesIntersectingExtend(extend: any) : number[];
    getFeaturesInExtend(extend: any) : number[];
    getFeaturesAtCoordinate(coord: number[]) : number[];

    getVisibile() : boolean;
    setVisibile(visibile: boolean);
    getZIndex() : number;
    setZIndex(z_index: number);
}


export { ILayer }