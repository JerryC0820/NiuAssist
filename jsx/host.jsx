#target photoshop

function psexCapture_insertImageFromData(dataUrl) {
    try {
        if (!dataUrl || dataUrl === '') return 'no_data';

        var parsed = psexCapture_parseDataUrl(dataUrl);
        if (!parsed) return 'bad_data_url';

        var ext = psexCapture_extensionFromMime(parsed.mime);
        var file = psexCapture_writeTempFile(parsed, ext);
        if (!file || !file.exists) return 'write_failed';

        if (app.documents.length === 0) {
            app.open(file);
            return 'opened';
        }

        psexCapture_placeFile(file);
        return 'placed';
    } catch (e) {
        return 'error:' + e;
    }
}

function psexCapture_replaceActiveLayerFromData(dataUrl) {
    try {
        if (!dataUrl || dataUrl === '') return 'no_data';
        if (app.documents.length === 0) {
            return psexCapture_insertImageFromData(dataUrl);
        }
        var doc = app.activeDocument;
        var oldLayer = doc.activeLayer;
        var result = psexCapture_insertImageFromData(dataUrl);
        try {
            if (oldLayer) oldLayer.remove();
        } catch (e2) {}
        return result;
    } catch (e) {
        return 'error:' + e;
    }
}

function psexCapture_insertTextLayer(text) {
    try {
        if (!text || text === '') return 'no_text';
        if (app.documents.length === 0) {
            app.documents.add(1200, 800, 72, '文本', NewDocumentMode.RGB, DocumentFill.WHITE);
        }
        var doc = app.activeDocument;
        var layer = doc.artLayers.add();
        layer.kind = LayerKind.TEXT;
        layer.textItem.contents = text;
        return 'ok';
    } catch (e) {
        return 'error:' + e;
    }
}

function psexCapture_getSelectedLayerIds() {
    var ids = [];
    try {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('targetLayers'));
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        var desc = executeActionGet(ref);
        if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
            var list = desc.getList(stringIDToTypeID('targetLayers'));
            for (var i = 0; i < list.count; i++) {
                var ref2 = list.getReference(i);
                ids.push(ref2.getIdentifier());
            }
        } else {
            var ref3 = new ActionReference();
            ref3.putProperty(charIDToTypeID('Prpr'), charIDToTypeID('LyrI'));
            ref3.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
            ids.push(executeActionGet(ref3).getInteger(charIDToTypeID('LyrI')));
        }
    } catch (e) {
        try { ids.push(app.activeDocument.activeLayer.id); } catch (e2) {}
    }
    return ids;
}

function psexCapture_findLayerById(layerSet, id) {
    try {
        var layers = layerSet.layers || [];
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.id == id) return layer;
            if (layer.typename === 'LayerSet') {
                var found = psexCapture_findLayerById(layer, id);
                if (found) return found;
            }
        }
    } catch (e) {}
    return null;
}

function psexCapture_getSelectedTextLayers(doc) {
    var out = [];
    try {
        var ids = psexCapture_getSelectedLayerIds();
        for (var i = 0; i < ids.length; i++) {
            var layer = psexCapture_findLayerById(doc, ids[i]);
            if (layer && layer.kind == LayerKind.TEXT) out.push(layer);
        }
        if (!out.length && doc.activeLayer && doc.activeLayer.kind == LayerKind.TEXT) {
            out.push(doc.activeLayer);
        }
    } catch (e) {}
    return out;
}

function psexCapture_copyTextStyle(srcItem, destItem) {
    try { destItem.font = srcItem.font; } catch (e) {}
    try { destItem.size = srcItem.size; } catch (e2) {}
    try { destItem.leading = srcItem.leading; } catch (e3) {}
    try { destItem.tracking = srcItem.tracking; } catch (e4) {}
    try { destItem.horizontalScale = srcItem.horizontalScale; } catch (e5) {}
    try { destItem.verticalScale = srcItem.verticalScale; } catch (e6) {}
    try { destItem.baselineShift = srcItem.baselineShift; } catch (e7) {}
    try { destItem.justification = srcItem.justification; } catch (e8) {}
    try { destItem.antiAliasMethod = srcItem.antiAliasMethod; } catch (e9) {}
    try { destItem.capitalization = srcItem.capitalization; } catch (e10) {}
    try { destItem.fauxBold = srcItem.fauxBold; } catch (e11) {}
    try { destItem.fauxItalic = srcItem.fauxItalic; } catch (e12) {}
    try { destItem.underline = srcItem.underline; } catch (e13) {}
    try { destItem.strikeThru = srcItem.strikeThru; } catch (e14) {}
    try {
        var srcColor = srcItem.color;
        if (srcColor && srcColor.rgb) {
            var color = new SolidColor();
            color.rgb.red = srcColor.rgb.red;
            color.rgb.green = srcColor.rgb.green;
            color.rgb.blue = srcColor.rgb.blue;
            destItem.color = color;
        }
    } catch (e15) {}
    try { destItem.position = srcItem.position; } catch (e16) {}
    try { destItem.kind = srcItem.kind; } catch (e17) {}
    try {
        if (srcItem.kind == TextType.PARAGRAPHTEXT) {
            destItem.width = srcItem.width;
            destItem.height = srcItem.height;
        }
    } catch (e18) {}
}

