<template>
    <v-container class="fill-height">
        <v-row align="center" justify="center">
            <v-col cols="12" md="6" lg="4">
                <v-card color="#7d0c14" elevation="10" rounded="lg">
                    <p class="text-center text-white text-h5 font-weight-bold">NTC EVALUATION SYSTEM</p>
                    <p class="text-center text-white font-weight-bold">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</p>
                    <v-container class="bg-white">
                        <p class="text-center font-weight-bold">เข้าสู่ระบบ</p>
                        <v-alert variant="tonal" type="error" v-if="error">{{ error }}</v-alert>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="username" label="ชื่อผู้ใช้" prepend-inner-icon="mdi-account" />
                            <v-text-field v-model="password" type="password" label="รหัสผ่าน" prepend-inner-icon="mdi-lock" />
                            <v-select v-model="role" :items="g" label="ประเภทสมาชิก" prepend-inner-icon="mdi-account-group" />
                            <v-btn class="text-white" type="submit" block color="#7d0c14">เข้าสู่ระบบ</v-btn>
                            <center><NuxtLink to="/regis">สมัครสมาชิก</NuxtLink></center>
                        </v-form>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    definePageMeta({
    layout:false
})

import auth from '../API/auth'
const error = ref('')
const username = ref('')
const password = ref('')
const role = ref('')
const g = ['ฝ่ายบุคลากร','กรรมการประเมิน','ผู้รับการประเมินผล']

const login = async () => {
    try{
        const res = await auth.login({
            username:username.value,
            password:password.value,
            role:role.value,
        })
        console.log('API Response',res.data)
        localStorage.setItem('token',res.data.token)
        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร') useRouter().push('/Staff')
        if(useRole === 'กรรมการประเมิน') useRouter().push('/Committee')
        if(useRole === 'ผู้รับการประเมินผล') useRouter().push('/Evaluatee')
    }catch(err:any){
        console.error('Login Failed!',err)
        error.value = error.response?.data.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }
}
</script>

<style scoped>

</style> 