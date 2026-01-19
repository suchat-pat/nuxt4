<template>
    <v-container >
        <v-row >
            <v-col cols="12">
                <v-card>
                    <v-sheet class="pa-4" color="#404040">
                        <h1 class="text-center text-h5 font-weight-bold">แก้ไขข้อมูลส่วนตัว</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.first_name" :error-messages="error.first_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.last_name" :error-messages="error.last_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" type="password" v-model="form.password" :error-messages="error.password"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" type="password" v-model="confrimPassword" :error-messages="error.confrimPassword"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-alert>{{ form.role }}</v-alert>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <v-btn type="submit" color="success">แก้ไข</v-btn> &nbsp;&nbsp;&nbsp;&nbsp; <v-btn type="reset" color="error">ยกเลิก</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {eva} from '../API/api'

const form = ref({
    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:'',
})
const confrimPassword = ref('')
const error = ref<Record<string,string>>({})
const token = process.client ? localStorage.getItem('token') : null

const emailReget = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.first_name.trim())error.value.first_name='กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name='กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email='กรุณากรอกอีเมล'
    else if(!emailReget.test(f.email.trim()))error.value.email='รูปแบบอีเมลไม่ถูกต้อง'
    if(!f.username.trim())error.value.username='กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username='ต้องมีอย่างน้อย 4 ตัวอักษร'
    if(f.password && f.password.trim()){
        if(f.password.trim().length < 6)error.value.password='ต้องมีอย่างน้อย 6 ตัวอักษร'
        if(!confrimPassword.value.trim())error.value.confrimPassword='กรุณายืนยันรหัสผ่าน'
        else if(confrimPassword.value.trim() != f.password.trim())error.value.confrimPassword='รหัสผ่านไม่ตรงกัน'
    }
    if(!f.role.trim())error.value.role='กรุณาเลือกประเภทสมาชิก'
    return Object.keys(error.value).length === 0
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        await axios.put(`${eva}/edit_eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('แก้ไขสำเร็จ')
        localStorage.removeItem('token')
        navigateTo('/')
    }catch(err){
        console.error('Error Regis Member!!',err)
    }
}
const fetchUser = async () =>{
    try{
        const res = await axios.get(`${eva}/edit_eva`,{headers:{Authorization:`Bearer ${token}`}})
        form.value = res.data
    }catch(err){
        console.error('Error Get Member!!',err)
    }
}

onMounted(fetchUser)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>