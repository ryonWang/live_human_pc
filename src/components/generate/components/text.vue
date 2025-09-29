<template>
  <div class="form-cell">
    <div class="text-cell">
      <div class="preview-cell">
        <p>{{ model.script_content }}</p>
        <div v-if="!model.script_content" class="preview-tip">
          文案预览区
        </div>
      </div>
      <div class="input-cell">
        <el-input
          class="textarea"
          v-model="textarea"
          type="textarea"
          placeholder="请输入"
        />
        <div class="btn-cell">
          <div class="flex1"></div>
          <el-button type="primary" @click="model.script_content = textarea">确定</el-button>
        </div>
      </div>
    </div>
    <div class="pt24">
      <div class="input-title">
        <el-input
          v-model="model.video_title"
          placeholder="请输入"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
const model = defineModel()
const textarea = ref('')
</script>

<style lang="scss" scoped>
  @use '../index';
</style>
