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
    <div class="workList">
        <div class="item">
            <p class="content"></p>
            <p class="time"></p>
        </div>
    </div>
    <el-dialog
        title="编辑工作提醒"
        :visible.sync="dialogVisible"
        @closed="closeDialog"
        width="480px">
        <el-form
            ref="form"
            label-width="90px"
            style="padding: 10px 20px;"
            :rules="formRules"
            :model="formData">
            <el-form-item label="工作内容：" prop="content">
                <el-input
                    v-model="formData.content"
                    type="textarea"
                    :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="提醒时间：" prop="time">
                <el-date-picker
                    style="width: 100%"
                    v-model="formData.time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
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
export default {
    props: {},
    computed: {},
    data() {
        return {
            listData: [],
            dialogVisible: false,
            formRules: {

            },
            formData: {
                content: '',
                time: ''
            }
        }
    },
    components: {},
    watch: {},
    methods: {
        closeDialog() {

        },
        save() {

        }
    },
    mounted() {

    },
}
</script>

<style>
@import './../styles/workNotice.css';
</style>
