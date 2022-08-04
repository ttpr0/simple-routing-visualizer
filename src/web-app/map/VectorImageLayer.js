import { defaultStyle, defaultHighlightStyle } from "./styles.js";
import { VectorImage } from 'ol/layer';
import { Vector } from 'ol/source'

class VectorImageLayer extends VectorImage 
{
    constructor(features, type, name)
    {
        features.filter(element => { return element.getGeometry().getType() === "*" + type });
        var source = new Vector({
            features: features,
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
            super.setStyle(this.styleFunction);
            this.style = style;
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
            super.getSource().addFeature(feature);
        }
    }

    removeFeature(feature)
    {
        super.getSource().removeFeature(feature);
    }
}

export {VectorImageLayer}