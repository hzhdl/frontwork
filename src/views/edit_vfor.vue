<template>
  <a-form ref="searchRef" :model="formSearch" label-width="100px">
    <a-space>

      <a-row :gutter="5">
          <a-col :span="6.5">
            <a-form-item
            label="name"
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
            label="name"
            name="name"
            style="width: 450px"
          >
            <a-input v-model:value="formAdd.name"></a-input>
          </a-form-item>

          <a-form-item
            label="age"
            name="age"
            style="width: 450px"
          >
            <a-input v-model:value="formAdd.age"></a-input>
          </a-form-item>

          <a-form-item
            label="address"
            name="address"
            style="width: 450px"
          >
            <a-cascader v-model:value="formAdd.address" :options="options" placeholder="Please select" />
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
    <a-table :columns="colmunsref" :data-source="dataSource" bordered >
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
  import * as XLSX from 'xlsx'
  import Tools from '../tools/tools'

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
  let columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      slots: {
        customRender: 'name',
      },
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      slots: {
        customRender: 'age',
      },
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      slots: {
        customRender: 'address',
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
  let cols=['name','age','address']
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
      delStatus: true
    });
  }

  export default ({
    name:"edit_vfor",
    //图标组件
    components: {
    SearchOutlined,
    PlusCircleOutlined,
  },
    setup() {
      const colss=ref(cols)
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
        name: '',
        age: '',
        address: '',
        addressNew: '',
      }
    )

    //添加表单的必填项校验
    const rules = {
      name: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your name' }
      ],
      age: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your age' }
      ],
      address: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your address' }
      ]
    }

    //编辑表格某一条记录内容时的必填项校验(未实现)
    const rulesEdit = {
      /*editableData[key]: [
        { required: true, trigger: ['blur', 'change'], message: 'Please input your address' }
      ]*/
    }


      let dataSource = ref(data);
      let colmunsref=ref(columns);
      const editableData = reactive({});
      const searchdata=ref(data)

    //数据编辑
      const edit = key => {
        editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
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
          return item.name.includes(formSearch.nameSearch)
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
            key: formAdd.name.toString(),
            name: formAdd.name,
            age: formAdd.age,
            address: formAdd.address[0].toString() +"/"+formAdd.address[1].toString()+"/"+formAdd.address[2].toString(),
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
        colmunsref,
        execll,
        changeEvent,
        exportexvel,
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
        execl: {}
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