function psexCapture_insertTextLayerAtSelection(text) {
    try {
        if (!text || text === '') return 'no_text';
        if (app.documents.length === 0) {
            app.documents.add(1200, 800, 72, '文本', NewDocumentMode.RGB, DocumentFill.WHITE);
        }
        var doc = app.activeDocument;
        var selected = psexCapture_getSelectedTextLayers(doc);
        if (selected.length > 1) {
            for (var i = 0; i < selected.length; i++) {
                try { selected[i].textItem.contents = text; } catch (e1) {}
            }
            return 'replaced:' + selected.length;
        }
        if (selected.length === 1) {
            var ref = selected[0];
            var layer = doc.artLayers.add();
            layer.kind = LayerKind.TEXT;
            try { layer.name = ref.name + '_AI'; } catch (e2) {}
            var item = layer.textItem;
            psexCapture_copyTextStyle(ref.textItem, item);
            item.contents = text;
            try { layer.move(ref, ElementPlacement.PLACEAFTER); } catch (e3) {}
            return 'inserted';
        }
        return psexCapture_insertTextLayer(text);
    } catch (e) {
        return 'error:' + e;
    }
}

function psexCapture_exportActiveLayerToDataUrl() {
    var doc = null;
    var tempDoc = null;
    var result = null;
    try {
        if (app.documents.length === 0) return 'no_doc';
        doc = app.activeDocument;
        var layer = null;
        try { layer = doc.activeLayer; } catch (e0) { layer = null; }
        if (!layer) {
            try {
                if (doc.layers && doc.layers.length > 0) layer = doc.layers[0];
            } catch (e1) {}
        }
        if (!layer) {
            try {
                if (doc.artLayers && doc.artLayers.length > 0) layer = doc.artLayers[0];
            } catch (e2) {}
        }
        if (!layer) return 'no_layer';
        var bounds = null;
        try { bounds = layer.bounds; } catch (e3) { return 'error:bounds'; }
        var left = bounds[0].as('px');
        var top = bounds[1].as('px');
        var right = bounds[2].as('px');
        var bottom = bounds[3].as('px');
        var width = Math.max(1, right - left);
        var height = Math.max(1, bottom - top);
        if (width <= 1 || height <= 1) return 'no_size';

        tempDoc = app.documents.add(width, height, doc.resolution, 'psex_layer', NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
        var dupLayer = null;
        try {
            dupLayer = layer.duplicate(tempDoc, ElementPlacement.PLACEATBEGINNING);
        } catch (e4) {
            dupLayer = null;
        }
        if (dupLayer) {
            try { dupLayer.visible = true; } catch (e5) {}
            try {
                if (dupLayer.typename === 'LayerSet') {
                    tempDoc.activeLayer = dupLayer;
                    dupLayer = dupLayer.merge();
                }
            } catch (e6) {}
            try { dupLayer.translate(-left, -top); } catch (e7) {}
        } else {
            try {
                app.activeDocument = doc;
                doc.activeLayer = layer;
                var sel = [[left, top], [right, top], [right, bottom], [left, bottom]];
                doc.selection.select(sel, SelectionType.REPLACE, 0, false);
                doc.selection.copy();
                doc.selection.deselect();
                app.activeDocument = tempDoc;
                tempDoc.paste();
            } catch (e8) {
                return 'error:duplicate';
            }
        }

        var file = new File(Folder.temp.fsName + '/psex_layer_' + (new Date().getTime()) + '.png');
        var opts = new PNGSaveOptions();
        tempDoc.saveAs(file, opts, true, Extension.LOWERCASE);

        var bin = psexCapture_readBinary(file);
        try { file.remove(); } catch (e8) {}
        if (!bin) return 'error:read';
        var b64 = psexCapture_base64Encode(bin);
        if (!b64) return 'error:base64';
        result = 'data:image/png;base64,' + b64;
    } catch (e) {
        result = 'error:' + e;
    } finally {
        try {
            if (tempDoc) tempDoc.close(SaveOptions.DONOTSAVECHANGES);
        } catch (e9) {}
        try {
            if (doc) app.activeDocument = doc;
        } catch (e10) {}
    }
    return result;
}

function psexCapture_exportActiveLayerToFile(outPath) {
    var doc = null;
    var all = [];
    var vis = [];
    try {
        if (!outPath) return 'no_path';
        if (app.documents.length === 0) return 'no_doc';
        doc = app.activeDocument;
        var layer = null;
        try { layer = doc.activeLayer; } catch (e0) { layer = null; }
        if (!layer) return 'no_layer';
        function collect(ls) {
            for (var i = 0; i < ls.length; i++) {
                var l = ls[i];
                all.push(l);
                if (l.typename === 'LayerSet') collect(l.layers);
            }
        }
        collect(doc.layers);
        var ancestors = [];
        var p = layer.parent;
        while (p && p.typename !== 'Document') {
            ancestors.push(p);
            p = p.parent;
        }
        function isAllowed(l) {
            if (l === layer) return true;
            for (var j = 0; j < ancestors.length; j++) {
                if (l === ancestors[j]) return true;
            }
            return false;
        }
        for (var i = 0; i < all.length; i++) {
            try {
                vis[i] = all[i].visible;
                all[i].visible = isAllowed(all[i]);
            } catch (e1) {}
        }
        var file = new File(outPath);
        var opts = new PNGSaveOptions();
        doc.saveAs(file, opts, true, Extension.LOWERCASE);
        return 'ok';
    } catch (e) {
        return 'error:' + e;
    } finally {
        for (var k = 0; k < all.length; k++) {
            try { all[k].visible = vis[k]; } catch (e2) {}
        }
    }
}

function psexCapture_parseDataUrl(dataUrl) {
    var match = dataUrl.match(/^data:([^;,]+)(;charset=[^;,]+)?(;base64)?,(.*)$/i);
    if (!match) return null;
    return {
        mime: match[1],
        base64: !!match[3],
        data: match[4]
    };
}

function psexCapture_extensionFromMime(mime) {
    var m = (mime || '').toLowerCase();
    if (m.indexOf('png') !== -1) return 'png';
    if (m.indexOf('jpeg') !== -1) return 'jpg';
    if (m.indexOf('jpg') !== -1) return 'jpg';
    if (m.indexOf('gif') !== -1) return 'gif';
    if (m.indexOf('webp') !== -1) return 'webp';
    if (m.indexOf('svg') !== -1) return 'svg';
    return 'png';
}

function psexCapture_writeTempFile(parsed, ext) {
    var name = 'psex_capture_' + (new Date().getTime()) + '.' + ext;
    var file = new File(Folder.temp.fsName + '/' + name);

    if (parsed.base64) {
        var bin = psexCapture_base64Decode(parsed.data);
        file.encoding = 'BINARY';
        file.open('w');
        file.write(bin);
        file.close();
    } else {
        var text = parsed.data;
        try { text = decodeURIComponent(parsed.data); } catch (e) {}
        file.encoding = 'UTF-8';
        file.open('w');
        file.write(text);
        file.close();
    }

    return file;
}

function psexCapture_placeFile(file) {
    try {
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID('null'), file);
        desc.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa'));
        executeAction(charIDToTypeID('Plc '), desc, DialogModes.NO);
    } catch (e) {
        app.open(file);
    }
}

