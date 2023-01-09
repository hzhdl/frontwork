<template>
    <div>
      <a-button type="primary" @click="showModal">UserAdd</a-button>
      <a-modal v-model:visible="visible" title="UserAdd" @ok="handleOk">
        <template #footer>
          <a-button key="back" @click="handleCancel">Return</a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
        </template>
        <a-form ref="formRef" :model="form" :label-col="labelCol" :rules="rules">
          <a-form-item
            label="name"
            name="name"
            style="width: 450px"
          >
            <a-input v-model:value="form.id"></a-input>
          </a-form-item>

          <a-form-item
            label="age"
            name="age"
            style="width: 450px"
          >
            <a-input v-model:value="form.age"></a-input>
          </a-form-item>

          <a-form-item
            label="address"
            name="address"
            style="width: 450px"
          >
            <a-cascader v-model:value="form.address" :options="options" placeholder="Please select" />
          </a-form-item>

          </a-form>
      </a-modal>
    </div>
  </template>
<script>
import { defineComponent, ref, reactive, toRaw } from 'vue'
import { Modal } from 'ant-design-vue'

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

export default defineComponent({
  setup () {
    const loading = ref(false)
    const visible = ref(false)

    const formRef = ref()
    const form = reactive(
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
    const handleOk = () => {
      formRef.value
        .validate()
        .then(() => {
          loading.value = true
          console.log('values', form, toRaw(form))
          Modal.success({
            title: () => '注册成功！'
          })
          visible.value = false
          loading.value = false
          formRef.value.resetFields()
        })
        .catch(error => {
          console.log('error', error)
        })
    }
    const resetForm = () => {
      formRef.value.resetFields()
    }
    const showModal = () => {
      visible.value = true
    }

    const handleCancel = () => {
      visible.value = false
      formRef.value.resetFields()
    }

    return {
      formRef,
      visible,
      loading,
      showModal,
      handleOk,
      handleCancel,
      labelCol: {
        span: 4
      },
      other: '',
      form,
      rules,
      value: ref({
        value: '1'
      }),
      options,
      resetForm
    }
  }
})
</script>
