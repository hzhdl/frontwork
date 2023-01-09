<template>
  <a-form ref="searchRef" :model="formSearch" label-width="100px">
    <a-space>
      SearchBy: 
      <a-row :gutter="5">
          <a-col :span="6.5">
              <a-input
              addon-before="name:"
              v-model:value = "formSearch.nameSearch"
              ref="nameSearch"
              ></a-input>
          </a-col>
          <a-col :span="6.5">
              <a-input
              addon-before="age:"
              v-model:value = "formSearch.ageSearch"
              ref="searchAge"
              ></a-input>
          </a-col>
          <a-col :span="6.5">
              <a-input
              addon-before="address:"
              v-model:value = "formSearch.addressSearch"
              ref="searchAddress"
              ></a-input>
          </a-col>
          <a-col>
              <a-button
              type="primary"
              @click="search"
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
    <a-table :columns="columns" :data-source="dataSource" bordered>

      <template v-for="col in ['name', 'age', 'address']" #[col]="{ text, record }" :key="col">
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
  
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  
  export default defineComponent({
    components: {
    SearchOutlined,
    PlusCircleOutlined,
  },
    setup() {
      //查询条件表单
      const searchRef = ref()
      const formSearch = reactive(
      {
        nameSearch: '',
        ageSearch: '',
        addressSearch: ''
      }
    )

    //信息添加表单
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


      const dataSource = ref(data);
      const editableData = reactive({});

      const add = () => {
        //editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
      };
  
      const edit = key => {
        editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
      };

      const onDelete = key => {
      dataSource.value = dataSource.value.filter(item => item.key !== key);
    };
  
      const save = key => {
        Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
        delete editableData[key];
      };
  
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

    const resetForm = () => {
      addRef.value.resetFields()
    }
    const showModal = () => {
      visible.value = true
    }

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
      value: ref({
        value: '1'
      }),
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
  </style>