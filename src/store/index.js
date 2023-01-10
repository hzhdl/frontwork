import { createStore } from 'vuex'
import request from '../request'

export default createStore({
  state: {
    tabledata:[],
    sourcetabledata:[],
    countnum:0
  },
  mutations: {
    addtabledata(state,data){
      data.key=state.countnum
      state.countnum++;
      state.tabledata.push(data);
      state.sourcetabledata.push(data);
    }
  },
  actions: {
    async updatatabledata(context,code){
      //  利用axios 获取数据并进行更新
      request({
        url: "weatherInfo",
        method: 'get',
        params:{
          city: code
        }
      }).then((res)=>{
        // console.log(res.data.lives[0])
        context.commit("addtabledata",res.data.lives[0])
      })



    }
  },
  modules: {
  }
})

