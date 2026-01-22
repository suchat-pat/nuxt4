<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">รายงานกรรมการประเมินทั้งหมด <br>จำนวนยอด {{ result.length }} คน</h1>
                    </v-sheet>
                    <v-card-text>
                        รายชื่อกรรมการประเมิน
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อ-นามสกุล</th>
                                    <th class="text-center border">อีเมล</th>
                                    <th class="text-center border">ชื่อผู้ใช้งาน</th>
                                    <th class="text-center border">ประเภทสมาชิก</th>
                                    <!-- <th class="text-center border">จัดการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.email }}</td>
                                    <td class="text-center border">{{ items.username }}</td>
                                    <td class="text-center border">{{ items.role }}</td>
                                    <!-- <td class="text-center border">
                                        <v-btn class="text-white" color="warning" size="small" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" color="error" size="small" @click="del(items.id_member)">ลบ</v-btn>
                                    </td> -->
                                </tr>
                                <tr v-if="result.length===0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                        <br>
                        <center><v-btn color="warning" prepend-icon="mdi-printer" class="noP" @click="print()">พิมพ์</v-btn></center>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../API/api'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 

const print = () => {
    window.print()
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/member/commit`,{headers: {Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fetching',err)
    }
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}

@media print {
    .v-btn,.noP{
        display: none;
    }
}
</style>