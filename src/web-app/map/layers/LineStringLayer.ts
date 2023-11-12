import { PathLayer } from '@deck.gl/layers';
import { ILayer } from './ILayer';
import { ILineStyle, LineStyle } from '/map/styles/LineStyle';
import { Map3D } from '../Map3D';

class LineStringLayer implements ILayer {
    map: Map3D;

    features: any[];
    is_selected: boolean[];
    changed: any;

    name: any;
    style: ILineStyle;

    constructor(features, name, style = null) {
        this.name = name;
        this.features = features;
        this.is_selected = Array(features.length).fill(false);
        if (style === null) {
            this.style = new LineStyle();
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
        return "PathLine";
    }

    getAllFeatures(): number[] {
        let ids = [];
        for (let i = 0; i < this.features.length; i++) {
            ids.push(i);
        }
        return ids;
    }
    getSelectedFeatures(): number[] {
        let ids = [];
        for (let i = 0; i < this.features.length; i++) {
            if (this.is_selected[i]) {
                ids.push(i);
            }
        }
        return ids;
    }
    selectFeature(id: number) {
        this.is_selected[id] = true;
        this.triggerUpdate();
    }
    selectFeatures(ids: number[]) {
        for (let id of ids) {
            this.is_selected[id] = true;
        }
        this.triggerUpdate();
    }
    unselectFeature(id: number) {
        this.is_selected[id] = false;
        this.triggerUpdate();
    }
    unselectFeatures(ids: number[]) {
        for (let id of ids) {
            this.is_selected[id] = false;
        }
        this.triggerUpdate();
    }
    isSelected(id: number): boolean {
        return this.is_selected[id];
    }
    selectAll() {
        for (let i = 0; i < this.features.length; i++) {
            this.is_selected[i] = true;
        }
        this.triggerUpdate();
    }
    unselectAll() {
        for (let i = 0; i < this.features.length; i++) {
            this.is_selected[i] = false;
        }
        this.triggerUpdate();
    }

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
        return feat["geometry"];
    }

    getFeaturesInExtend(extend: any): number[] {
        return [];
    }
    getFeaturesAtCoordinate(coord: number[]): number[] {
        return [];
    }

    getStyle(): ILineStyle {
        return this.style;
    }
    setStyle(style: ILineStyle) { }

    on(type, listener) { }

    un(type, listener) { }

    isOL(): boolean {
        return false;
    }
    isDeck(): boolean {
        return true;
    }
    getLayer(): any {
        return new PathLayer({
            id: this.name,
            data: this.features,
            pickable: true,
            widthScale: 1,
            widthMinPixels: 1,
            getPath: d => d["geometry"]["coordinates"],
            getColor: (d, { index }) => {
                const fill = this.style.getColor(d);
                if (this.is_selected[index]) {
                    return [170, 65, 154, 150];
                } else {
                    return fill;
                }
            },
            getWidth: d => this.style.getWidth(d),

            updateTriggers: {
                getColor: this.changed,
            }
        });
    }

    private triggerUpdate() {
        this.changed = { id: this.changed.id + 1 };
        this.map.updateDeck();
    }
}

export { LineStringLayer }