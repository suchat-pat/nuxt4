<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">สถานะการประเมินของกรรมการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        รายชื่อกรรมการประเมิน
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">กรรมการประเมิน</th>
                                    <th class="text-center border">สถานะการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">
                                        <v-btn class="" :color="bg(items.status_commit)" size="small">{{ items.status_commit === 'y' ? 'ประเมินแล้ว' : 'ยังไม่ได้ประเมิน' }}</v-btn>
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
const id_eva = useRoute().params.id_eva
const result = ref([]) 


const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/status/${id_eva}`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const bg = (status_commit:string) => {
    if(status_commit === 'y') return 'success'
    else return 'error'
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>