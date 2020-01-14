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
                        size="medium"
                        icon="el-icon-plus"
                        @click="addClassDialogVisible = true">新增分类</el-button>
                    <el-button size="medium" icon="el-icon-refresh">同步数据</el-button>
                </el-button-group>
                <div class="websiteClassList">
                    <div
                        class="websiteClass"
                        v-for="(x, index_x) in websiteList"
                        :key="index_x">
                        <div class="title">
                            <i class="icon el-icon-s-flag"></i>
                            <span>{{x.name}}</span>
                            <div class="optBts">
                                <el-button
                                    size="small"
                                    icon="el-icon-edit"
                                    circle
                                    @click="editWebsiteClassName(x.id, x.name)"></el-button>
                                <el-button
                                    size="small"
                                    icon="el-icon-delete"
                                    slot="reference"
                                    circle
                                    @click="removeWebsiteClass(x.id)"></el-button>
                            </div>
                        </div>
                        <el-row class="websiteList">
                            <el-col
                                :xs="8"
                                :sm="6"
                                :md="4"
                                :lg="3"
                                :xl="2"
                                class="website"
                                v-for="(y, index_y) in x.websites"
                                :key="index_y">
                                <el-popover placement="top" trigger="hover">
                                    <div style="text-align: center;">
                                        <el-button type="text" @click="editWebsite(x.id, y)">修改</el-button>
                                        <el-button type="text" @click="removeWebsite(x.id, y.id)">删除</el-button>
                                    </div>
                                    <div slot="reference">
                                        <!-- <img class="icon" :src="y.icon ? 'file://' + y.icon : './../assets/logo.png'" alt="icon"> -->
                                        <img class="icon" src="./../assets/logo.png" alt="icon">
                                        <p>{{y.name}}</p>
                                    </div>
                                </el-popover>
                            </el-col>
                            <el-col
                                :xs="8"
                                :sm="6"
                                :md="4"
                                :lg="3"
                                :xl="2"
                                class="website-addBtn-wrap">
                                <div class="website-addBtn" @click="openAddWebsiteDialog(x.id)">
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
        title="编辑分类"
        :visible.sync="addClassDialogVisible"
        @closed="closeAddClassDialog"
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
            <el-button @click="addClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveWebsiteClass">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog
        title="编辑网站"
        :visible.sync="addWebsiteDialogVisible"
        @closed="closeAddWebsiteDialog"
        width="480px">
        <el-form
            ref="addWebsiteForm"
            label-width="70px"
            style="padding: 10px 20px;"
            :rules="addWebsiteFormRules"
            :model="addWebsiteFormData">
            <el-form-item label="图标：" prop="icon">
                <div class="myUploadBtn" @click="uploadWebsiteIcon">
                    <i v-if="!addWebsiteFormData.icon" class="el-icon-upload"></i>
                    <img v-else :src="'file://' + addWebsiteFormData.icon" alt="icon">
                </div>
            </el-form-item>
            <el-form-item label="名称：" prop="name">
                <el-input v-model="addWebsiteFormData.name"></el-input>
            </el-form-item>
            <el-form-item label="地址：" prop="url">
                <el-input v-model="addWebsiteFormData.url"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addWebsiteDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveWebsite">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    ipcRenderer
} from 'electron'
import uuidv1 from 'uuid/v1'
export default {
    props: {},
    computed: {},
    data() {
        return {
            addClassDialogVisible: false,
            addClassFormData: {
                id: '',
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
                id: '',
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
        saveWebsiteClass() {
            this.$refs.addClassForm.validate((valid) => {
                if (valid) {
                    let websiteClass = {
                        id: this.addClassFormData.id || uuidv1(),
                        name: this.addClassFormData.name,
                        websites: []
                    };
                    ipcRenderer.send('save-website-class', websiteClass);
                }
            });
        },
        saveWebsiteClassSuccess(websites) {
            this.websiteList = websites;
            this.$refs.addClassForm.resetFields();
            this.$refs.addClassForm.clearValidate();
            this.addClassDialogVisible = false;
            this.$message({
                type: 'success',
                message: '添加成功',
                center: true
            });
        },
        removeWebsiteClass(id) {
            this.$confirm('此操作将永久删除该网站分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ipcRenderer.send('remove-website-class', id);
            }).catch(() => {});
        },
        editWebsiteClassName(id, name) {
            this.addClassFormData.id = id;
            this.addClassFormData.name = name;
            this.addClassDialogVisible = true;
        },
        closeAddClassDialog() {
            this.$refs.addClassForm.resetFields();
            this.$refs.addClassForm.clearValidate();
        },
        openAddWebsiteDialog(classId) {
            this.addWebsiteFormData.classId = classId;
            this.addWebsiteDialogVisible = true;
        },
        closeAddWebsiteDialog() {
            this.$refs.addWebsiteForm.resetFields();
            this.$refs.addWebsiteForm.clearValidate();
        },
        uploadWebsiteIcon() {
            ipcRenderer.send('upload-website-icon');
        },
        saveWebsite() {
            this.$refs.addWebsiteForm.validate((valid) => {
                if (valid) {
                    let website = {
                        id: this.addWebsiteFormData.id || uuidv1(),
                        icon: this.addWebsiteFormData.icon,
                        name: this.addWebsiteFormData.name,
                        url: this.addWebsiteFormData.url
                    };
                    ipcRenderer.send('save-website', this.addWebsiteFormData.classId, website);
                }
            });
        },
        editWebsite(classId, website) {
            this.addWebsiteFormData = Object.assign({}, website);
            this.addWebsiteFormData.classId = classId;
            this.addWebsiteDialogVisible = true;
        },
        removeWebsite(classId, websiteId) {
            this.$confirm('此操作将永久删除该网站信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ipcRenderer.send('remove-website', classId, websiteId);
            }).catch(() => {});
        },
        saveWebsiteSuccess(websites) {
            this.websiteList = websites;
            this.$refs.addWebsiteForm.resetFields();
            this.$refs.addWebsiteForm.clearValidate();
            this.addWebsiteDialogVisible = false;
            this.$message({
                type: 'success',
                message: '添加成功',
                center: true
            });
        }
    },
    mounted() {
        ipcRenderer.send('get-websites');
        ipcRenderer.on('get-websites', (event, websites) => {
            this.websiteList = websites;
        })

        ipcRenderer.on('upload-website-icon-success', (event, path) => {
            this.$set(this.addWebsiteFormData, 'icon', path[0]);
            console.log(this.addWebsiteFormData);
        })
        ipcRenderer.on('save-website-class-success', (event, websites) => {
            this.saveWebsiteClassSuccess(websites);
        })
        ipcRenderer.on('remove-website-class-success', (event, websites) => {
            this.websiteList = websites;
            this.$message({
                type: 'success',
                message: '删除成功',
                center: true
            });
        })
        ipcRenderer.on('remove-website-success', (event, websites) => {
            this.websiteList = websites;
            this.$message({
                type: 'success',
                message: '删除成功',
                center: true
            });
        })
        ipcRenderer.on('save-website-success', (event, websites) => {
            this.saveWebsiteSuccess(websites);
        })
    },
}
</script>

<style>
@import './../styles/home.css';
</style>
