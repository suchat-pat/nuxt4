<template>
    <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <v-card>
                    <v-sheet class="pa-4" color="#7d0c14">
                        <h1 class="text-center text-h5 font-weight-bold">สมัครสมาชิก</h1>
                        <p class="text-sm text-center">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</p>
                    </v-sheet>
                    <v-card-text>
                        <v-form>
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
                                    <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="confrimPassword" :error-messages="error.confrimPassword"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="ยืนยันรหัสผ่าน" :items="['ฝ่ายบุคลากร','กรรมการประเมิน','ผู้รับการประเมินผล']" v-model="form.role" :error-messages="error.role"></v-select>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <v-btn type="submit" color="#7d0c14">สมัคร</v-btn> &nbsp;&nbsp;&nbsp;&nbsp; <v-btn type="submit" color="#7d0c14">สมัคร</v-btn>
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

</script>

<style scoped>

</style>