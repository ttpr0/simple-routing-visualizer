import { defaultStyle, defaultHighlightStyle } from "./styles.js";

class VectorLayer extends ol.layer.Vector 
{
    constructor(features, type, name)
    {
        features.filter(element => { return element.getGeometry().getType() === "*" + type });
        var source = new ol.source.Vector({
            features: features,
        });
        super({source: source});
        this.type = type;
        this.name = name;
        this.map = null;
        this.display = true;
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

    setMap(map)
    {
        this.map = map;
    }

    getMap()
    {
        return this.map;
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

    displayOn()
    {
        if (!this.display)
        {
            this.display = true;
            if (this.map != null)
            {
                this.map.showLayer(this);
            }
        }
    }

    displayOff()
    {
        if (this.display)
        {
            this.display = false;
            if (this.map != null)
            {
                this.map.hideLayer(this);
            }
        }
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

    delete()
    {
        if (this.map != null)
        {
            this.map.removeVectorLayer(this);
        }
    }
}

export {VectorLayer}