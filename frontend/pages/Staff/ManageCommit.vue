<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">จัดการกรรมการประเมิน</h1>
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
                                <v-col cols="12" md="12">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" type="password" v-model="form.password" :error-messages="error.password"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="เลือกประเภทสมาชิก" :items="['กรรมการประเมิน']" v-model="form.role" :error-messages="error.role"></v-select>
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn type="submit" color="blue" block>{{ form.id_member ? 'อัปเดต' : 'บันทึก' }}</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn type="submit" color="#7d0c14" block>ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>

                        <br>
                        <br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อ-นามสกุล</th>
                                    <th class="text-center border">อีเมล</th>
                                    <th class="text-center border">ชื่อผู้ใช้งาน</th>
                                    <th class="text-center border">ประเภทสมาชิก</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.email }}</td>
                                    <td class="text-center border">{{ items.username }}</td>
                                    <td class="text-center border">{{ items.role }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="warning" size="small" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" color="error" size="small" @click="del(items.id_member)">ลบ</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length===0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../API/api'
import { createNativeLocaleFormatter } from 'vuetify/lib/components/VCalendar/util/timestamp.mjs'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 

const form = ref({
    id_member: null,
    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:'',
})

const reset = () => {
    form.value = {
        id_member: null,
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:'',
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const error = ref<Record<string,string>>({})

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
    if(!f.role.trim())error.value.role='กรุณาเลือกประเภทสมาชิก'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/member/commit`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        const payload = {
            id_member: form.value.id_member,
            first_name:form.value.first_name,
            last_name:form.value.last_name,
            email:form.value.email,
            username:form.value.username,
            role:form.value.role,
            ...(form.value.password ? {password:form.value.password} : {})
        }
        if(form.value.id_member){
            await axios.put(`${staff}/member/${form.value.id_member}`,payload,{headers:{Authorization:`Bearer ${token}`}})
        }else{
            await axios.post(`${api}/auth/regis`,{...payload,password:form.value.password})
        }
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Regis Member!!',err)
    }
}

const del = async (id_member:number) => {
    try{
        if(!confirm('ต้องการลบใชรหรือไม่')) return
        await axios.delete(`${staff}/member/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Delete',err)
    }
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>