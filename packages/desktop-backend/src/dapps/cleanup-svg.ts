import { JSDOM } from "jsdom";

const SVG_ALLOWED_ATTRIBUTES = [
  'about',
  'baseProfile',
  'class',
  'color',
  'color-rendering',
  'content',
  'contentScriptType',
  'datatype',
  'direction',
  'display-align',
  'externalResourcesRequired',
  'fill',
  'fill-opacity',
  'fill-rule',
  'focusable',
  'font-family',
  'font-size',
  'font-style',
  'font-variant',
  'font-weight',
  'height',
  'line-increment',
  'playbackOrder',
  'preserveAspectRatio',
  'property',
  'rel',
  'resource',
  'rev',
  'role',
  'snapshotTime',
  'solid-color',
  'solid-opacity',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'text-align',
  'text-anchor',
  'timelineBegin',
  'typeof',
  'unicode-bidi',
  'vector-effect',
  'version',
  'viewBox',
  'width',
  'xml:base',
  'xml:lang',
  'xml:space',
  'zoomAndPan',
];

const DESC_ALLOWED_ATTRIBUTES = [
  "about", "buffered-rendering", "class", "content", "datatype", "display", "id", "image-rendering", "property", "rel", "requiredFonts", "resource", "rev", "role", "shape-rendering", "systemLanguage", "text-rendering", "typeof", "viewport-fill", "viewport-fill-opacity", "visibility", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const TITLE_ALLOWED_ATTRIBUTES = [
  "about", "buffered-rendering", "class", "content", "datatype", "display", "id", "image-rendering", "property", "rel", "requiredFonts", "resource", "rev", "role", "shape-rendering", "systemLanguage", "text-rendering", "typeof", "viewport-fill", "viewport-fill-opacity", "visibility", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const PATH_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "d", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "pathLength", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const RECT_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "height", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "rx", "ry", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "width", "x", "xml:base", "xml:id", "xml:lang", "xml:space", "y"
];

const CIRCLE_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "cx", "cy", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "r", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const LINE_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "x1", "x2", "xml:base", "xml:id", "xml:lang", "xml:space", "y1", "y2"
];

const ELLIPSE_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "cx", "cy", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "rx", "ry", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const POLYLINE_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "points", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const POLYGON_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "points", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const SOLIDCOLOR_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "rel", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-align", "text-anchor", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const TEXTAREA_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "height", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "width", "x", "xml:base", "xml:id", "xml:lang", "xml:space", "y"
];

const LINEARGRADIENT_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "gradientUnits", "id", "line-increment", "property", "rel", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-align", "text-anchor", "typeof", "unicode-bidi", "vector-effect", "x1", "x2", "xml:base", "xml:id", "xml:lang", "xml:space", "y1", "y2"
];

const RADIALGRADIENT_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "cx", "cy", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "gradientUnits", "id", "line-increment", "property", "r", "rel", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-align", "text-anchor", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const TEXT_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "editable", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "rotate", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "x", "xml:base", "xml:id", "xml:lang", "xml:space", "y"
];

const G_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const DEFS_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "id", "line-increment", "property", "rel", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-align", "text-anchor", "typeof", "unicode-bidi", "vector-effect", "xml:base", "xml:id", "xml:lang", "xml:space"
];

const USE_ALLOWED_ATTRIBUTES = [
  "about", "class", "color", "color-rendering", "content", "datatype", "direction", "display-align", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style", "font-variant", "font-weight", "href", "id", "line-increment", "property", "rel", "requiredFonts", "resource", "rev", "role", "solid-color", "solid-opacity", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "systemLanguage", "text-align", "text-anchor", "transform", "typeof", "unicode-bidi", "vector-effect", "x", "xml:base", "xml:id", "xml:lang", "xml:space", "y"
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  "circle": CIRCLE_ALLOWED_ATTRIBUTES,
  "defs": DEFS_ALLOWED_ATTRIBUTES,
  "desc": DESC_ALLOWED_ATTRIBUTES,
  "ellipse": ELLIPSE_ALLOWED_ATTRIBUTES,
  "g": G_ALLOWED_ATTRIBUTES,
  "line": LINE_ALLOWED_ATTRIBUTES,
  "linearGradient": LINEARGRADIENT_ALLOWED_ATTRIBUTES,
  "path": PATH_ALLOWED_ATTRIBUTES,
  "polygon": POLYGON_ALLOWED_ATTRIBUTES,
  "polyline": POLYLINE_ALLOWED_ATTRIBUTES,
  "radialGradient": RADIALGRADIENT_ALLOWED_ATTRIBUTES,
  "rect": RECT_ALLOWED_ATTRIBUTES,
  "solidColor": SOLIDCOLOR_ALLOWED_ATTRIBUTES,
  "svg": SVG_ALLOWED_ATTRIBUTES,
  "text": TEXT_ALLOWED_ATTRIBUTES,
  "textArea": TEXTAREA_ALLOWED_ATTRIBUTES,
  "title": TITLE_ALLOWED_ATTRIBUTES,
  "use": USE_ALLOWED_ATTRIBUTES
};

const parseStyleValue = (styles: string) => {
	const styleTexts = styles.split(';');

  const attrs: [string, string][] = [];
  for (const styleText of styleTexts) {
		const attribute = styleText.split(':');
		if (attribute.length != 2) {
			continue;
    }
    let [name, value] = attribute;
    name = name.trim();
    value = value.trim();
		attrs.push([name, value]);
  }
	return new Map(attrs);
};

const cleanupSVG = (svgImg: string) => {
  const dom = new JSDOM(svgImg);

  const svg = dom.window.document.body.childNodes[0] as SVGSVGElement;

  if (svg.localName !== 'svg') {
    throw new Error('invalid svg');
  }

  // Set the version attribute to 1.2.
  svg.setAttribute('version', '1.2');

  // Set the baseProfile attribute to 'tiny-ps'.
  svg.setAttribute('baseProfile', 'tiny-ps');

  // Remove x and y attributes.
  svg.removeAttribute('x');
  svg.removeAttribute('y');

  for (const title of svg.querySelectorAll('title')) {
    title.remove();
  }

  // Check if this svg has <image> element.
  for (const image of svg.querySelectorAll('image')) {
    image.remove();
  }

  // Remove the <namedview> element.
  for (const namedview of svg.querySelectorAll('namedview')) {
    namedview.remove();
  }

  // Remove the disallowed attributes in the <svg> tag.
  const styleAttribute = svg.getAttribute('style');

  // Remove "style" attribute.
  if (styleAttribute) {
    const styles = parseStyleValue(styleAttribute);
    for (const [name, value] of styles) {
      if (SVG_ALLOWED_ATTRIBUTES.includes(name)) {
        svg.setAttribute(name, value);
      }
    }
    svg.removeAttribute('style');
  }

  // Remove disallowed attributes.
  for (const attributeName of svg.getAttributeNames()) {
    if (attributeName.indexOf('xmlns') === 0) {
      continue;
    }
    if (!SVG_ALLOWED_ATTRIBUTES.includes(attributeName)) {
      svg.removeAttribute(attributeName);
    }
  }

  // Remove the disallowed attributes in all children of <svg> tag.
  for (const element of svg.getElementsByTagName('*')) {
    const allowedAttributesList = ALLOWED_ATTRIBUTES[element.localName];
    if (!allowedAttributesList) {
      element.remove();
    } else {
      for (const attributeName of element.getAttributeNames()) {
        if (!allowedAttributesList.includes(attributeName)) {
          element.removeAttribute(attributeName);
        }
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${svg.outerHTML}`;
};

export default cleanupSVG;
