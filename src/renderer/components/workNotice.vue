<template>
<div id="workNotice">
    <div class="panelTitle">
        <i class="el-icon-bell"></i><span>工作提醒</span>
        <div class="optBtns">
            <el-button
                size="small"
                icon="el-icon-plus"
                circle
                @click="dialogVisible = true"></el-button>
        </div>
    </div>
    <div class="noData" v-if="!listData || !listData.length">
        暂无工作提醒
    </div>
    <div v-if="listData.length" class="workList">
        <div
            class="item"
            v-for="(x, index) in listData"
            :key="index">
            <p class="content">{{x.content}}</p>
            <p class="time">{{x.date + ' ' + x.time}}</p>
            <i class="optBtn el-icon-edit" @click="onEdit(x)"></i>
            <i class="optBtn el-icon-delete" @click="remove(x.id)"></i>
        </div>
    </div>
    <el-dialog
        title="编辑工作提醒"
        :visible.sync="dialogVisible"
        @closed="closeDialog"
        width="480px">
        <el-form
            ref="form"
            label-width="100px"
            style="padding: 10px 20px;"
            :rules="formRules"
            :model="formData">
            <el-form-item label="工作内容：" prop="content">
                <el-input
                    v-model="formData.content"
                    type="textarea"
                    :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="提醒日期：" prop="date">
                <el-date-picker
                    style="width: 100%"
                    :editable="false"
                    v-model="formData.date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="具体时间：" prop="time">
                <el-time-picker
                    style="width: 100%"
                    :editable="false"
                    value-format="HH:mm"
                    format="HH:mm"
                    v-model="formData.time"
                    placeholder="选择时间">
                </el-time-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import {
    ipcRenderer
} from 'electron';
export default {
    props: {},
    computed: {},
    data() {
        return {
            listData: [],
            dialogVisible: false,
            formRules: {
                content: [{
                    required: true,
                    message: '请填写内容',
                    trigger: 'blur'
                }],
                date: [{
                    required: true,
                    message: '请选择提醒日期',
                    trigger: 'change'
                }],
                time: [{
                    required: true,
                    message: '请选择提醒时间',
                    trigger: 'change'
                }]
            },
            formData: {
                id: '',
                content: '',
                date: '',
                time: ''
            }
        }
    },
    components: {},
    watch: {},
    methods: {
        closeDialog() {
            for (let x in this.formData) {
                this.formData[x] = '';
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            })
        },
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (!this.formData.id) this.formData.id = uuidv1();
                    ipcRenderer.send('save-work-notice', this.formData);
                }
            });
        },
        edit(id) {
            this.formData.id = id;
            ipcRenderer.send('save-work-notice', this.formData);
        },
        onEdit(workNotice) {
            this.formData = Object.assign({}, workNotice);
            this.dialogVisible = true;
        },
        remove(id) {
            this.$confirm('此操作将永久删除工作提醒, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ipcRenderer.send('remove-work-notice', id);
            }).catch(() => {});
        }
    },
    mounted() {
        ipcRenderer.send('get-work-notice');
        ipcRenderer.on('get-work-notice', (event, workNotices) => {
            this.listData = workNotices;
        })
        ipcRenderer.on('remove-work-notice-success', (event, workNotices) => {
            this.listData = workNotices;
            this.$message({
                type: 'success',
                message: '删除成功',
                center: true
            });
        })
        ipcRenderer.on('save-work-notice-success', (event, workNotices) => {
            this.listData = workNotices;
            this.dialogVisible = false;
            this.$message({
                type: 'success',
                message: '保存成功',
                center: true
            });
        })
    },
}
</script>

<style>
@import './../styles/workNotice.css';
</style>
