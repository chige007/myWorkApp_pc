<template>
<div id="home-page">
    <el-container style="height: 100%;">
        <el-header class="header" height="80">
            <my-header></my-header>
        </el-header>
        <el-container style="height: 100%">
            <el-main style="height: 100%">
                <div class="panelTitle">
                    <i class="el-icon-discover"></i><span>常用网站</span>
                </div>
                <el-button-group>
                    <el-button
                        size="medium"
                        icon="el-icon-plus"
                        @click="websiteClassDialogVisible = true">新增分类</el-button>
                    <el-button size="medium" icon="el-icon-refresh">同步数据</el-button>
                </el-button-group>
                <div class="websiteClassList">
                    <div class="noData" v-if="!websiteList || !websiteList.length">
                        还未添加网站，赶紧添加吧
                    </div>
                    <div
                        class="websiteClass"
                        v-for="(x, index_x) in websiteList"
                        :key="index_x">
                        <div class="websiteClassTitle">
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
                                :xs="6"
                                :sm="6"
                                :md="4"
                                :lg="4"
                                :xl="3"
                                class="website"
                                v-for="(y, index_y) in x.websites"
                                :key="index_y">
                                <el-popover placement="top" trigger="hover">
                                    <div style="text-align: center;" class="websiteOptBtns">
                                        <el-button type="text" @click="openWeb(y.url)"><i class="el-icon-search"></i></el-button>
                                        <el-button type="text" @click="editWebsite(x.id, y)"><i class="el-icon-edit"></i></el-button>
                                        <el-button type="text" @click="removeWebsite(x.id, y.id)"><i class="el-icon-delete"></i></el-button>
                                    </div>
                                    <div slot="reference" @click="openWeb(y.url)">
                                        <!-- <img class="icon" :src="y.icon ? 'file://' + y.icon : './../assets/logo.png'" alt="icon"> -->
                                        <img class="icon" :src="y.icon" alt="icon" @error="$event.target.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAA1VBMVEUAAABG7dFL28RL28RK3cVL3MVL28RL28RL28RK3MVL3cRI3sdL28RL28RL28RL2sRM28RK28RN3sVL2sRL28RL28RK3sVL2slD3slM2sNM28RL28RM28NL28RL28RL2sNM3MRL28RN3MVH38ZL28NL2sRM28QrO04ySl42anQuRVk7ion/0Fv////T9vG7o1u8pFvx/fvO9e9caHel7eLi17hEtqqRoKpBqJ59lZ7Rv49sd4XLt4E2cnh5jWu6n1b/8cz/6rf/1nKbnWeei1SNf1RRVk+KZdANAAAAJnRSTlMABZh0JlGpwbtILCH4383KsmYb7cV9NBQM89akopWQhGxXPRfnix1orbUAAAGDSURBVEjHldRnc4JAEIDhpSlgx95bsgYlMfau6f//JwX18ABPON5PLPPALHMzgL+yIolqKplSRUkpQ3CymERaUpQDbC+L/rI9YJfIIKtCgoWVKrKrKne2IuLjRMGL5RoGVfNsY+QxuLxBsZDGsNJ0mSaG13Kwgu7mb05zdKeQPbxLT16dJuju6bpLF716Si6mXo3diy5w6vgZ62RYmtdWG9M8fh9Nc7Mid5ZE6LZ2DtF8ob1bY9dkEtG0dYpbpwAE5NYogBxBy6BF0Bp0IugOtCLoZ4gh6TCkja2xazo4JAYikkaDW7PFx2JGx5FDRCgy9G77ud0xdBFyrHfvv/asd+dAoZp2sk4DhtbAYOlf64el+wAZqml/A4YuAECRamZUS7aWubUBdnFOrcK5EqfWL5oc/nr4AA/X5NivychTAkgSB5bgViwU1yHCbzMjgKt+JhCny+BJqAfgmAD+JJ4PpOlZps3qwK4Uv7NqCR4nS64HknEpASFVtFy7oTbaOa0C/v4BDvvq28qL/vsAAAAASUVORK5CYII='">
                                        <p>{{y.name}}</p>
                                    </div>
                                </el-popover>
                            </el-col>
                            <el-col
                                :xs="6"
                                :sm="6"
                                :md="4"
                                :lg="4"
                                :xl="3"
                                class="website-addBtn-wrap">
                                <div class="website-addBtn" @click="openWebsiteDialog(x.id)">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-main>
            <el-aside width="300px" style="padding: 20px; height: 100%;">
                <tomato-clock></tomato-clock>
                <work-notice></work-notice>
            </el-aside>
        </el-container>
    </el-container>

    <el-dialog
        title="编辑分类"
        :visible.sync="websiteClassDialogVisible"
        @closed="closeWebsiteClassDialog"
        width="400px">
        <el-form
            ref="websiteClassForm"
            :rules="websiteClassFormRules"
            :model="websiteClassFormData">
            <el-form-item label="分类名：" prop="name">
                <el-input v-model="websiteClassFormData.name"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="websiteClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveWebsiteClass">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog
        title="编辑网站"
        :visible.sync="websiteDialogVisible"
        @closed="closeWebsiteDialog"
        width="480px">
        <el-form
            ref="websiteForm"
            label-width="70px"
            style="padding: 10px 20px;"
            :rules="websiteFormRules"
            :model="websiteFormData">
            <el-form-item label="图标：" prop="icon">
                <div class="myUploadBtn" @click="uploadWebsiteIcon">
                    <i v-if="!websiteFormData.icon" class="el-icon-upload"></i>
                    <img v-else :src="'file://' + websiteFormData.icon" alt="icon">
                </div>
            </el-form-item>
            <el-form-item label="名称：" prop="name">
                <el-input v-model="websiteFormData.name"></el-input>
            </el-form-item>
            <el-form-item label="地址：" prop="url">
                <el-input v-model="websiteFormData.url"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="websiteDialogVisible = false">取 消</el-button>
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
import tomatoClock from './../components/tomatoClock'
import workNotice from './../components/workNotice'
import myHeader from './../components/header'
export default {
    props: {},
    computed: {},
    data() {
        return {
            websiteClassDialogVisible: false,
            websiteClassFormData: {
                id: '',
                name: ''
            },
            websiteClassFormRules: {
                name: [{
                    required: true,
                    message: '请填写分类名',
                    trigger: 'blur'
                }]
            },

            websiteDialogVisible: false,
            websiteFormRules: {
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
            websiteFormData: {
                id: '',
                classId: '',
                icon: '',
                name: '',
                url: '',
            },

            websiteList: []
        }
    },
    components: {
        tomatoClock,
        workNotice,
        myHeader
    },
    watch: {},
    methods: {
        // 保存网站分类信息
        saveWebsiteClass() {
            this.$refs.websiteClassForm.validate((valid) => {
                if (valid) {
                    let websiteClass = {
                        id: this.websiteClassFormData.id || uuidv1(),
                        name: this.websiteClassFormData.name,
                        websites: []
                    };
                    ipcRenderer.send('save-website-class', websiteClass);
                }
            });
        },
        // 删除网站分类
        removeWebsiteClass(id) {
            this.$confirm('此操作将永久删除该网站分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ipcRenderer.send('remove-website-class', id);
            }).catch(() => {});
        },
        // 编辑网站分类信息
        editWebsiteClassName(id, name) {
            this.websiteClassFormData.id = id;
            this.websiteClassFormData.name = name;
            this.websiteClassDialogVisible = true;
        },
        // 关闭网站分类编辑框
        closeWebsiteClassDialog() {
            for (let x in this.websiteClassFormData) {
                this.websiteClassFormData[x] = '';
            }
            this.$refs.websiteClassForm.clearValidate();
        },
        // 打开网站信息编辑框
        openWebsiteDialog(classId) {
            this.websiteFormData.classId = classId;
            this.websiteDialogVisible = true;
        },
        // 关闭网站信息编辑框
        closeWebsiteDialog() {
            for (let x in this.websiteFormData) {
                this.websiteFormData[x] = '';
            }
            this.$refs.websiteForm.clearValidate();
        },
        // 上传网站图标
        uploadWebsiteIcon() {
            ipcRenderer.send('upload-website-icon');
        },
        // 保存网站信息
        saveWebsite() {
            this.$refs.websiteForm.validate((valid) => {
                if (valid) {
                    let website = {
                        id: this.websiteFormData.id || uuidv1(),
                        icon: this.websiteFormData.icon,
                        name: this.websiteFormData.name,
                        url: this.websiteFormData.url
                    };
                    ipcRenderer.send('save-website', this.websiteFormData.classId, website);
                }
            });
        },
        // 编辑网站信息
        editWebsite(classId, website) {
            this.websiteFormData = Object.assign({}, website);
            this.websiteFormData.classId = classId;
            this.websiteDialogVisible = true;
        },
        // 删除网站信息
        removeWebsite(classId, websiteId) {
            this.$confirm('此操作将永久删除该网站信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ipcRenderer.send('remove-website', classId, websiteId);
            }).catch(() => {});
        },
        // 打开网站
        openWeb (url) {
            ipcRenderer.send('open-web', url);
        }
    },
    mounted() {
        // 获取所有网站信息
        ipcRenderer.send('get-websites');
        ipcRenderer.on('get-websites', (event, websites) => {
            this.websiteList = websites;
        })
        // 网站分类保存成功回调
        ipcRenderer.on('save-website-class-success', (event, websites) => {
            this.websiteList = websites;
            this.$refs.websiteClassForm.resetFields();
            this.$refs.websiteClassForm.clearValidate();
            this.websiteClassDialogVisible = false;
            this.$message({
                type: 'success',
                message: '保存成功',
                center: true
            });
        })
        // 网站分类保存成功回调
        ipcRenderer.on('save-website-success', (event, websites) => {
            this.websiteList = websites;
            this.$refs.websiteForm.resetFields();
            this.$refs.websiteForm.clearValidate();
            this.websiteDialogVisible = false;
            this.$message({
                type: 'success',
                message: '保存成功',
                center: true
            });
        })
        // 网站分类删除成功回调
        ipcRenderer.on('remove-website-class-success', (event, websites) => {
            this.websiteList = websites;
            this.$message({
                type: 'success',
                message: '删除成功',
                center: true
            });
        })
        // 网站信息删除成功回调
        ipcRenderer.on('remove-website-success', (event, websites) => {
            this.websiteList = websites;
            this.$message({
                type: 'success',
                message: '删除成功',
                center: true
            });
        })
        // 网站图标上传成功事件
        ipcRenderer.on('upload-website-icon-success', (event, path) => {
            this.$set(this.websiteFormData, 'icon', path[0]);
        })
    },
}
</script>

<style>
@import './../styles/home.css';
</style>
