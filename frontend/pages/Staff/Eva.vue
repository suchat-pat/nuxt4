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
                                    <v-text-field label="วันที่ออกแบบประเมิน" type="date" v-model="form.day_eva" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ผู้รับการประเมิน" :items="member.map(m => ({title:`${m.first_name} ${m.last_name}`,value:m.id_member}))" v-model="form.id_member" />
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select label="รอบการประเมิน" v-model="form.id_sys" :items="sys.map(s => ({title:`รอบการประเมินที่ ${s.round_sys} ปี ${s.year_sys}`,value:s.id_sys}))" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn type="submit" color="blue" block>{{ form.id_eva ? 'อัปเดต' : 'บันทึก' }}</v-btn>
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
                                    <th class="text-center border">ผู้รับการประเมิน</th>
                                    <th class="text-center border">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">สถานะการประเมิน</th>
                                    <th class="text-center border">จัดการ</th>
                                    <th class="text-center border">เพิ่มกรรมการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border">{{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_eva === 2 ? 'กรรมการประเมิน' : 'ประเมินเสร็จสิ้น' }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="warning" size="small" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" color="error" size="small" @click="del(items.id_eva)">ลบ</v-btn>
                                    </td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="success" size="small" @click="go(items.id_eva)">เพิ่มกรรมการ</v-btn>
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
        const m = await axios.get(`${staff}/member/eva`,{headers: {Authorization: `Bearer ${token}`}})
        member.value = m.data
        const r = await axios.get(`${staff}/eva/round`,{headers: {Authorization: `Bearer ${token}`}})
        sys.value = r.data
        const res = await axios.get(`${staff}/eva`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const saveMember = async () =>{
    try{
        if(form.value.id_eva){
            await axios.put(`${staff}/eva/${form.value.id_eva}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        }else{
            await axios.post(`${staff}/eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        }
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Regis Member!!',err)
    }
}

const del = async (id_eva:number) => {
    try{
        if(!confirm('ต้องการลบใชรหรือไม่')) return
        await axios.delete(`${staff}/eva/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Delete',err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path:`/Staff/Eva_commit-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>