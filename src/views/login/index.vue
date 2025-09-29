<template>
  <div class="login-cell">
    <div class="left">
      <div class="title-cell">
        <img src="@assets/images/logo.png" alt="">
        <p>AI数字人系统</p>
      </div>
      <ul>
        <li>100+数字人模特及配音</li>
        <li>1:1复刻你的形象和声音</li>
        <li>数字人口播视频一站式生成</li>
        <li>AI一键成片·全自动矩阵分发</li>
        <li>Al销售·响应式智能私域转化</li>
      </ul>
    </div>
    <div class="right">
      <h2>账号密码登录</h2>
      <el-form
        ref="dataFormRef"
        class="login-form"
        :rules="dataRule"
        :model="dataForm"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="dataForm.userName"
            v-input-rule
            size="large"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="dataForm.password"
            v-input-rule
            type="password"
            show-password
            size="large"
            placeholder="请输入密码"
            @keydown="handleKeyDown"
          />
        </el-form-item>
      </el-form>
      <div
        class="login-btn"
        @click="login(dataFormRef)"
      >
        登录
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { reactive, ref } from "vue"
import { ElMessage } from 'element-plus'
const router = useRouter()
const dataForm = reactive({
  userName: '',
  password: ''
})
const dataFormRef = ref()
const dataRule = reactive({
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})// 提交表单校验
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    login(dataFormRef.value)
  }
}
const login = async formEl => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      if (dataForm.userName.trim() === 'admin' && dataForm.password.trim() === 'admin') {
        router.replace({
          path: '/characterList'
        })
      } else {
        ElMessage.error('账号或密码错误')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
  @use 'index';
</style>
