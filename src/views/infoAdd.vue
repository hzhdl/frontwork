<template>
  <div class="addForm" > 
    <Caption class="titleAdd">UserAdd</Caption>
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item
            label="name"
            name="name"
            style="width: 450px"
          >
            <a-input v-model:value="form.name"></a-input>
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

          <a-form-item
          style="width: 450px">
            <a-space>
            <a-button
              type="primary"
              @click="handleOk"
              >Submit</a-button>
            <a-button @click="handleCancel">Reset</a-button>
          </a-space>
          </a-form-item>
        </a-form>
      </div>
</template>

<script>
import { defineComponent, reactive, ref, toRaw } from 'vue'
export default defineComponent({
  setup () {
    const formRef = ref()
    const form = reactive(
      {
        name: '',
        age: '',
        address: ''
      }
    )
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
    const handleCancel = () => {
      formRef.value.resetFields()
    }

    return {
      formRef,
      labelCol: {
        span: 4
      },
      other: '',
      form,
      rules,
      value: ref({
        value: ''
      }),
      options,
      handleOk,
      handleCancel
    }
  }
})
</script>
<style>
.addForm {
  margin-top: 200px;
  margin-left: 450px;
}
.titleAdd {
  margin-top: 0px;
  margin-left: 230px;
  font-size: larger;
}
</style>