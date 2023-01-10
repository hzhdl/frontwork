//axiosInstance.js
//导入axios
import axios from 'axios'

//使用axios下面的create([config])方法创建axios实例，其中config参数为axios最基本的配置信息。


const request=(config)=>{
  const weatherAPI = axios.create({
    baseURL:'https://restapi.amap.com/v3/weather', //请求后端数据的基本地址，自定义
    timeout: 2000, //请求超时设置，单位ms
    params:{
      key:"72255507a9aa5d3ab5ada090a968bda9",
    }
  })
  return weatherAPI.request(config)

}

//导出我们建立的axios实例模块，ES6 export用法
export default request
