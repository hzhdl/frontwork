<template>
  <div>
    <div class="container">
      <div class="form-box">
        <a-form ref="formRef" :model="form" label-width="100px" :rules="rules">
          <a-form-item
            label="编号"
            prop="id"
            style="width: 500px"
          >
            <a-input v-model="form.id"></a-input>
          </a-form-item>

          <a-form-item prop="type" label="类型" style="width: 500px">
            <a-select
              v-model:value="value"
              label-in-value
              style="width: 400px"
              placeholder="类型"
              autofocus="true"
              :options="options"
            >
            </a-select>
          </a-form-item>

          <a-form-item label="imei" prop="imei" style="width: 500px">
            <a-input v-model="form.imei"></a-input>
          </a-form-item>
          <a-form-item label="芯片ID" prop="chipId" style="width: 500px">
            <a-input v-model="form.chipId"></a-input>
          </a-form-item>
          <a-form-item label="车架号" prop="vin" style="width: 500px">
            <a-input v-model="form.vin"></a-input>
          </a-form-item>
          <a-form-item label="公钥" prop="publicKey">
            <a-input
              type="textarea"
              :rows="2"
              v-model="form.publicKey"
            ></a-input>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              @click="onSubmit"
              style="margin-left: 80px"
              >提交</a-button
            >
            <a-button @click="resetForm">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRaw } from 'vue'
export default defineComponent({
  setup () {
    const formRef = ref()
    const form = reactive(
      {
        id: '',
        type: '',
        imei: '',
        vin: '',
        chipId: '',
        publicKey: ''
      }
    )
    const options = ref([
      {
        value: '1',
        label: '动力'
      },
      {
        value: '2',
        label: '底盘'
      }
    ])
    const rules = {
      id: [
        { required: true, trigger: 'blur', message: '请输入编号' }
      ],
      vin: [
        {
          required: true,
          trigger: 'change',
          pattern: /^[A-HJ-NPR-Z\d]{17}$/,
          message: '请输入17位数字或大写字母(I、O、Q除外)的组合!'
        }
      ],
      chipId: [
        { required: true, trigger: 'blur', message: '芯片ID不能为空' }
      ],
      publicKey: [
        { required: true, trigger: 'blur', message: '公钥不能为空' }
      ]
    }
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', form, toRaw(form))
        })
        .catch(error => {
          console.log('error', error)
        })
    }
    const resetForm = () => {
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
        value: '动力'
      }),
      options,
      onSubmit,
      resetForm
    }
  }
})
</script>
