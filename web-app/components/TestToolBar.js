import { computed, ref, reactive, watch, toRef} from 'vue'
import { VectorLayer } from '/map/VectorLayer.js'
import { VectorImageLayer } from '/map/VectorImageLayer.js'
import { useStore } from 'vuex';
import { getMap } from '/map/maps.js';
import { getMultiGraph, getRouting } from '../routing/api.js';
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '../map/styles.js';
import { toolbarcomp } from './ToolBarComp.js';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/tests/layers.js'

const testtoolbar = {
    components: { toolbarcomp },
    props: [ ],
    setup(props) {
        const store = useStore();
        const map  = getMap();

        function updateLayerTree() {
            store.commit('updateLayerTree');
        }

        const range1 = ref(1800);
        const count1 = ref(1); 
        const range2 = ref(1800);
        const count2 = ref(10); 
        const smoothing = ref(5);
        const useWebMercator = ref(false);
        const time = ref(0);
        const testmode = ref("Isochrone");

        /**********************************************************
        ***Utility Functions
        **********************************************************/

        function randomRanges(count, maxValue)
        {
            var ranges = [];
            var factor = maxValue/count;
            for (var c = 1; c <= count; c++)
            {
                ranges.push(Math.round(c*factor));
            }
            return ranges;
        }
        function calcStd(array, mean)
        {
            var std = 0;
            array.forEach(element => {
                std += (element - mean)**2;
            })
            return Math.sqrt(std / (array.length-1));
        }
        function calcMean(array)
        {
            var mean = 0;
            array.forEach(element => {
                mean += element;
            })
            return mean / array.length;
        }

        function selectRandomPoints(layer, number)
        {
            var features = layer.getSource().getFeatures();
            var randoms = [];
            var length = features.length;
            var random;
            for (var i=0; i<number; i++)
            {
                var random = Math.floor(Math.random()*length);
                while(randoms.includes(random))
                {
                    random = Math.floor(Math.random()*length);
                }
                randoms.push(random);
            }
            var points = [];
            randoms.forEach(random => {
                points.push(features[random])
            })
            return points;
        }

        /**********************************************************
        ***API-Tests
        **********************************************************/

        async function drawCompareIsolines()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length != 1)
            {
              alert("pls select exactly one feature!");
              return;
            }
            var location = layer.selectedfeatures[0].getGeometry().getCoordinates();
            var ranges = [range1.value];
            var mapbox = getMapBoxPolygon(location, ranges);
            var targamo = getTargamoPolygon(location, ranges);
            var bing = getBingPolygon(location, ranges);
            var mapboxfeature = new ol.format.GeoJSON().readFeatures(await mapbox);
            var targamofeature = new ol.format.GeoJSON().readFeatures(await targamo);
            var bingfeature = new ol.format.GeoJSON().readFeatures(await bing);
            var binglayer = map.getVectorLayerByName("binglayer");
            if (binglayer != null)
            {
                binglayer.delete();
            }
            binglayer = new VectorLayer(bingfeature, 'Polygon', 'binglayer');
            binglayer.setStyle(bing_style);
            map.addVectorLayer(binglayer);
            var mapboxlayer = map.getVectorLayerByName("mapboxlayer");
            if (mapboxlayer != null)
            {
                mapboxlayer.delete();
            }
            mapboxlayer = new VectorLayer(mapboxfeature, 'Polygon', 'mapboxlayer');
            mapboxlayer.setStyle(mapbox_style);
            map.addVectorLayer(mapboxlayer);
            var targamolayer = map.getVectorLayerByName("targamolayer");
            if (targamolayer != null)
            {
                targamolayer.delete();
            }
            targamolayer = new VectorLayer(targamofeature, 'Polygon', 'targamolayer');
            targamolayer.setStyle(targamo_style);
            map.addVectorLayer(targamolayer);
            updateLayerTree();
        }

        async function drawORSPolygon()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length > 20 || layer.selectedfeatures.length == 0)
            {
              alert("pls select less then 20 features!");
              return;
            }
            var ranges = randomRanges(count1.value, range1.value);
            var polygons = [];
            var start = new Date().getTime();
            await Promise.all(layer.selectedfeatures.map(async element => {
              var location = element.getGeometry().getCoordinates();
              var geojson = await getORSPolygon([location], ranges);
              //geojson = calcDifferences(geojson);
              polygons.push(geojson);
            }));
            var end = new Date().getTime();
            time.value = end - start;
            var features = [];
            polygons.forEach(polygon => {
              features = features.concat(new ol.format.GeoJSON().readFeatures(polygon));
            });
            var orslayer = map.getVectorLayerByName("orslayer");
            if (orslayer != null)
            {
                orslayer.delete();
            }
            orslayer = new VectorLayer(features, 'Polygon', 'orslayer');
            orslayer.setStyle(ors_style);
            map.addVectorLayer(orslayer);
            updateLayerTree();
        }

        async function drawDockerPolygon() 
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length > 100 || layer.selectedfeatures.length == 0)
            {
              alert("pls select less then 100 features!");
              return;
            }
            var ranges = randomRanges(count1.value, range1.value);
            var polygons = [];
            var start = new Date().getTime();
            await Promise.all(layer.selectedfeatures.map(async element => {
              var location = element.getGeometry().getCoordinates();
              var geojson = await getDockerPolygon([location], ranges, smoothing.value/10);
              //geojson = calcDifferences(geojson);
              polygons.push(geojson);
            }));
            var end = new Date().getTime();
            time.value = end - start;
            var features = []
            polygons.forEach(polygon => {
              features = features.concat(new ol.format.GeoJSON().readFeatures(polygon));
            });
            var dockerlayer = map.getVectorLayerByName("dockerlayer");
            if (dockerlayer != null)
            {
                dockerlayer.delete();
            }
            dockerlayer = new VectorLayer(features, 'Polygon', 'dockerlayer');
            dockerlayer.setStyle(ors_style);
            map.addVectorLayer(dockerlayer);
            updateLayerTree();
        }

        async function drawIsoRaster()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length > 100)
            {
              alert("pls mark less than 100 features!");
              return;
            }
            if (layer.selectedfeatures.length == 0)
            {
              alert("you have to mark at least one feature!");
              return;
            }
            if (useWebMercator.value)
            {
                var precession = count2.value * 10;
                var crs = "0000";
            }
            else
            {
                var precession = 1 / (count2.value * 10);
                var crs = "4326";
            }
            var locations = [];
            layer.selectedfeatures.forEach(element => {
                locations.push(element.getGeometry().getCoordinates());
            })
            var start = new Date().getTime();
            var geojson = await getIsoRaster(locations, [range2.value], precession, crs);
            var end = new Date().getTime();
            time.value = end - start;
            var multigraphlayer = map.getVectorLayerByName("multigraphrasterlayer");
            if (multigraphlayer != null)
            {
                multigraphlayer.delete();
            }
            var features = new ol.format.GeoJSON().readFeatures(geojson);
            multigraphlayer = new VectorImageLayer(features, 'Polygon', 'multigraphrasterlayer');
            multigraphlayer.setStyle(accessibilityStyleFunction);
            map.addVectorLayer(multigraphlayer);
            updateLayerTree();
        }

        /**********************************************************
        ***Performance-Tests
        **********************************************************/

        async function featurecountTest() 
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (testmode.value === "Isochrone")
                var alg = getDockerPolygon;
            else
                alg = getIsoRaster;
            var ranges = randomRanges(1, 1800);
            var counts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,40,50];
            var times = {};
            for (var i = 0; i < counts.length; i++)
            {
                var k = counts[i];
                times[k] = [];
                console.log(k);
                for (var c=0; c<10; c++)
                {
                    var points = selectRandomPoints(layer, k);
                    var start = new Date().getTime();
                    await Promise.all(points.map(async element => {
                        var location = element.getGeometry().getCoordinates();
                        var geojson = await alg([location], ranges);
                    }));
                    var end = new Date().getTime();
                    var time = end - start;
                    times[k].push(time);
                }
            }
            var l = [];
            console.log(times);
            for (var k in times)
            {
                var mean = calcMean(times[k]);
                var std = calcStd(times[k], mean);
                l.push(k+", "+mean+", "+std);
            }
            console.log(l.join('\n'));
        }

        async function isolinesTest()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length != 1)
            {
                alert("pls select only one feature");
                return;
            }
            var times = {};
            for (var i=1; i<11; i++)
            {
              var range = randomRanges(i, 3600);
              console.log(i);
              times[i] = [];
              for (var c=0; c<5; c++)
              {
                var points = [layer.selectedfeatures[0]];
                var start = new Date().getTime();
                await Promise.all(points.map(async element => {
                  var location = element.getGeometry().getCoordinates();
                  var geojson = await getDockerPolygon([location], range);
                }));
                var end = new Date().getTime();
                var time = end - start;
                times[i].push(time);
              }
            }
            var l = [];
            console.log(times);
            for (var k in times)
            {
              var mean = calcMean(times[k]);
              var std = calcStd(times[k], mean);
              l.push(k+", "+mean+", "+std);
            }
            console.log(l.join('\n'))
        }

        async function rangediffTest()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length != 1)
            {
                alert("pls select only one feature");
                return;
            }
            var t = [1.5, 1.5, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 20, 30, 45, 60];
            var times = {};
            for (var j = 0; j < t.length; j++)
            {
              var i = t[j];
              var range = randomRanges(i, 3600);
              console.log(i);
              times[3600/i] = [];
              for (var c=0; c<5; c++)
              {
                var points = [selectedpoints[0]];
                var start = new Date().getTime();
                await Promise.all(points.map(async element => {
                  var location = element.getGeometry().getCoordinates();
                  var geojson = await getDockerPolygon([location], range);
                }));
                var end = new Date().getTime();
                var time = end - start;
                times[3600/i].push(time);
              }
            }
            var l = [];
            console.log(times);
            for (var k in times)
            {
              var mean = calcMean(times[k]);
              var std = calcStd(times[k], mean);
              l.push(k+", "+mean+", "+std);
            }
            console.log(l.join('\n'))
        }

        async function rangesTest()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length != 1)
            {
                alert("pls select only one feature");
                return;
            }
            if (testmode.value === "Isochrone")
                var alg = getDockerPolygon;
            else
                alg = getIsoRaster;
            var times = {};
            var ranges = [300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400];
            for (var j = 0; j < ranges.length; j++)
            {
              var range = ranges[j];
              console.log(range);
              times[range] = [];
              for (var c=0; c<5; c++)
              {
                var points = [layer.selectedfeatures[0]];
                var start = new Date().getTime();
                await Promise.all(points.map(async element => {
                  var location = element.getGeometry().getCoordinates();
                  var geojson = await alg([location], [range]);
                }));
                var end = new Date().getTime();
                var time = end - start;
                times[range].push(time);
              }
            }
            var l = [];
            console.log(times);
            for (var k in times)
            {
              var mean = calcMean(times[k]);
              var std = calcStd(times[k], mean);
              l.push(k+", "+mean+", "+std);
            }
            console.log(l.join('\n'))
        }

        return { range1, count1, range2, count2, smoothing, useWebMercator, time, testmode, drawCompareIsolines, drawORSPolygon, drawDockerPolygon, drawIsoRaster, featurecountTest, rangesTest, isolinesTest, rangediffTest }
    },
    template: `
    <div class="analysistoolbar">
      <toolbarcomp name="Isochronen">
        <div class="container">
            <button class="bigbutton" @click="drawORSPolygon()">ORS-<br>API</button>
        </div>
        <div class="container">
            <button class="bigbutton" @click="drawDockerPolygon()">Docker-<br>API</button>
        </div>
        <div class="container">
            <button class="bigbutton" @click="drawCompareIsolines()">Compare<br>Isolines</button>
        </div>
        <div class="container">
            <input type="range" id="range" v-model="range1" min="0" max="3600">
            <label for="range">{{ range1 }}</label><br>
            <input type="range" id="rangecount" v-model="count1" min="1" max="10">
            <label for="rangecount">{{ count1 }}</label><br>
            <input type="range" id="smoothing" v-model="smoothing" min="1" max="100">
            <label for="smoothing">{{ smoothing/10 }}</label><br>
        </div>
      </toolbarcomp>
      <toolbarcomp name="IsoRaster">
        <div class="container">
          <button class="bigbutton" @click="drawIsoRaster()">Run<br>IsoRaster</button>
        </div>
        <div class="container">
          <input type="range" id="range" v-model="range2" min="0" max="5400">
          <label for="range">{{ range2 }}</label><br>
          <input type="range" id="rangecount" v-model="count2" min="1" max="100">
          <label for="rangecount">{{ count2*10 }}</label><br>
          <input type="checkbox" id="webmercator" v-model="useWebMercator">
          <label for="webmercator">use Web-Mercator?</label>
        </div>
      </toolbarcomp>
      <toolbarcomp name="Featurecount-Test">
        <div class="container">
            <button class="bigbutton" @click="featurecountTest()">Test<br>Featurecount</button>
        </div>
        <div class="container">
            <input type="radio" id="isochrone" name="test" value="Isochrone" v-model="testmode">
            <label for="isochrone">Isochrones</label><br>
            <input type="radio" id="isoraster" name="test" value="Isoraster" v-model="testmode">
            <label for="isoraster">IsoRaster</label><br>
        </div>
      </toolbarcomp>
      <toolbarcomp name="Isolines-Test">
        <div class="container">
            <button class="bigbutton" @click="isolinesTest()">Test<br>Isolinecount</button>
        </div>
        <div class="container">
            <button class="bigbutton" @click="rangediffTest()">Test<br>Rangediff</button>
        </div>
      </toolbarcomp>
      <toolbarcomp name="Ranges-Test">
        <div class="container">
            <button class="bigbutton" @click="rangesTest()">Test<br>Ranges</button>
        </div>
        <div class="container">
            <input type="radio" id="isochrone" name="test2" value="Isochrone" v-model="testmode">
            <label for="isochrone">Isochrones</label><br>
            <input type="radio" id="isoraster" name="test2" value="Isoraster" v-model="testmode">
            <label for="isoraster">IsoRaster</label><br>
        </div>
      </toolbarcomp>
    </div>
    `
} 

export { testtoolbar }