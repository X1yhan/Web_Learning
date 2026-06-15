<template>
  <div class="app-root">
    <!-- 页面标题 -->
    <header class="app-header">
      <h1 class="app-title">
        <span class="title-icon">🚦</span>
        交通信号灯模拟系统
        <span class="title-icon">🚦</span>
      </h1>
      <p class="app-subtitle">Vue 3 + Element Plus · 直行 & 左转 协调控制</p>
    </header>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 红绿灯展示区：两灯并排 -->
      <div class="lights-display">
        <!-- 左转灯 -->
        <TrafficLightPole
          direction="left"
          :current-light="leftLight"
          :countdown="leftCountdown"
          :is-flashing="leftIsFlashing"
          label="左 转"
        />

        <!-- 路口分隔示意 -->
        <div class="road-divider">
          <div class="divider-line"></div>
          <span class="divider-text">十</span>
          <div class="divider-line"></div>
        </div>

        <!-- 直行灯 -->
        <TrafficLightPole
          direction="straight"
          :current-light="straightLight"
          :countdown="straightCountdown"
          :is-flashing="straightIsFlashing"
          label="直 行"
        />
      </div>

      <!-- 指示灯状态摘要 -->
      <div class="status-bar">
        <div class="status-item">
          <span class="status-dot" :class="straightLight"></span>
          <span>直行 {{ straightStatusLabel }}</span>
          <span class="status-time">剩余 {{ straightCountdown }}s</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-dot" :class="leftLight"></span>
          <span>左转 {{ leftStatusLabel }}</span>
          <span class="status-time">剩余 {{ leftCountdown }}s</span>
        </div>
      </div>

      <!-- 控制面板 -->
      <ControlPanel
        :is-auto="isAuto"
        :phase-remaining="phaseRemaining"
        :straight-light="straightLight"
        :left-light="leftLight"
        :straight-time="straightTime"
        :left-time="leftTime"
        @update:is-auto="handleAutoToggle"
        @update:straight-time="handleStraightTimeUpdate"
        @update:left-time="handleLeftTimeUpdate"
        @hold-straight-red="holdStraightRed"
        @hold-straight-green="holdStraightGreen"
        @hold-left-red="holdLeftRed"
        @hold-left-green="holdLeftGreen"
        @resume-auto="resumeAuto"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import TrafficLightPole from './components/TrafficLightPole.vue'
import ControlPanel from './components/ControlPanel.vue'

// ==================== 状态定义 ====================

/**
 * 6 阶段循环，确保红灯时长 = 绿灯时长：
 *   0：直行绿 · 左转红       straightTime
 *   1：直行黄 · 左转红       3s
 *   2：全红间隙A（补齐左转红灯）  max(0, leftTime - straightTime - 3)
 *   3：直行红 · 左转绿       leftTime
 *   4：直行红 · 左转黄       3s
 *   5：全红间隙B（补齐直行红灯）  max(0, straightTime - leftTime - 3)
 */
const phase = ref(0)

/** 当前阶段剩余秒数 */
const phaseRemaining = ref(30)

/** 直行绿灯时长（秒）= 直行红灯时长 */
const straightTime = ref(30)

/** 左转绿灯时长（秒）= 左转红灯时长 */
const leftTime = ref(20)

/** 黄灯时长（秒）—— 固定 */
const YELLOW_DURATION = 3

/** 阶段总数 */
const PHASE_COUNT = 6

/** 是否自动模式 */
const isAuto = ref(true)

/** 直行手动保持：null | 'red' | 'green' */
const holdStraight = ref(null)

/** 左转手动保持：null | 'red' | 'green' */
const holdLeft = ref(null)

/** 定时器引用 */
let timer = null

// ==================== 计算属性 ====================

/** 间隙A：直行黄后，补齐左转红灯时长 */
const gapA = computed(() => Math.max(0, leftTime.value - straightTime.value - YELLOW_DURATION))

/** 间隙B：左转黄后，补齐直行红灯时长 */
const gapB = computed(() => Math.max(0, straightTime.value - leftTime.value - YELLOW_DURATION))

