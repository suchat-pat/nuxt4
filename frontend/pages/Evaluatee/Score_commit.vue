<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,index1) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6 font-weight-bold">{{ index1+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">รายละเอียด</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">ประธาน</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">กรรมการ</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">เลขา</th>
                                    <th class="pa-2 border text-center bg-grey text-black" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="pa-2 border text-center">{{ indicate.name_indicate }}</td>
                                    <td class="pa-2 border text-center">{{ indicate.detail_indicate }}</td>
                                    <td class="pa-2 border text-center">{{ indicate.point_indicate }}</td>
                                    <td class="pa-2 border text-center">{{ indicate.point_indicate*4 }}</td>
                                    <td class="pa-2 border text-center">{{ scores[indicate.id_indicate]?.a ?? 'รอประธานประเมิน' }}</td>
                                    <td class="pa-2 border text-center">{{ scores[indicate.id_indicate]?.b ?? 'รอกรรมการประเมิน' }}</td>
                                    <td class="pa-2 border text-center">{{ scores[indicate.id_indicate]?.c ?? 'รอเลขาประเมิน' }}</td>
                                    <td class="pa-2 border text-center">
                                        {{ ((scores[indicate.id_indicate]?.a ?? 0)+(scores[indicate.id_indicate]?.b ?? 0)+(scores[indicate.id_indicate]?.c ?? 0)) }}
                                    </td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <v-card class="mt-2 pa-2 text-end" color="success">คะแนนรวมสุทธิ : {{ totalScore }} คะแนน&nbsp;&nbsp;</v-card>
                    <v-card class="mt-4 pa-2">
                        <v-row>
                            <v-col cols="12" v-for="commit in commits" :key="commit.id_commit"></v-col>
                        </v-row>
                    </v-card>
                </v-form>
                <v-alert v-else-if="user.status_eva === 1" type="info">คุณยังไม่ได้กรอกแบบประเมิน</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {eva} from '../API/api'

const user = ref({})
const topics = ref([])
const scores = ref([])
const totalScore = ref(0)
const commits = ref([])
const token = process.client ? localStorage.getItem('token') : null

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'__blank')
}
const fetchUser = async () =>{
    try{
        const res = await axios.get(`${eva}/score_member/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User',err)
    }
}

const fetchTopic = async () =>{
    try{
        const res = await axios.get(`${eva}/score_member/indicate`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET Indi9cate',err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

</script>

<style scoped>

</style>