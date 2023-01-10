<template>
  <a-form ref="searchRef" :model="formSearch" label-width="100px">
    <a-space>

      <a-row :gutter="5">
        <a-col :span="6.5">
          <a-form-item
            label="cityname"
            name="name"
            style="width: 300px"
          >
            <a-input
              v-model:value = "formSearch.nameSearch"
              ref="nameSearch"
              placeholder="Please input name"
            ></a-input>
          </a-form-item>
        </a-col>
        <!--          <a-col :span="6.5">-->
        <!--            <a-form-item-->
        <!--            label="age"-->
        <!--            name="age"-->
        <!--            style="width: 300px"-->
        <!--          >-->
        <!--              <a-input-->
        <!--              v-model:value = "formSearch.ageSearch"-->
        <!--              ref="searchAge"-->
        <!--              placeholder="Please input age"-->
        <!--              >age：</a-input>-->
        <!--              </a-form-item>-->
        <!--          </a-col>-->
        <!--          <a-col :span="6.5">-->
        <!--            <a-form-item-->
        <!--            label="address:"-->
        <!--            name="address"-->
        <!--            style="width: 300px"-->
        <!--          >-->
        <!--              <a-cascader v-model:value="formSearch.address" :options="options" placeholder="Please select address" />-->
        <!--              </a-form-item>-->
        <!--          </a-col>-->
        <a-col>
          <a-button
            type="primary"
            @click="searchname()"
          >
            <template #icon><SearchOutlined /></template>
            search</a-button>
        </a-col>

        <a-col>
          <a-button
            type="primary"
            @click="showModal"
          >
            <template #icon><PlusCircleOutlined /></template>
            add</a-button>
          <!-- 信息添加弹窗 -->
          <a-modal v-model:visible="visible" title="UserAdd" @ok="handleOk">
            <template #footer>
              <a-button key="back" @click="handleCancel">Return</a-button>
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
            </template>
            <a-form ref="addRef" :model="formAdd" :label-col="labelCol" :rules="rules">
              <a-form-item
                label="城市"
                name="city"
                style="width: 450px"
              >
                <a-input v-model:value="formAdd.city"></a-input>
              </a-form-item>

              <a-form-item
                label="省"
                name="province"
                style="width: 450px"
              >
                <a-input v-model:value="formAdd.province"></a-input>
              </a-form-item>

              <a-form-item
                label="天气"
                name="weather"
                style="width: 450px"
              >
                <a-input v-model:value="formAdd.weather"></a-input>
              </a-form-item>
              <a-form-item
                label="风向"
                name="winddirection"
                style="width: 450px"
              >
                <a-input v-model:value="formAdd.winddirection"></a-input>
              </a-form-item>

              <a-form-item
                label="风力"
                name="windpower"
                style="width: 450px"
              >
                <a-input v-model:value="formAdd.windpower"></a-input>
              </a-form-item>

              <a-form-item
                label="时间"
                name="reporttime"
                style="width: 450px"
              >
                <a-input v-model:value="formAdd.reporttime"></a-input>
              </a-form-item>

            </a-form>
          </a-modal>

        </a-col>
        <a-col >
          <a-form-item
            label="导入excel"
            name="name"
            style="width: 300px"
          >
            <input type="file" @change="changeEvent" ref="execll" name id />
          </a-form-item>
        </a-col>
        <!--        <a-col >-->
        <!--          <input type="file" @change="changeEvent" ref="execl" name id />-->


        <!--        </a-col>-->
        <a-col >
          <a-button @click="exportexvel">导出Execl</a-button>

        </a-col>
      </a-row>
    </a-space>
  </a-form>
  <!-- 数据列表 -->
  <a-table :columns="colmunsref" :data-source="dataSource"  bordered >
    <template v-for="col in colss" #[col]="{ text, record }" :key="col" :rules="rulesEdit">
      <div>
        <a-input
          v-if="editableData[record.key]"
          v-model:value="editableData[record.key][col]"
          style="margin: -5px 0"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template #operation="{ record }">
      <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a @click="save(record.key)">Save</a>
              <a @click="cancel(record.key)">Cancel</a>
          </span>
        <span v-else>
            <a @click="edit(record.key)">Edit</a>
            <a-popconfirm
              v-if="dataSource.length"
              title="Sure to delete?"
              @confirm="onDelete(record.key)"
            >
            <a>Delete</a>
            </a-popconfirm>
          </span>
      </div>
    </template>

  </a-table>
</template>
<script>
import { cloneDeep } from 'lodash-es';
import { defineComponent, reactive, ref, toRaw } from 'vue';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue'
import { useStore } from 'vuex'
import * as XLSX from 'xlsx'


