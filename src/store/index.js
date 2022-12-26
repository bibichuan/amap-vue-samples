import { markRaw} from "vue";
import { createStore } from 'vuex';
 
const store = createStore({
  state () {
    return {
      map:null, // 地图
      mainloca:null, // 渲染图层
      mapComplated:false, // 地图是否加载完成
    }
  },
  mutations: {
    // 设置地图
    setMap(state,map){
      state.map=map;
    },
    setLoca(state,loca){
      state.mainloca=loca;
    },
    // 地图是否加载完成
    setMapComplated(state,mapComplated){
      state.mapComplated=mapComplated;
    },
  },
  getters:{
    loca(state){
      let tempLoca=null;
      if(state.loca){
        tempLoca=state.loca;
      }else{
        tempLoca=new Loca.Container({
            map:state.map
        })
        tempLoca=markRaw(tempLoca);
        
        state.loca=tempLoca;
      }
      return tempLoca;
    }
  },
  actions: {
  }
});

export default store;