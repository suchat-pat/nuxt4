<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">คู่มือสำหรับการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field label="ชื่อเอกสาร" v-model="name_doc"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-file-input label="เอกสาร" v-model="file" accept=".docx,.doc,.jpg,.txt,image/*" />
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

                        <br>
                        <br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อเอกสาร</th>
                                    <th class="text-center border">วันที่เพิ่ม</th>
                                    <th class="text-center border">ไฟล์</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_topic">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.name_doc }}</td>
                                    <td class="text-center border">{{ items.day_doc }}</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" @click="view(items.file)" size="small">เปิดดู</v-btn>
                                    </td>
                                    <td class="text-center border">
                                        <!-- <v-btn class="text-white" color="warning" size="small" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" color="error" size="small" @click="del(items.id_doc)">ลบ</v-btn>
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
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 

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
        const res = await axios.get(`${staff}/doc`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const saveMember = async () =>{
    if(!name_doc.value || !file.value) return alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    try{
        const formData = new FormData()
        formData.append('name_doc',name_doc.value)
        formData.append('file',file.value)
        await axios.post(`${staff}/doc`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error Regis Member!!',err)
    }
}

const view = (filename:string) => {
    const url = new URL(`/uploads/document/${filename}`,staff).href
    window.open(url,'_blank')
}

const del = async (id_doc:number) => {
    try{
        if(!confirm('ต้องการลบใชรหรือไม่')) return
        await axios.delete(`${staff}/doc/${id_doc}`,{headers:{Authorization:`Bearer ${token}`}})
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