//级联选择的选项以及子选项
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
          {
            value: 'jimingi',
            label: 'Ji Ming Si',
          },
        ],
      },
      {
        value: 'suzhou',
        label: 'Suzhou',
        children: [
          {
            value: 'guanqianjie',
            label: 'Guan Qian Street',
          },
          {
            value: 'pingjiangsu',
            label: 'Ping Jiang Road',
          },
        ],
      },
    ],
  },
];

//列表内容
const columns = [
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
    width: '15%',
    slots: {
      customRender: 'city',
    },
  },
  {
    title: '省',
    dataIndex: 'province',
    key: 'province',
    width: '15%',
    slots: {
      customRender: 'province',
    },
  },
  {
    title: '天气',
    dataIndex: 'weather',
    key: 'weather',
    width: '20%',
    slots: {
      customRender: 'weather',
    },
  },
  {
    title: '风向',
    dataIndex: 'winddirection',
    key: 'winddirection',
    width: '10%',
    slots: {
      customRender: 'winddirection',
    },
  },
  {
    title: '风力',
    dataIndex: 'windpower',
    key: 'windpower',
    width: '10%',
    slots: {
      customRender: 'windpower',
    },
  },
  {
    title: '时间',
    dataIndex: 'reporttime',
    key: 'reporttime',
    width: '20%',
    slots: {
      customRender: 'reporttime',
    },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    slots: {
      customRender: 'operation',
    },
  },
];
const data = [];
let cols=['city','province','weather','winddirection','winddirection','windpower','reporttime']


