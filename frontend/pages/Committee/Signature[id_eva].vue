<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class=" text-h5 font-weight-bold">ยืนยันผลการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input label="ไฟล์" v-model="file" accept=".docx,.doc,.jpg,.txt,image/*,.pdf" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn type="submit" color="blue" block>บันทึก</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn type="reset" color="#7d0c14" block>ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>

                        <v-table v-else>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ไฟล์</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">{{ 1 }}</td>
                                    <td class="text-center border">
                                        {{ result.signature }}
                                    </td>
                                    <td class="text-center border">
                                        <v-btn color="warning" @click="view(result.signature)" size="small">เปิดดู</v-btn>&nbsp;&nbsp;
                                        <v-btn class="text-white" color="error" size="small" @click="del(id_eva)">ลบ</v-btn>
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
import {api,commit} from '../API/api'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 
const id_eva = useRoute().params.id_eva
const name_doc = ref('')
const file = ref<File | null>(null)

const error = ref<Record<string,string>>({})

function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.name_topic.trim())error.value.name_topic='กรุณากรอกชื่อหัวข้อการประเมิน'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const saveMember = async () =>{
    if(!file.value) return alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    try{
        const formData = new FormData()
        formData.append('name_doc',name_doc.value)
        formData.append('file',file.value)
        await axios.post(`${commit}/signature/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error Regis Member!!',err)
    }
}

const view = (filename:string) => {
    const url = new URL(`/uploads/signature/${filename}`,commit).href
    window.open(url,'_blank')
}

const del = async (id_doc:number) => {
    try{
        if(!confirm('ต้องการลบใชรหรือไม่')) return
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
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