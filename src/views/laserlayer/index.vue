<template>
    <MapView :viewmode="'3D'"/>
</template>

<script setup>
import MapView from '@/components/MapView.vue';
import {watch} from "vue";
import { useStore } from 'vuex';

const store=useStore();

// 监听地图加载完成事件
watch(() => store.state.mapComplated, (newValue) => {
    console.log(newValue);
    if(newValue){
        // 执行图层加载
        addTopLayer();
        // 启动动画
        let loca=store.getters.loca;
        loca.animate.start();

        let map=store.state.map;
        map.setCenter([120.18798209978567,30.48288207977986]);
        map.setZoom(20);
    }
})

// 增加前10名
function addTopLayer(){
    let loca=store.getters.loca;
    let top10Feature=[
        {
            "type": "Feature",
            "id": 65,
            "properties": {
                "X": 120.18798209978567,
                "Y": 30.48288207977986,
                "RYYB":100,
                "h":100,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                120.192597,
                30.480531
                ]
            }
        },
        {
            "type": "Feature",
            "id": 66,
            "properties": {
                "X": 120.19579890040778,
                "Y": 30.482233229669298,
                "RYYB":100,
                "h":100,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                120.200392,
                30.479869
                ]
            }
        }
    ];
    // 生成标注层
    var top10 = new Loca.GeoJSONSource({
        data: {
            type: 'FeatureCollection',
            features: top10Feature
        },
    });
    var zMarker = new Loca.ZMarkerLayer({
        zIndex: 200,
        loca:loca,
        zooms: [14, 26],
    });
    zMarker.setSource(top10);
    let heightFactor = 10; // 高度因素
    zMarker.setStyle({
        content: (i, feat) => {
            var RYYB = feat.properties.RYYB;
            return `<div style="width: 400px; height: 80px;box-sizing:initial;
                line-height: 80px; font-size: 25px; 
                background-image:linear-gradient(to right,rgba(30,215,196,0.4),rgba(30, 215, 196, 0.3),rgba(0,0,0,0.4)); 
                border:4px solid rgba(30, 215, 196, 0.9); color:#fff; 
                border-radius: 20px; text-align:center; margin:0px;padding:0;">
                人员掩蔽: ${RYYB}
                </div>
            `;
        },
        unit: 'meter',
        rotation: 0,
        alwaysFront: true,
        size: [400 * 2, 80 * 2],
        altitude: (i, feat) => {
            return feat.properties.h*heightFactor;
        },
    });

    // 标注层的线
    var pole = new Loca.LaserLayer({
        zIndex: 200,
        loca,
        depth: false,
        zooms: [14, 26],
    });
    pole.setSource(top10, {
        unit: 'meter',
        height: (i, feat) => {
            return feat.properties.h*heightFactor;
        },
        color: 'rgba(30,215,196, 1)',
        lineWidth: 15,
        trailLength: 50000,
        repeat: 0,
    });
    console.log("dsf");
}
// 激光图层
function addLaserLayer(){
    let loca=store.getters.loca;
    let features=this.features;
    var layer = new Loca.LaserLayer({
        zIndex: 130,
        opacity: 1,
        visible: true,
        depth: true,
        zooms: [14, 26],
    });

    var heightFactor = 9;

    var pointGeo = new Loca.GeoJSONSource({
        data: {
            type: 'FeatureCollection',
            features: features
        },
    });

    layer.setSource(pointGeo, {
        unit: 'meter',
        height: (index, feat) => {
            return feat.properties.h * heightFactor;
        },
        color: (index, feat) => {
            return ['#FF6F47', '#4FDDC7', '#4FDDC7'][index % 3];
        },
        lineWidth: 12,
        trailLength: 600,
        angle: 0,
        duration: 1500,
        interval: 1000,
        repeat: Infinity,
        delay: () => {
            return Math.random() * 2000;
        },
    });
    loca.add(layer);
}
</script>