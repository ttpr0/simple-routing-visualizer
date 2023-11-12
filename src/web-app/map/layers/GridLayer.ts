import { GridCellLayer } from '@deck.gl/layers';
import { ILayer } from './ILayer';
import { Map3D } from 'map/Map3D';
import { IGridStyle, GridStyle } from '/map/styles/GridStyle';

class GridLayer implements ILayer {
    map: Map3D;

    features: any[];
    cell_size: number;
    changed: any;

    name: any;
    style: IGridStyle;

    constructor(features, name, cell_size, style = null) {
        this.name = name;
        this.features = features;
        this.cell_size = cell_size;
        if (style === null) {
            this.style = new GridStyle("first", [255, 125, 0, 255], [0, 125, 255, 255], [100, 300, 600, 1000, 1600, 2400, 3600]);
        } else {
            this.style = style;
        }
        this.changed = { id: 10 };
    }

    getName(): string {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
    setMap(map: Map3D) {
        this.map = map;
    }
    getType(): string {
        return "Grid";
    }

    getAllFeatures(): number[] {
        let ids = [];
        for (let i = 0; i < this.features.length; i++) {
            ids.push(i);
        }
        return ids;
    }
    getSelectedFeatures(): number[] {
        return [];
    }
    selectFeature(id: number) { }
    selectFeatures(ids: number[]) { }
    unselectFeature(id: number) { }
    unselectFeatures(ids: number[]) { }
    isSelected(id: number): boolean {
        return false;
    }
    selectAll() { }
    unselectAll() { }

    getFeature(id: number): any {
        return this.features[id];
    }

    getAttributes(): [string, string][] {
        throw new Error("Method not implemented.");
    }
    addAttribute(name: string, dtype: string) {
        throw new Error("Method not implemented.");
    }
    removeAttribute(name: string) {
        throw new Error("Method not implemented.");
    }

    setProperty(id: number, prop: string, value: any) {
        let feat = this.features[id];
        feat["properties"][prop] = value;
    }
    getProperty(id: number, prop: string): any {
        let feat = this.features[id];
        return feat["properties"][prop];
    }

    getGeometry(id: number): any {
        let feat = this.features[id];
        return {
            type: "Point",
            coordinates: feat["coordinates"],
        }
    }

    getStyle(): IGridStyle {
        return this.style;
    }
    setStyle(style: IGridStyle) { }

    on(type, listener) { }

    un(type, listener) { }

    isOL(): boolean {
        return false;
    }
    isDeck(): boolean {
        return true;
    }
    getLayer(): any {
        return new GridCellLayer({
            id: this.name,
            data: this.features,
            pickable: false,
            extruded: false,
            cellSize: this.cell_size,
            getPosition: d => d["coordinates"],
            getFillColor: d => this.style.getColor(d["properties"]),
            elevationScale: 0,
            getElevation: 0,
        });
    }

    private triggerUpdate() {
        this.changed = { id: this.changed.id + 1 };
        this.map.updateDeck();
    }
}

export { GridLayer }