/** 各阶段时长 */
const phaseDurations = computed(() => [
  straightTime.value,    // 0：直行绿
  YELLOW_DURATION,      // 1：直行黄
  gapA.value,           // 2：全红间隙A
  leftTime.value,        // 3：左转绿
  YELLOW_DURATION,      // 4：左转黄
  gapB.value            // 5：全红间隙B
])

/** 直行灯颜色 */
const straightLight = computed(() => {
  if (holdStraight.value === 'red') return 'red'
  if (holdStraight.value === 'green') return 'green'
  if (phase.value === 0) return 'green'
  if (phase.value === 1) return 'yellow'
  return 'red' // 阶段2,3,4,5
})

/** 左转灯颜色 */
const leftLight = computed(() => {
  if (holdLeft.value === 'red') return 'red'
  if (holdLeft.value === 'green') return 'green'
  if (phase.value === 3) return 'green'
  if (phase.value === 4) return 'yellow'
  return 'red' // 阶段0,1,2,5
})

/**
 * 直行倒计时：距离下一次状态变化
 *   阶段0（绿→黄）：phaseRemaining
 *   阶段1（黄→红）：phaseRemaining
 *   阶段2,3,4,5（红→绿）：累加剩余阶段时长
 */
const straightCountdown = computed(() => {
  if (!isAuto.value) {
    if (holdStraight.value) return 0
    return phaseRemaining.value
  }
  if (phase.value === 0 || phase.value === 1) return phaseRemaining.value
  // 红灯期间：累加直到阶段0
  if (phase.value === 2) return phaseRemaining.value + leftTime.value + YELLOW_DURATION + gapB.value
  if (phase.value === 3) return phaseRemaining.value + YELLOW_DURATION + gapB.value
  if (phase.value === 4) return phaseRemaining.value + gapB.value
  return phaseRemaining.value // 阶段5
})

/**
 * 左转倒计时：距离下一次状态变化
 *   阶段3（绿→黄）：phaseRemaining
 *   阶段4（黄→红）：phaseRemaining
 *   阶段5,0,1,2（红→绿）：累加剩余阶段时长
 */
const leftCountdown = computed(() => {
  if (!isAuto.value) {
    if (holdLeft.value) return 0
    return phaseRemaining.value
  }
  if (phase.value === 3 || phase.value === 4) return phaseRemaining.value
  // 红灯期间：累加直到阶段3
  if (phase.value === 5) return phaseRemaining.value + straightTime.value + YELLOW_DURATION + gapA.value
  if (phase.value === 0) return phaseRemaining.value + YELLOW_DURATION + gapA.value
  if (phase.value === 1) return phaseRemaining.value + gapA.value
  return phaseRemaining.value // 阶段2
})

// ==================== 闪烁状态 ====================

/** 直行绿灯是否闪烁（最后3秒） */
const straightIsFlashing = computed(() => {
  return isAuto.value &&
    straightLight.value === 'green' &&
    straightCountdown.value <= 3 &&
    straightCountdown.value > 0
})

/** 左转绿灯是否闪烁（最后3秒） */
const leftIsFlashing = computed(() => {
  return isAuto.value &&
    leftLight.value === 'green' &&
    leftCountdown.value <= 3 &&
    leftCountdown.value > 0
})

// ==================== 状态文本 ====================

const straightStatusLabel = computed(() => {
  const map = { red: '禁行', yellow: '警示', green: '通行' }
  return map[straightLight.value] || '--'
})

const leftStatusLabel = computed(() => {
  const map = { red: '禁行', yellow: '警示', green: '通行' }
  return map[leftLight.value] || '--'
})

// ==================== 核心定时器 ====================

/** 启动/重启定时器 */
const startTimer = () => {
  stopTimer()
  timer = setInterval(() => {
    if (!isAuto.value) return

    if (phaseRemaining.value > 1) {
      phaseRemaining.value--
    } else {
      advancePhase()
    }
  }, 1000)
}

/** 停止定时器 */
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/** 推进到下一阶段，跳过 0 时长阶段 */
const advancePhase = () => {
  do {
    phase.value = (phase.value + 1) % PHASE_COUNT
    phaseRemaining.value = phaseDurations.value[phase.value]
  } while (phaseRemaining.value === 0)
}

