<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">ผลสรุปการประเมินของผู้รับการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        รายชื่อผู้รับการประเมินผล
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ผู้รับการประเมิน</th>
                                    <th class="text-center border">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">สถานะการประเมิน</th>
                                    <th class="text-center border">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border">
                                        <v-btn class="" :color="bg(items.status_eva)" size="small">{{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_eva === 2 ? 'กรรมการประเมิน' : 'ประเมินเสร็จสิ้น' }}</v-btn>
                                    </td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="success" size="small" @click="go(items.id_eva)">รายละเอียด</v-btn>
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


const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/eva`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const bg = (status_eva:number) => {
    if(status_eva === 1) return 'error'
    if(status_eva === 2) return 'warning'
    if(status_eva === 3) return 'success'
}

const go = (id_eva:number) => {
    navigateTo({path:`/Staff/ScoreEva-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>