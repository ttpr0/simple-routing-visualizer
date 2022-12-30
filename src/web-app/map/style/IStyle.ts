import { Style } from "ol/style";

interface IStyle
{
    getStyle(feature, resolution) : Style;
    getHighlightStyle(feature, resolution) : Style;
}

export { IStyle }