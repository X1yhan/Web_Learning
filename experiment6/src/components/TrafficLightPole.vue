<template>
  <div class="traffic-light-pole">
    <!-- 方向标签 -->
    <div class="pole-label">{{ label }}</div>

    <!-- 灯体外壳（参照实验五 .traffic-light-box） -->
    <div class="light-housing">
      <div class="light-container">
        <!-- 红灯 - 最上面 -->
        <div class="light-wrapper">
          <div
            class="light red-light"
            :class="{
              active: currentLight === 'red',
              'arrow-light': direction === 'left'
            }"
          >
            <!-- 左转红灯箭头：黑底 + 红色箭头 -->
            <svg v-if="currentLight === 'red' && direction === 'left'" class="arrow-svg arrow-red" viewBox="0 0 100 100">
              <polygon points="85,25 35,25 35,10 10,50 35,90 35,75 85,75" />
            </svg>
          </div>
        </div>

        <!-- 中间灯：黄灯 + 倒计时数字 -->
        <div class="light-wrapper">
          <div
            class="light yellow-light"
            :class="{
              active: currentLight === 'yellow',
              'arrow-light': direction === 'left'
            }"
          >
            <!-- 左转黄灯箭头：黑底 + 黄色箭头 -->
            <svg v-if="currentLight === 'yellow' && direction === 'left'" class="arrow-svg arrow-yellow" viewBox="0 0 100 100">
              <polygon points="85,25 35,25 35,10 10,50 35,90 35,75 85,75" />
            </svg>
            <!-- 倒计时数字 -->
            <span
              v-if="displayCountdown"
              class="countdown-text"
              :class="[
                `countdown-${currentLight}`,
                { flashing: isFlashing && currentLight === 'green' }
              ]"
            >
              {{ displayCountdown }}
            </span>
          </div>
        </div>

        <!-- 绿灯 - 最下面 -->
        <div class="light-wrapper">
          <div
            class="light green-light"
            :class="{
              active: currentLight === 'green',
              flashing: isFlashing && currentLight === 'green',
              'arrow-light': direction === 'left'
            }"
          >
            <!-- 左转绿灯箭头：黑底 + 绿色箭头 -->
            <svg v-if="currentLight === 'green' && direction === 'left'" class="arrow-svg arrow-green" viewBox="0 0 100 100">
              <polygon points="85,25 35,25 35,10 10,50 35,90 35,75 85,75" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 方向：'straight' 直行 | 'left' 左转 */
  direction: {
    type: String,
    required: true,
    validator: (v) => ['straight', 'left'].includes(v)
  },
  /** 当前亮灯：'red' | 'yellow' | 'green' */
  currentLight: {
    type: String,
    required: true,
    validator: (v) => ['red', 'yellow', 'green'].includes(v)
  },
  /** 倒计时秒数 */
  countdown: {
    type: Number,
    default: 0
  },
  /** 是否闪烁（绿灯最后3秒） */
  isFlashing: {
    type: Boolean,
    default: false
  },
  /** 标签文字 */
  label: {
    type: String,
    default: ''
  }
})

/**
 * 显示倒计时：
 * - 仅当倒计时 ≤ 9 秒时显示
 * - 黄灯时不显示
 */
const displayCountdown = computed(() => {
  if (props.countdown <= 0 || props.countdown > 9) return ''
  if (props.currentLight === 'yellow') return ''
  return props.countdown
})
</script>

