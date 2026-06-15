<template>
  <el-card class="control-panel" shadow="hover">
    <template #header>
      <div class="panel-header">
        <el-icon :size="22"><Setting /></el-icon>
        <span>控制面板</span>
      </div>
    </template>

    <!-- 模式切换 -->
    <div class="control-section">
      <div class="section-row">
        <span class="section-label">运行模式</span>
        <el-switch
          v-model="autoMode"
          active-text="自动"
          inactive-text="手动"
          size="large"
          @change="handleModeChange"
        />
      </div>
    </div>

    <el-divider />

    <!-- 当前状态 -->
    <div class="control-section">
      <div class="section-title">当前状态</div>
      <div class="status-tags">
        <el-tag
          :type="straightTagType"
          size="large"
          effect="dark"
          round
        >
          直行：{{ straightStatusText }}
        </el-tag>
        <el-tag
          :type="leftTagType"
          size="large"
          effect="dark"
          round
        >
          左转：{{ leftStatusText }}
        </el-tag>
      </div>
      <div class="countdown-info">
        <span>当前阶段剩余：<strong>{{ phaseRemaining }}s</strong></span>
      </div>
    </div>

    <el-divider />

    <!-- 时间设置 -->
    <div class="control-section">
      <div class="section-title">绿灯时长设置</div>
      <div class="time-inputs">
        <div class="time-input-row">
          <span class="time-label">直行绿灯：</span>
          <el-input-number
            v-model="straightGreenTime"
            :min="5"
            :max="120"
            :step="5"
            size="large"
          />
          <span class="unit">秒</span>
        </div>
        <div class="time-input-row">
          <span class="time-label">左转绿灯：</span>
          <el-input-number
            v-model="leftGreenTime"
            :min="5"
            :max="60"
            :step="5"
            size="large"
          />
          <span class="unit">秒</span>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 直行手动控制 -->
    <div class="control-section">
      <div class="section-title">直行手动控制</div>
      <div class="button-row">
        <el-button
          type="danger"
          :disabled="!isManual"
          @click="handleHoldStraightRed"
          round
        >
          <el-icon><CircleCloseFilled /></el-icon>
          保持直行红灯
        </el-button>
        <el-button
          type="success"
          :disabled="!isManual"
          @click="handleHoldStraightGreen"
          round
        >
          <el-icon><CircleCheckFilled /></el-icon>
          保持直行绿灯
        </el-button>
      </div>
    </div>

    <!-- 左转手动控制 -->
    <div class="control-section">
      <div class="section-title">左转手动控制</div>
      <div class="button-row">
        <el-button
          type="danger"
          :disabled="!isManual"
          @click="handleHoldLeftRed"
          round
        >
          <el-icon><CircleCloseFilled /></el-icon>
          保持左转红灯
        </el-button>
        <el-button
          type="success"
          :disabled="!isManual"
          @click="handleHoldLeftGreen"
          round
        >
          <el-icon><CircleCheckFilled /></el-icon>
          保持左转绿灯
        </el-button>
      </div>
    </div>

    <el-divider />

    <!-- 恢复自动 -->
    <div class="control-section">
      <el-button
        type="primary"
        size="large"
        @click="handleResumeAuto"
        round
        class="resume-btn"
      >
        <el-icon><RefreshRight /></el-icon>
        恢复自动模式
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  Setting,
  CircleCloseFilled,
  CircleCheckFilled,
  RefreshRight
} from '@element-plus/icons-vue'

const props = defineProps({
  /** 是否自动模式 */
  isAuto: { type: Boolean, required: true },
  /** 当前阶段剩余秒数 */
  phaseRemaining: { type: Number, required: true },
  /** 直行灯状态 */
  straightLight: { type: String, required: true },
  /** 左转灯状态 */
  leftLight: { type: String, required: true },
  /** 直行绿灯时长 */
  straightTime: { type: Number, required: true },
  /** 左转绿灯时长 */
  leftTime: { type: Number, required: true }
})

const emit = defineEmits([
  'update:isAuto',
  'update:straightTime',
  'update:leftTime',
  'holdStraightRed',
  'holdStraightGreen',
  'holdLeftRed',
  'holdLeftGreen',
  'resumeAuto'
])

/** 自动模式双向绑定 */
const autoMode = computed({
  get: () => props.isAuto,
  set: (val) => emit('update:isAuto', val)
})

/** 直行绿灯时长双向绑定 */
const straightGreenTime = computed({
  get: () => props.straightTime,
  set: (val) => emit('update:straightTime', val)
})

/** 左转绿灯时长双向绑定 */
const leftGreenTime = computed({
  get: () => props.leftTime,
  set: (val) => emit('update:leftTime', val)
})

/** 是否手动模式 */
const isManual = computed(() => !props.isAuto)

/** 直行状态标签类型 */
const straightTagType = computed(() => {
  const map = { red: 'danger', yellow: 'warning', green: 'success' }
  return map[props.straightLight] || 'info'
})

/** 左转状态标签类型 */
const leftTagType = computed(() => {
  const map = { red: 'danger', yellow: 'warning', green: 'success' }
  return map[props.leftLight] || 'info'
})

/** 直行状态文本 */
const straightStatusText = computed(() => {
  const map = { red: '🔴 禁行', yellow: '🟡 警示', green: '🟢 通行' }
  return map[props.straightLight] || '未知'
})

/** 左转状态文本 */
const leftStatusText = computed(() => {
  const map = { red: '🔴 禁行', yellow: '🟡 警示', green: '🟢 通行' }
  return map[props.leftLight] || '未知'
})

/** 模式切换 */
const handleModeChange = (val) => {
  if (val) {
    handleResumeAuto()
  }
}

const handleHoldStraightRed = () => emit('holdStraightRed')
const handleHoldStraightGreen = () => emit('holdStraightGreen')
const handleHoldLeftRed = () => emit('holdLeftRed')
const handleHoldLeftGreen = () => emit('holdLeftGreen')
const handleResumeAuto = () => emit('resumeAuto')
</script>

<style scoped>
.control-panel {
  width: 380px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(10px);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2em;
  font-weight: bold;
  color: #303133;
}

.control-section {
  margin-bottom: 4px;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  font-weight: 600;
  color: #606266;
  font-size: 0.95em;
}

.section-title {
  font-weight: 600;
  color: #606266;
  margin-bottom: 12px;
  font-size: 0.95em;
}

.status-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.status-tags .el-tag {
  font-size: 1em;
  padding: 8px 16px;
}

.countdown-info {
  text-align: center;
  color: #606266;
  font-size: 1em;
}

.countdown-info strong {
  color: #409eff;
  font-size: 1.3em;
}

.time-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
}

.unit {
  color: #909399;
  font-size: 0.9em;
}

.button-row {
  display: flex;
  gap: 10px;
}

.button-row .el-button {
  flex: 1;
}

.resume-btn {
  width: 100%;
}

/* Element Plus 分割线边距调整 */
:deep(.el-divider) {
  margin: 16px 0;
}

/* Element Plus 卡片头部调整 */
:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 2px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 16px 20px;
}
</style>
