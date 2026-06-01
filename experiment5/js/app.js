/**
 * Vue 3 红绿灯模拟应用
 * 功能：模拟交通信号灯的自动切换、手动控制和倒计时显示
 */
const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

// 创建 Vue 应用实例
createApp({
    setup() {
        // 当前亮灯状态：'red' | 'yellow' | 'green'
        const currentLight = ref('green');
        // 倒计时剩余秒数
        const countdown = ref(30);
        // 用户设置的时间间隔（红绿灯持续时间） 
        const timeInterval = ref(30);
        // 是否处于手动保持模式
        const isHolding = ref(false);
        // 保持模式类型：'red' | 'green' | ''
        const holdMode = ref('');
        // 定时器引用，用于清除定时器
        let timer = null;
        
        /**
         * 计算属性：绿灯是否闪烁（倒计时最后3秒）
         * @returns {boolean} 绿灯是否处于闪烁状态
         */
        const isGreenFlashing = computed(() => {
            return currentLight.value === 'green' && countdown.value <= 3 && countdown.value > 0;
        });
        
        /**
         * 计算属性：是否显示倒计时数字
         * @returns {boolean} 是否显示倒计时
         */
        const showCountdown = computed(() => {
            return (currentLight.value === 'red' || currentLight.value === 'green') && countdown.value > 0 && countdown.value <= 10;
        });
        
        /**
         * 计算属性：当前状态文本显示
         * @returns {string} 状态文本
         */
        const statusText = computed(() => {
            if (isHolding.value) {
                return holdMode.value === 'red' ? 'Hold Red Mode' : 'Hold Green Mode';
            }
            const texts = {
                'red': 'Red Light - Stop',
                'yellow': 'Yellow Light - Caution',
                'green': 'Green Light - Go'
            };
            return texts[currentLight.value];
        });
        
        /**
         * 启动倒计时定时器
         * 每秒执行一次，更新倒计时或切换红绿灯
         */
        const startTimer = () => {
            // 清除之前的定时器，避免重复
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                // 如果处于保持模式，不执行倒计时
                if (isHolding.value) return;
                if (countdown.value > 0) {
                    countdown.value--;
                } else {
                    switchLight();
                }
            }, 1000);
        };
        
        /**
         * 切换红绿灯状态
         * 按照 green -> yellow -> red -> green 的顺序循环
         */
        const switchLight = () => {
            if (isHolding.value) return;
            switch (currentLight.value) {
                case 'green':
                    currentLight.value = 'yellow';
                    countdown.value = 3; // 黄灯持续3秒
                    break;
                case 'yellow':
                    currentLight.value = 'red';
                    countdown.value = timeInterval.value;
                    break;
                case 'red':
                    currentLight.value = 'green';
                    countdown.value = timeInterval.value;
                    break;
            }
        };
        
        /**
         * 保持红灯模式
         * 手动强制切换到红灯并保持
         */
        const holdRed = () => {
            isHolding.value = true;
            holdMode.value = 'red';
            currentLight.value = 'red';
            countdown.value = 0;
        };
        
        /**
         * 保持绿灯模式
         * 手动强制切换到绿灯并保持
         */
        const holdGreen = () => {
            isHolding.value = true;
            holdMode.value = 'green';
            currentLight.value = 'green';
            countdown.value = 0;
        };
        
        /**
         * 恢复自动模式
         * 退出手动保持模式，恢复自动红绿灯切换
         */
        const resumeAuto = () => {
            isHolding.value = false;
            holdMode.value = '';
            currentLight.value = 'green';
            countdown.value = timeInterval.value;
        };
        
        /**
         * 更新时间间隔
         * 当用户修改时间间隔输入框时触发
         */
        const updateInterval = () => {
            if (currentLight.value === 'green' || currentLight.value === 'red') {
                countdown.value = timeInterval.value;
            }
        };
        
        onMounted(() => {
            startTimer();
        });
        
        onUnmounted(() => {
            if (timer) clearInterval(timer);
        });
        
        return {
            currentLight,
            countdown,
            timeInterval,
            isHolding,
            holdMode,
            isGreenFlashing,
            showCountdown,
            statusText,
            holdRed,
            holdGreen,
            resumeAuto,
            updateInterval
        };
    }
}).mount('#app');