<style scoped>
/* ===== 灯杆整体 ===== */
.traffic-light-pole {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ===== 方向标签 ===== */
.pole-label {
  font-size: 1.3em;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 15px rgba(255,255,255,0.5);
  letter-spacing: 3px;
  background: rgba(0,0,0,0.5);
  padding: 5px 18px;
  border-radius: 20px;
}

/* ===== 灯体外壳 —— 参照实验五 .traffic-light-box ===== */
.light-housing {
  background: linear-gradient(145deg, #2c3e50 0%, #1a252f 100%);
  border-radius: 30px;
  padding: 30px;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.5),
    inset 0 2px 10px rgba(255,255,255,0.1);
  border: 8px solid #34495e;
}

/* ===== 灯组容器 —— 参照实验五 .light-container ===== */
.light-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== 灯包装器 —— 参照实验五 .light-wrapper ===== */
.light-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

/* ===== 灯的基础样式 —— 参照实验五 .light ===== */
.light {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid #1a252f;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

/* ===== 红灯（未激活） ===== */
.red-light {
  background: #1a1a1a;
}

/* ===== 红灯激活 —— 参照实验五 .light.red.active ===== */
.red-light.active {
  background: radial-gradient(circle at 35% 35%, #ff6b6b, #c0392b);
  opacity: 1;
  box-shadow:
    0 0 60px rgba(255,0,0,0.8),
    inset 0 0 30px rgba(255,255,255,0.3);
  animation: pulse-red 1s ease-in-out infinite alternate;
}

/* ===== 黄灯（未激活） ===== */
.yellow-light {
  background: #1a1a1a;
}

/* ===== 黄灯激活 —— 参照实验五 .light.yellow.active ===== */
.yellow-light.active {
  background: radial-gradient(circle at 35% 35%, #ffd93d, #f39c12);
  opacity: 1;
  box-shadow:
    0 0 60px rgba(255,200,0,0.8),
    inset 0 0 30px rgba(255,255,255,0.3);
  animation: flash-yellow 0.5s ease-in-out infinite;
}

/* ===== 绿灯（未激活） ===== */
.green-light {
  background: #1a1a1a;
}

/* ===== 绿灯激活 —— 参照实验五 .light.green.active ===== */
.green-light.active {
  background: radial-gradient(circle at 35% 35%, #6bcf7f, #27ae60);
  opacity: 1;
  box-shadow:
    0 0 60px rgba(0,255,0,0.8),
    inset 0 0 30px rgba(255,255,255,0.3);
  animation: pulse-green 1s ease-in-out infinite alternate;
}

/* ===== 绿灯闪烁 —— 参照实验五 .light.green.active.flashing ===== */
.green-light.active.flashing {
  animation: flash-green 0.5s ease-in-out infinite;
}

/* ===== 箭头模式：黑底 + 彩色箭头（左转灯专用） ===== */

/* 红灯箭头模式：纯黑底，无光晕，仅箭头带红光 */
.red-light.arrow-light.active {
  background: #1a1a1a;
  box-shadow: none;
  animation: none;
}

/* 绿灯箭头模式：纯黑底，无光晕，仅箭头带绿光 */
.green-light.arrow-light.active {
  background: #1a1a1a;
  box-shadow: none;
  animation: none;
}

/* 绿灯箭头闪烁：圆不动，箭头闪 */
.green-light.arrow-light.active.flashing {
  animation: none;
}
.green-light.arrow-light.active.flashing .arrow-green {
  animation: flash-arrow 0.5s ease-in-out infinite;
}

/* ===== 箭头 SVG 基础 ===== */
.arrow-svg {
  width: 55%;
  height: 55%;
  z-index: 10;
}

/* 黄灯箭头模式：纯黑底，仅箭头带黄光 */
.yellow-light.arrow-light.active {
  background: #1a1a1a;
  box-shadow: none;
  animation: none;
}

/* 红色箭头 —— 匹配实验五 red-light 颜色 #ff6b6b，带微光 */
.arrow-red {
  fill: #ff6b6b;
  filter: drop-shadow(0 0 4px rgba(255,80,80,0.6));
}

/* 黄色箭头 —— 匹配实验五 yellow-light 颜色 #ffd93d，带微光 */
.arrow-yellow {
  fill: #ffd93d;
  filter: drop-shadow(0 0 4px rgba(255,200,30,0.6));
}

/* 绿色箭头 —— 匹配实验五 green-light 颜色 #6bcf7f，带微光 */
.arrow-green {
  fill: #6bcf7f;
  filter: drop-shadow(0 0 4px rgba(80,220,100,0.6));
}

/* ===== 倒计时数字 —— 参照实验五 .countdown-text ===== */
.countdown-text {
  font-size: 2.2em;
  font-weight: bold;
  z-index: 10;
}

/* 红灯时段：红色数字 */
.countdown-red {
  color: #ff4444;
  text-shadow: 0 0 10px rgba(255,60,60,0.8);
}

/* 绿灯时段：绿色数字 */
.countdown-green {
  color: #4ce44c;
  text-shadow: 0 0 10px rgba(60,255,60,0.8);
}

/* 黄灯时段：深色数字（黄灯背景明亮） */
.countdown-yellow {
  color: #1a1a1a;
  text-shadow: 0 0 6px rgba(0,0,0,0.4);
}

/* 倒计时闪烁 —— 参照实验五 .countdown-text.flashing */
.countdown-text.flashing {
  animation: flash-text 0.5s ease-in-out infinite;
}

/* ===== 关键帧动画 —— 全部参照实验五 ===== */

/* 红灯脉冲 */
@keyframes pulse-red {
  from {
    box-shadow: 0 0 60px rgba(255,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.3);
  }
  to {
    box-shadow: 0 0 100px rgba(255,0,0,1), inset 0 0 40px rgba(255,255,255,0.5);
  }
}

/* 黄灯闪烁 */
@keyframes flash-yellow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 绿灯脉冲 */
@keyframes pulse-green {
  from {
    box-shadow: 0 0 60px rgba(0,255,0,0.8), inset 0 0 30px rgba(255,255,255,0.3);
  }
  to {
    box-shadow: 0 0 100px rgba(0,255,0,1), inset 0 0 40px rgba(255,255,255,0.5);
  }
}

/* 绿灯快速闪烁 */
@keyframes flash-green {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* 文字闪烁 */
@keyframes flash-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 箭头闪烁（仅箭头，圆形灯不闪） */
@keyframes flash-arrow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.15; }
}
</style>