export default ({
  name: "hightable",
  //图标组件
  components: {
    SearchOutlined,
    PlusCircleOutlined,
  },

  created () {
    // console.log(useStore())
    this.freshdata()
  },
  setup() {

    const colss=ref(cols)
    //vuex状态管理
    const store = useStore()
    // console.log(store.state)
    let citycode = ["110000",
      "440103",
      "440104",
      "440105",
      "440106",
      "440111",
      "440112",
      "440113",
      "440114",
      "440115",
      "440117",
      "440118",
      "440200",
      "810009","654301","610102",
      "610103",
      "610104",
      "610111",
      "610112",
      "610113",
      "610114",
      "610115",
      "610116",
      "654321",
      "654322",
      "654323",
      "654324",
      "654325",
      "654326",
      "659001",
      "659002",
      "659003"
    ]
    const  freshdata = async  () => {
      citycode.forEach((async (value, index, array) => {
        await store.dispatch("updatatabledata", value)
      }))

    }

    //
    //查询条件表单初始化
    const searchRef = ref()
    const formSearch = reactive(
      {
        nameSearch: '',
        ageSearch: '',
        addressSearch: ''
      }
    )
    //信息添加表单初始化
    const loading = ref(false)
    const visible = ref(false)

    const addRef = ref()
    const formAdd = reactive(
      {
        city: '',
        province: '',
        weather: '',
        winddirection: '',
        windpower:"",
        reporttime:""
      }
    )

    //添加表单的必填项校验
    const rules = {
      city: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your city' }
      ],
      province: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your province' }
      ],
      weather: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your weather' }
      ],
      winddirection: [
      { required: true, trigger: ['blur', 'change'], message: 'Please input your winddirection' }
    ],
      windpower: [
      { required: true, trigger: ['blur', 'change'], message: 'Please input your windpower' }
    ],
      reporttime: [
      { required: true, trigger: ['blur', 'change'], message: 'Please input your time' }
      ]
    }

    //编辑表格某一条记录内容时的必填项校验(未实现)
    const rulesEdit = {
      /*editableData[key]: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your address' }
      ]*/
    }


    const dataSource = ref(store.state.tabledata);
    let colmunsref=ref(columns);
    const editableData = reactive({});
    const searchdata=ref(store.state.sourcetabledata)

    //数据编辑
    const edit = key => {
      // console.log(key)
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
      console.log(editableData[key])

    };
    //数据删除
    const onDelete = key => {
      dataSource.value = dataSource.value.filter(item => item.key !== key);
      // dataSource.value.forEach((value, index, array) =>{
      //   if (value.key===key){
      //     dataSource.value[index].delStatus =false
      //   }
      // });
    };
    //数据搜索
    const searchname = () => {
      dataSource.value = searchdata.value.filter(item => {
        return item.city.includes(formSearch.nameSearch)
      });

    };

    //编辑后保存
    const save = key => {
      if (editableData[key].name==="" ||editableData[key].age==="" ||editableData[key].address===""){
        Modal.error({
          title: () => '修改值不允许为空！'
        })
      }
      else {
        Modal.success({
          title: () => '修改成功！'
        })
        Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
        Object.assign(searchdata.value.filter(item => key === item.key)[0], editableData[key]);
        delete editableData[key];
      }


    };
    //取消编辑
    const cancel = key => {
      delete editableData[key];
    };

    //添加表单提交
    const handleOk = () => {
      addRef.value
        .validate()
        .then(() => {
          loading.value = true
          console.log('values', formAdd, toRaw(formAdd))
          let resdata={
            city: formAdd.city,
            province: formAdd.province,
            weather: formAdd.weather,
            winddirection: formAdd.winddirection,
            windpower: formAdd.windpower,
            reporttime: formAdd.reporttime
          }
          dataSource.value.push(resdata)
          searchdata.value.push(resdata)
          Modal.success({
            title: () => '注册成功！'
          })
          visible.value = false
          loading.value = false
          addRef.value.resetFields()

        })
        .catch(error => {
          console.log('error', error)
        })
    }
    //数据添加表单重置
    const resetForm = () => {
      addRef.value.resetFields()
    }
    //数据添加弹窗显示
    const showModal = () => {
      visible.value = true
    }
    //取消添加数据
    const handleCancel = () => {
      visible.value = false
      addRef.value.resetFields()
    }
    //excel操作
    let execll= ref(null)
    const changeEvent=()=>{
      // 获取当前input

      let file = execll.value.files;
      // console.log(execll)
      // 创建filereader
      let fileReader = new FileReader();
      // 把二进制数据流转为string
      fileReader.readAsBinaryString(file[0]);
      // execl表格里面的数据
      let execl_data = [];
      // filereader onload事件
      fileReader.onload = ev => {
        // 获取文件流
        let data = ev.target.result;
        try {
          // 用xlsx插件转码当前文件流
          let execl = XLSX.read(data, {
            type: "binary"
          });
          // 一个execl有多个sheets，这里拿到的是所有的sheets
          let Sheets = execl.Sheets;
          // 读取所有的sheets
          for (let sheet in Sheets) {
            let isNotNull = Sheets[sheet]["!ref"];
            // 判空
            if (isNotNull !== undefined) {
              // 获取execl所有数据
              execl_data = execl_data.concat(
                XLSX.utils.sheet_to_json(Sheets[sheet])
              );
            }
          }

          // 获取execl中数据的标题
          let col = [];
          colss.value=[]
          for (const key in execl_data[0]) {
            col.push({
              title: key.toString(),
              dataIndex: key.toString(),
              key: key.toString(),
              ellipsis: true,
              slots: {
                customRender: key.toString(),
              },
            });
            colss.value.push(key.toString())
          }
          // 填充表头
          // columns = Tools.unique(col);
          // console.log(col)
          col.push({
            title: 'operation',
            dataIndex: 'operation',
            slots: {
              customRender: 'operation',
            },
          })
          colmunsref.value = col
          // 填充数据
          dataSource.value = execl_data;
          console.log(typeof(file[0]));
        } catch (e) {
          console.error(e);
        }
      };
    }

    const exportexvel=()=>{
      // 随便声明一个结果
      // let arr=[{name:"小红",age:18},{name:"小明",age:20}]
      // 创建一个新的工作簿
      const workbook = XLSX.utils.book_new();
      // 创建一个新的工作表
      console.log(dataSource)
      const worksheet = XLSX.utils.json_to_sheet(dataSource.value);
      // 将工作表附加到工作簿，并将工作表命名为students
      XLSX.utils.book_append_sheet(workbook, worksheet, "data");
      // 导出工作簿，并命名导出文件名为Presidents.xlsx
      XLSX.writeFile(workbook, "dataexport.xlsx");

    }

    return {
      colss,
      execl: {},
      colmunsref,
      execll,
      exportexvel,
      changeEvent,
      dataSource,
      columns,
      editingKey: '',
      editableData,
      onDelete,
      edit,
      save,
      cancel,
      searchname,

      visible,
      loading,
      showModal,
      handleOk,
      handleCancel,
      labelCol: {
        span: 4
      },
      other: '',
      formSearch,
      searchRef,
      formAdd,
      addRef,
      rules,
      rulesEdit,
      options,
      resetForm,
      freshdata
    };
  },
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.delete-row-operations a {
  margin-right: 8px;
}

/*设置input的placeholder文字居中 */
input::input-placeholder { text-align: center }
input::-ms-input-placeholder{text-align: center;}
input::-webkit-input-placeholder{text-align: center;}
</style>
