<template>
<div id="tomatoClock">
    <div class="panelTitle">
        <i class="el-icon-timer"></i><span>番茄钟</span>
    </div>
    <el-progress
        :stroke-width="10"
        type="circle"
        :percentage="percentage"
        :show-text="false"
        :width="200"
        :color="color">
    </el-progress>
    <p class="tips">{{text}}</p>
    <el-button
        v-show="status == 'readyToWork'"
        type="primary"
        size="medium"
        @click="start">开始工作</el-button>
    <el-button
        v-show="status == 'readyToRest'"
        type="primary"
        size="medium"
        @click="rest">开始休息</el-button>
</div>
</template>

<script>
import {
    ipcRenderer
} from 'electron'
import Timer from 'timer.js'
export default {
    props: {},
    computed: {},
    data() {
        return {
            status: 'readyToWork',
            percentage: 100,
            text: '开始工作吧',
            color: [{
                    color: '#f56c6c',
                    percentage: 20
                },
                {
                    color: '#e6a23c',
                    percentage: 40
                },
                {
                    color: '#5cb87a',
                    percentage: 60
                },
                {
                    color: '#1989fa',
                    percentage: 99
                },
                {
                    color: '#ddd',
                    percentage: 100
                }
            ]
        }
    },
    components: {},
    watch: {},
    methods: {
        start() {
            this.status = 'working';
            // this.progressStatus = 'exception';
            let min = 0.1;
            let timer = new Timer({
                tick: 1,
                ontick: (sec) => {
                    let s = (sec / 1000).toFixed(0);
                    let ss = s % 60;
                    ss = ss < 10 ? '0' + ss : ss;
                    let mm = Math.floor(s / 60);
                    mm = mm < 10 ? '0' + mm : mm;
                    this.percentage = s / (60 * min) * 100;
                    this.text = `${mm} : ${ss}`;
                },
                onend: async () => {
                    this.progressStatus = null;
                    this.percentage = 100;
                    this.status = 'readyToRest';
                    this.text = '工作结束';
                    let result = await ipcRenderer.invoke('notification-goto-rest');
                }
            })
            timer.start(60 * min);
        },
        rest() {
            this.status = 'resting';
            // this.progressStatus = 'exception';
            let min = 0.05;
            let timer = new Timer({
                tick: 1,
                ontick: (sec) => {
                    let s = (sec / 1000).toFixed(0);
                    let ss = s % 60;
                    let mm = Math.floor(s / 60);
                    this.percentage = s / (60 * min) * 100;
                    this.text = `${mm} : ${ss}`;
                },
                onend: async () => {
                    this.progressStatus = null;
                    this.percentage = 100;
                    this.status = 'readyToWork';
                    this.text = '休息结束';
                    let result = await ipcRenderer.invoke('notification-goto-work');
                }
            })
            timer.start(60 * min);
        }
    },
    mounted() {},
}
</script>

<style>
@import './../styles/tomatoClock.css';
</style>
