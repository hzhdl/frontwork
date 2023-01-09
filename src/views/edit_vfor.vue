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
    </a-row>
    </a-space>
  </a-form>
  <!-- 数据列表 -->
    <a-table :columns="columns" :data-source="dataSource" bordered >
      <template v-for="col in ['name', 'age', 'address']" #[col]="{ text, record }" :key="col" :rules="rulesEdit">
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

  for (let i = 0; i < 10; i++) {
    data.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
      delStatus: true
    });
  }

  export default defineComponent({
    //图标组件
    components: {
    SearchOutlined,
    PlusCircleOutlined,
  },
    setup() {
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


      const dataSource = ref(data);
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

      return {
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
      resetForm

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
