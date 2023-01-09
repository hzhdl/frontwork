<template>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 2000 }">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <a>Delete</a>
      </template>
    </template>
<!--    <template #expandedRowRender="{ record }">-->
<!--      <p style="margin: 0">-->
<!--        {{ record.description }}-->
<!--      </p>-->
<!--    </template>-->
  </a-table>
</template>
<script>
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  fixed: true
}]

const data = [{
  key: 1,
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
}]
export default ({
  name: 'Tablee',
  setup () {
    return {
      data,
      columns
    }
  }
})
</script>
