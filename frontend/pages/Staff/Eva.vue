<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">จัดการแบบประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่เปิดรอบการประเมิน" type="date" v-model="form.day_open" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="วันที่ปิดรอบการประเมิน" type="date" v-model="form.day_out" />
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select label="รอบการประเมิน" v-model="form.round_sys" :items="[{title:'รอบการประเมินที่ 1',value:'1'},{title:'รอบการประเมินที่ 2',value:'2'}]" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ปี" v-model="form.year_sys" type="number" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="สถานะ เปิด-ปิดรอบการประเมิน" :items="[{title:'เปิด',value:'y'},{title:'ปิด',value:'n'}]" v-model="form.status_sys" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn type="submit" color="blue" block>{{ form.id_sys ? 'อัปเดต' : 'บันทึก' }}</v-btn>
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
                                    <th class="text-center border">วันที่เปิดรอบการประเมิน</th>
                                    <th class="text-center border">วันที่ปิดรอบการประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">สถานะ เปิด-ปิดรอบการประเมิน</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.day_open }}</td>
                                    <td class="text-center border">{{ items.day_out }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border">{{ items.status_sys === 'y' ? 'เปิด' : 'ปิด' }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="warning" size="small" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" color="error" size="small" @click="del(items.id_eva)">ลบ</v-btn>
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
import Topic from './topic.vue'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 
const sys = ref([])
const member = ref([])

const form = ref({
    id_eva:null,
    id_member: '',
    id_sys: '',
    day_eva:'',
})

const reset = () => {
    form.value = {
            id_eva:null,
            id_member: '',
            id_sys: '',
            day_eva:'',
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/round_eva`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const saveMember = async () =>{
    try{
        if(form.value.id_sys){
            await axios.put(`${staff}/round_eva/${form.value.id_sys}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        }else{
            await axios.post(`${staff}/round_eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        }
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Regis Member!!',err)
    }
}

const del = async (id_sys:number) => {
    try{
        if(!confirm('ต้องการลบใชรหรือไม่')) return
        await axios.delete(`${staff}/round_eva/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
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