function psexCapture_placeFileByPath(filePath) {
    try {
        if (!filePath) return 'no_path';
        var file = new File(filePath);
        if (!file.exists) return 'not_found';
        if (app.documents.length === 0) {
            app.open(file);
        } else {
            psexCapture_placeFile(file);
        }
        try { file.remove(); } catch (e2) {}
        return 'placed';
    } catch (e) {
        return 'error:' + e;
    }
}

function psexCapture_openImageAsNewDocumentFromPath(filePath) {
    try {
        if (!filePath) return 'no_path';
        var file = new File(filePath);
        if (!file.exists) return 'not_found';
        app.open(file);
        return 'opened';
    } catch (e) {
        return 'error:' + e;
    }
}

function psexCapture_base64Decode(data) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    var i = 0;
    while (i < data.length) {
        var enc1 = chars.indexOf(data.charAt(i++));
        var enc2 = chars.indexOf(data.charAt(i++));
        var enc3 = chars.indexOf(data.charAt(i++));
        var enc4 = chars.indexOf(data.charAt(i++));

        var chr1 = (enc1 << 2) | (enc2 >> 4);
        var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        var chr3 = ((enc3 & 3) << 6) | enc4;

        output += String.fromCharCode(chr1);
        if (enc3 !== 64) output += String.fromCharCode(chr2);
        if (enc4 !== 64) output += String.fromCharCode(chr3);
    }
    return output;
}

function psexCapture_readBinary(file) {
    try {
        file.encoding = 'BINARY';
        file.open('r');
        var bin = file.read();
        file.close();
        return bin;
    } catch (e) {
        try { file.close(); } catch (e2) {}
        return '';
    }
}

function psexCapture_base64Encode(data) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    var i = 0;
    while (i < data.length) {
        var chr1 = data.charCodeAt(i++);
        var chr2 = data.charCodeAt(i++);
        var chr3 = data.charCodeAt(i++);

        var enc1 = chr1 >> 2;
        var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        var enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }
    return output;
}
