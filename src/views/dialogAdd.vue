<template>
    <div>
      <a-button type="primary" @click="showModal">用户注册</a-button>
      <a-modal v-model:visible="visible" title="用户注册" @ok="handleOk">
        <template #footer>
          <a-button key="back" @click="handleCancel">返回</a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
        </template>
        <a-form ref="formRef" :model="form" :label-col="labelCol" :rules="rules">
          <a-form-item
            label="账号"
            name="id"
            style="width: 450px"
          >
            <a-input v-model:value="form.id"></a-input>
          </a-form-item>

          <a-form-item
            label="密码"
            name="password"
            style="width: 450px"
          >
          <a-input-password v-model:value="form.password"></a-input-password>
          </a-form-item>

          <a-form-item name="type" label="类型" style="width: 450px">
            <a-select
              v-model:value="form.type"
              style="width: 400px; label-width: 150px"
              placeholder="类型"
              :options="options"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="备注" name="note">
            <a-input
              type="textarea"
              :rows="2"
              v-model:value="form.note"
            ></a-input>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>
<script>
import { defineComponent, ref, reactive, toRaw } from 'vue'
import { Modal } from 'ant-design-vue'
export default defineComponent({
  setup () {
    const loading = ref(false)
    const visible = ref(false)

    const formRef = ref()
    const form = reactive(
      {
        password: '',
        id: '',
        type: '',
        note: ''
      }
    )
    const options = ref([
      {
        value: '1',
        label: '管理员'
      },
      {
        value: '2',
        label: '用户'
      }
    ])
    const rules = {
      id: [
        { required: true, trigger: 'blur', message: '请输入账号' }
      ],
      password: [
        { required: true, trigger: 'blur', message: '请输入密码' }
      ],
      type: [
        { required: true, trigger: 'blur', message: '请选择用户类型' }
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
