<template>
<div id="home-page">
    <el-container style="height: 100%;">
        <el-header class="header" height="80">
            <div class="logo">
                <img src="./../assets/logo.png" alt="logo">
                <span>我的工作空间</span>
            </div>
            <div class="header-btns">
                <el-button type="primary" size="mini">注册</el-button>
                <el-button size="mini">登录</el-button>
            </div>
        </el-header>
        <el-container>
            <el-main>
                <el-button-group>
                    <el-button
                        size="small"
                        icon="el-icon-plus"
                        @click="addClassDialogVisible = true">新增分类</el-button>
                    <el-button size="small" icon="el-icon-refresh">同步数据</el-button>
                    <el-button size="small" icon="el-icon-delete">批量删除</el-button>
                </el-button-group>
                <div class="websiteClassList">
                    <div
                        class="websiteClass"
                        v-for="(x, index_x) in websiteList"
                        :key="index_x">
                        <div class="title">
                            <i class="el-icon-menu"></i>
                            <span>{{x.name}}</span>
                        </div>
                        <el-row class="websiteList">
                            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" class="website" v-for="index_y in x.websites" :key="index_y">
                                <div>
                                    <img class="icon" :src="y.icon || './../assets/logo.png'" alt="icon">
                                    <p>y.name</p>
                                </div>
                            </el-col>
                            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" class="website-addBtn-wrap">
                                <div class="website-addBtn" @click="openAddWebsiteDialog">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-main>
            <el-aside width="300px" style="padding: 20px 20px 20px 0px;">
                <div id="tomatoClock">

                </div>
            </el-aside>
        </el-container>
    </el-container>

    <el-dialog
        title="新增分类"
        :visible.sync="addClassDialogVisible"
        width="400px">
        <el-form
            ref="addClassForm"
            :rules="addClassFormRules"
            :model="addClassFormData">
            <el-form-item label="分类名：" prop="name">
                <el-input v-model="addClassFormData.name"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeAddClassDialog">取 消</el-button>
            <el-button type="primary" @click="addClass">确 定</el-button>
        </div>
    </el-dialog>


    <el-dialog
        title="新增网站"
        :visible.sync="addWebsiteDialogVisible"
        width="480px">
        <el-form
            ref="addClassForm"
            label-width="70px"
            style="padding: 10px 20px;"
            :rules="addWebsiteFormRules"
            :model="addWebsiteFormData">
            <el-form-item label="图标：" prop="icon">
                <div class="myUploadBtn" @click="uploadWebsiteIcon">
                    <i class="el-icon-upload"></i>
                </div>
                <input v-model="addWebsiteFormData.icon" type="hidden"/>
            </el-form-item>
            <el-form-item label="名称：" prop="name">
                <el-input v-model="addWebsiteFormData.name"></el-input>
            </el-form-item>
            <el-form-item label="地址：" prop="url">
                <el-input v-model="addWebsiteFormData.url"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeAddWebsiteDialog">取 消</el-button>
            <el-button type="primary" @click="addWebsite">确 定</el-button>
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
            addClassDialogVisible: false,
            addClassFormData: {
                name: ''
            },
            addClassFormRules: {
                name: [{
                    required: true,
                    message: '请填写分类名',
                    trigger: 'blur'
                }]
            },

            addWebsiteDialogVisible: false,
            addWebsiteFormRules: {
                name: [{
                    required: true,
                    message: '请填写名称',
                    trigger: 'blur'
                }],
                url: [{
                    required: true,
                    message: '请填写访问地址',
                    trigger: 'blur'
                }]
            },
            addWebsiteFormData: {
                classId: '',
                icon: '',
                name: '',
                url: '',
            },

            websiteList: []
        }
    },
    components: {},
    watch: {},
    methods: {
        addClass() {
            this.$refs.addClassForm.validate((valid) => {
                if (valid) {
                    let dataObj = {
                        name: this.addClassFormData.name,
                        websites: []
                    };
                    this.websiteList.push(dataObj);
                    this.$refs.addClassForm.resetFields();
                    this.$refs.addClassForm.clearValidate();
                    this.addClassDialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                        center: true
                    });
                }
            });
        },
        closeAddClassDialog () {
            this.$refs.addClassForm.resetFields();
            this.$refs.addClassForm.clearValidate();
            this.addClassDialogVisible = false;
        },
        openAddWebsiteDialog () {
            this.addWebsiteDialogVisible = true;
        },
        closeAddWebsiteDialog () {
            this.addWebsiteDialogVisible = false;
        },
        uploadWebsiteIcon () {

        },
        addWebsite () {

        }
    },
    mounted() {},
}
</script>

<style>
@import './../styles/home.css';
</style>
