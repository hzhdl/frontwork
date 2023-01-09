<template>
  <a-form ref="formRef" :model="form" label-width="100px">
    <a-space>
    <a-row :gutter="5">
      SearchBy: </a-row>
      <a-row :gutter="5">
          <a-col :span="6.5">
              <a-input
              addon-before="name:"
              ref="searchName"
              ></a-input>
          </a-col>
          <a-col :span="6.5">
              <a-input
              addon-before="age:"
              ref="searchAge"
              ></a-input>
          </a-col>
          <a-col :span="6.5">
              <a-input
              addon-before="address:"
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
              @click="add"
              >
              <template #icon><PlusCircleOutlined /></template>
              add</a-button>
          </a-col>
    </a-row>
    </a-space>
  </a-form>
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
  import { defineComponent, reactive, ref } from 'vue';
  import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';

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
      const formRef = ref()
      const form = reactive(
      {
        name: '',
        age: '',
        address: ''
      }
    )

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
  
      return {
        dataSource,
        columns,
        editingKey: '',
        editableData,
        onDelete,
        edit,
        save,
        cancel,
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