<template>
    <MapView :viewmode="'3D'"/>
</template>

<script setup>
import MapView from '@/components/MapView.vue';
import {onMounted,watch} from "vue";
import { useStore } from 'vuex';

const store=useStore();

// 监听地图加载完成事件
watch(() => store.state.mapComplated, (newValue) => {
    console.log(newValue);
    if(newValue){
        // 执行图层加载
        addLayer(); 
    }
})

function addLayer(){
    // 创建 Loca 实例
    let loca = store.state.mainloca;
    console.log(loca);

    let geojson={ 
        "type": "FeatureCollection", 
        "features": [
            {
                "type": "Feature",
                "id": 65,
                "properties": {
                    "X": 120.18798209978567,
                    "Y": 30.48288207977986,
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
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                    120.200392,
                    30.479869
                    ]
                }
            }
        ]
    }
    // 创建数据源
    let dataSource = new Loca.GeoJSONSource({
        data: geojson,
    });

    // 加载点图层、创建圆点图层
    let pointLayer = new Loca.PointLayer({
        zIndex: 10,
        opacity: 1,
        visible: true,
        blend: 'lighter',
        zooms: [2, 16],
    });
    // 图层添加数据
    pointLayer.setSource(dataSource);


    // 添加到地图上,问题就出在这个地方，当我把这段代码注释的时候，页面不会出现内存不断增长的问题，
    // 但是我把这个代码打开，内存就会不断的飙升
    loca.add(pointLayer);
}
</script>