// ==================== 手动控制方法 ====================

const enterManualMode = () => {
  isAuto.value = false
}

const holdStraightRed = () => {
  enterManualMode()
  holdStraight.value = 'red'
  holdLeft.value = null
  phaseRemaining.value = 0
}

const holdStraightGreen = () => {
  enterManualMode()
  holdStraight.value = 'green'
  holdLeft.value = null
  phaseRemaining.value = 0
}

const holdLeftRed = () => {
  enterManualMode()
  holdLeft.value = 'red'
  holdStraight.value = null
  phaseRemaining.value = 0
}

const holdLeftGreen = () => {
  enterManualMode()
  holdLeft.value = 'green'
  holdStraight.value = null
  phaseRemaining.value = 0
}

/** 恢复自动模式 */
const resumeAuto = () => {
  isAuto.value = true
  holdStraight.value = null
  holdLeft.value = null
  phase.value = 0
  phaseRemaining.value = straightTime.value
  startTimer()
}

// ==================== 事件处理 ====================

const handleAutoToggle = (val) => {
  if (val) {
    resumeAuto()
  } else {
    enterManualMode()
  }
}

const handleStraightTimeUpdate = (val) => {
  straightTime.value = val
  if (isAuto.value && phase.value === 0) phaseRemaining.value = val
}

const handleLeftTimeUpdate = (val) => {
  leftTime.value = val
  if (isAuto.value && phase.value === 3) phaseRemaining.value = val
}

// ==================== 监听 ====================

watch(straightTime, (newVal) => {
  if (isAuto.value && phase.value === 0 && phaseRemaining.value > newVal) {
    phaseRemaining.value = newVal
  }
})

watch(leftTime, (newVal) => {
  if (isAuto.value && phase.value === 3 && phaseRemaining.value > newVal) {
    phaseRemaining.value = newVal
  }
})

// ==================== 生命周期 ====================

onMounted(() => {
  phaseRemaining.value = straightTime.value
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style>
/* ===== 全局样式 —— 参照实验五 ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>

<style scoped>
/* ===== 应用根容器 ===== */
.app-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

/* ===== 页头 ===== */
.app-header {
  text-align: center;
}

.app-title {
  font-size: 2em;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(100, 180, 255, 0.5);
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-bottom: 6px;
}

.title-icon {
  font-size: 0.85em;
  animation: bounce-icon 2s ease-in-out infinite;
}

.app-subtitle {
  color: rgba(255,255,255,0.5);
  font-size: 0.9em;
  letter-spacing: 1px;
}

@keyframes bounce-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ===== 主体布局 —— 参照实验五 .container ===== */
.main-content {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
}

/* ===== 灯光展示区：两灯并排 ===== */
.lights-display {
  display: flex;
  align-items: center;
  gap: 30px;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 100%);
  border-radius: 20px;
  padding: 30px 40px;
  border: 3px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.3);
}

/* ===== 路口分隔示意 ===== */
.road-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0.3;
}

.divider-line {
  width: 2px;
  height: 40px;
  background: rgba(255,255,255,0.5);
}

.divider-text {
  font-size: 1.2em;
  color: rgba(255,255,255,0.5);
  font-weight: bold;
}

/* ===== 底部状态栏 ===== */
.status-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px 24px;
  border: 1px solid rgba(255,255,255,0.08);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.85);
  font-size: 0.9em;
  font-weight: 500;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.red {
  background: #e74c3c;
  box-shadow: 0 0 10px rgba(231,76,60,0.8);
}

.status-dot.yellow {
  background: #f39c12;
  box-shadow: 0 0 10px rgba(243,156,18,0.8);
  animation: flash-yellow-dot 0.5s ease-in-out infinite;
}

.status-dot.green {
  background: #27ae60;
  box-shadow: 0 0 10px rgba(39,174,96,0.8);
}

@keyframes flash-yellow-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-time {
  color: rgba(255,255,255,0.4);
  font-size: 0.8em;
}

.status-divider {
  width: 1px;
  height: 18px;
  background: rgba(255,255,255,0.15);
}
</style>
