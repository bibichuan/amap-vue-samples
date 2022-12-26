<template>
    <div class="mapContainer" id="mapContainer"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import { useStore } from 'vuex';
import {onBeforeUnmount,markRaw} from 'vue';
// import { ElMessage } from 'element-plus';

export default {
    props:{
        viewmode:{
            type:String,
            default:"2D",
        },
        pitch:{  // 倾斜角
            type:Number,
            default:0
        }
    },
    setup(props){
        const store=useStore();
        let mainmap=null; // 主地图
        let mainloca=null; // 主loca
        window.forceWebGL = true; // 强制启动WebGL
        // window.forceWebGLBaseRender = true; // 开启GL
        window._AMapSecurityConfig = { // 加载密钥
            serviceHost:'xxx'
        }

        // 使用API加载高德地图
        AMapLoader.load({
            "key": "xxx",              // 申请好的Web端开发者Key，首次调用 load 时必填
            "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            "plugins": ['Map3D','AMap.DistrictSearch','AMap.DistrictLayer'],  // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            "AMapUI": {             // 是否加载 AMapUI，缺省不加载
                "version": '1.1',   // AMapUI 缺省 1.1
                "plugins":[],       // 需要加载的 AMapUI ui插件
            },
            "Loca":{                // 是否加载 Loca， 缺省不加载
                "version": '2.0'  // Loca 版本，缺省 1.3.2
            },
        }).then((AMap)=>{
            // 加载地图
            var mainmap = new AMap.Map('mapContainer', {
                mapStyle: 'amap://styles/8da0701c78123ad8ccfa967bf22a9397', //设置地图的显示样式
                viewMode: '3D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                zoom:11, //初始化地图层级
                center: [119.978873,30.273852], //初始化地图中心点
                pitch:60,
                showBuildingBlock:true, // 显示3D楼宇
                skyColor:'', // 天空颜色
            });

            mainloca=new Loca.Container({
                map:mainmap
            });
            
            // 保存地图
            store.commit("setMap",markRaw(mainmap));
            store.commit("setLoca",markRaw(mainloca));
            store.commit("setMapComplated",true);

        }).catch(e => {
            console.log(e);
        });

        // 组件销毁前,要将高德地图销毁，这应该是高德的一个bug
        onBeforeUnmount(()=>{
            if(mainmap){
                // 销毁地图
                mainmap.destroy();
                mainmap=null;
                window.mainmap=null;
                // 卸载地图
                store.commit("setMap",null);
                store.commit("setMapComplated",false);
            }
        });
    }
}
</script>

<style lang="scss">
.mapContainer{
    height: 100%;
    width: 100%;
    border-radius: 4px;
    
    .mapboxgl-ctrl-logo{
        display:none!important;   
    }

    .amap-logo,.amap-copyright{
        display: none!important;
    }

    /** 图标 */
    .amap-marker:first-child .amap-icon img {
        width: 25px;
        height: 34px;
    }

}
</style>