import { defaultStyle, highlightpointstyle } from "./styles.js";

class VectorLayer extends ol.layer.Vector 
{
    constructor(features, type, name)
    {
        features.filter(element => { return element.getGeometry().getType() === "*" + type });
        var source = new ol.source.Vector({
            features: features,
        });
        super({source: source});
        this.style = defaultStyle[type];
        this.highlightstyle = highlightpointstyle;
        super.getSource().getFeatures().forEach(element => {
            element.set('layer', this);
            element.set('selected', false);
        });
        this.type = type;
        this.name = name;
        this.map = null;
        this.display = true;
        this.selectedfeatures = [];
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
            super.setStyle(this.styleFunction);
            this.style = style;
        }
    }

    styleFunction(feature, resolution)
    {
        if (feature.get('selected'))
        {
            return feature.get('layer').highlightstyle;
        }
        else
        {
            return feature.get('layer').style;
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

    addFeatures(features)
    {
        features.forEach(element => { element.set('layer', this); element.set('selected', false); });
        super.getSource().addFeatures(features);
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