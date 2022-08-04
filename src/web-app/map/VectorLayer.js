import { defaultStyle, defaultHighlightStyle } from "./styles.js";
import { Vector } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source'

class VectorLayer extends Vector 
{
    constructor(features, type, name)
    {
        features.filter(element => { return element.getGeometry().getType() === "*" + type });
        var source = new VectorSource({
            features: features,
            projection: 'EPSG:4326'
        });
        super({source: source});
        this.type = type;
        this.name = name;
        this.selectedfeatures = [];
        this.style = defaultStyle[type];
        this.highlightstyle = defaultHighlightStyle[type];
        this.styleFunction = (feature, resolution) => {
            if (feature.get('selected'))
            {
                return this.highlightstyle;
            }
            else
            {
                return this.style;
            }
        }
        super.setStyle(this.styleFunction);
    }

    setStyle(style)
    {
        if(typeof style === 'function')
        {
            super.setStyle(style);
        }
        else 
        {
            this.style = style;
            super.setStyle(this.styleFunction);
        }
    }

    isSelected(feature)
    {
        return this.selectedfeatures.includes(feature);
    }

    selectFeature(feature)
    {
        feature.set('selected', true);
        this.selectedfeatures.push(feature);
    }

    unselectFeature(feature)
    {
        feature.set('selected', false);
        this.selectedfeatures = this.selectedfeatures.filter(element => { return element != feature; })
    }

    unselectAll()
    {
        this.selectedfeatures.forEach(element => {
            element.set('selected', false);
        });
        this.selectedfeatures = [];
    }

    addFeature(feature)
    {
        if (feature.getGeometry().getType()  === this.type || feature.getGeometry().getType() === "Multi" + this.type)
        {
            feature.set('layer', this);
            feature.set('selected', false);
            super.getSource().addFeature(feature);
        }
    }

    removeFeature(feature)
    {
        super.getSource().removeFeature(feature);
    }
}

export {VectorLayer}