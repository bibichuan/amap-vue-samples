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
        // 增加区域
        areaMask();
        // 执行图层加载
        addLayer(); 
    }
})

// 区域掩膜
function  areaMask(){
    var provinces = [
        '520000',//贵州
        '540000',//西藏
        '530000',//云南 
        '500000',//重庆
        '360000',//江西
        '340000',//安徽
        '510000',//四川
        '350000',//福建
        '430000',//湖南
        '420000', //湖北
        '410000',//河南
        '330000',//浙江
        '640000',//宁夏
        '650000',//新疆
        '440000',//广东
        '370000',//山东
        '450000',//广西
        '630000',//青海
        '320000',//江苏
        '140000',//山西
        '460000',// 海南
        '310000',//上海
        '110000', // 北京
        '130000', // 河北
        '230000', // 黑龙江
        '220000',// 吉林
        '210000', //辽宁
        '150000',//内蒙古
        '120000',// 天津
        '620000',// 甘肃
        '610000',// 甘肃
        '710000', //台湾
        '810000', //香港
        '820000' //澳门
    ]
    // 显示行政区
    var disLayer=new AMap.DistrictLayer.Province({
        zIndex: 9,
        adcode: provinces,
        depth: 2,
        styles: {
            'fill': function (properties) {
                // properties为可用于做样式映射的字段，包含
                // NAME_CHN:中文名称
                // adcode_pro
                // adcode_cit
                // adcode
                var adcode = properties.adcode;
                let color="rgba(0,0,0,0.7)";
                if (adcode=='330110') {
                    color="";
                }

                return color;
            },
            'province-stroke': 'cornflowerblue',
            'city-stroke': 'white', // 中国地级市边界
            'county-stroke': function(properties){
                var adcode = properties.adcode;
                let color="";
                if (adcode=='330110') {
                    color='rgba(255,255,255,1)';
                }
                return color;
            }, // 中国区县边界
            'stroke-width':function(properties){
                var adcode = properties.adcode;
                let width=0;
                if (adcode=='330110') {
                    width=2;
                }

                return width;
            },
        }
    });
    let mainmap=store.state.map;
    // 添加到地图上
    mainmap.addLayer(disLayer);
}

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