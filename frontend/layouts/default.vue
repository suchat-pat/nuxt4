<template>
    <v-app>
        <v-app-bar color="#7d0c14" class="py-2 noP">
            <v-app-bar-nav-icon @click="drawer = !drawer" variant="text"></v-app-bar-nav-icon>
            <v-toolbar-title>ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</v-toolbar-title>
            <p>ผู้ใช้งาน : {{ user.first_name }} {{ user.last_name }} <br> {{ user.role }}</p>&nbsp;&nbsp;
            <v-btn @click="logout" class="bg-white">ออกจากระบบ</v-btn>&nbsp;&nbsp;
        </v-app-bar>
        <ClientOnly>

        <v-navigation-drawer color="#404040" v-model="drawer" app :temporary="isMobile" :permanent="!isMobile">
            <v-list>
                <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        </ClientOnly>
        <v-main>
            <v-container fluid>
                <NuxtPage/>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useDisplay } from 'vuetify';
const {mdAndDown} = useDisplay()
const isMobile = computed(() => mdAndDown.value)
const drawer = ref(false)
const user = ref<any>({})
import {api} from '../API/api'

const logout = async () => {
    if(!confirm('ต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/')
}

const roles = [
    //staff
    {title:'หน้าหลัก',to:'/Staff',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมิน',to:'/Staff/ManageEva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/ManageCommit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อการประเมิน',to:'/Staff/Topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัด',to:'/Staff/Indicate',role:'ฝ่ายบุคลากร'},
    {title:'รอบการประเมิน',to:'/Staff/Round_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการแบบประเมิน',to:'/Staff/Eva',role:'ฝ่ายบุคลากร'},
    {title:'ผลสรุปการประเมินของผู้รับประเมิน',to:'/Staff/Score_evaList',role:'ฝ่ายบุคลากร'},
    {title:'ผลสรุปการประเมินของกรรมการประเมิน',to:'/Staff/Score_commitList',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของผู้รับการประเมิน',to:'/Staff/StatusEva',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของกรรมการประเมิน',to:'/Staff/StatusCommit',role:'ฝ่ายบุคลากร'},
    {title:'คู่มือการประเมิน',to:'/Staff/Document',role:'ฝ่ายบุคลากร'},
    {title:'รายงานผล',to:'/Staff/Report',role:'ฝ่ายบุคลากร'},

    //commit
    {title:'รายชื่อผู้รับการประเมิน',to:'/Committee/',role:'กรรมการประเมิน'},
    {title:'ดำเนินการประเมิน',to:'/Committee/Show_eva',role:'กรรมการประเมิน'},
    {title:'ตรวจสอบและยืนยันผล',to:'/Committee/Check_confirm',role:'กรรมการประเมิน'},

    //eva
    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evaluatee/Edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบประเมิน',to:'/Evaluatee/Staff',role:'ผู้รับการประเมินผล'},
    {title:'ผลการประเมิน',to:'/Evaluatee/Check_score',role:'ผู้รับการประเมินผล'},
]
const navitem = computed(() =>
    roles.filter((item) => item.role.includes(user.value.role))
)

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    if(!token){
        return await navigateTo('/',{replace:true})
    }
    try{
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error("Error Get User!",err)
        localStorage.removeItem('token')
        await navigateTo('/',{replace:true})
    }
}

onMounted(fetchUser)
</script>

<style scoped>
@media print {
    .v-btn,.noP{
        display: none;
    }
}
</style>