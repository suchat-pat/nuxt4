<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_commit === 'n'" @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,index1) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6 font-weight-bold">{{ index1+1 }}.{{ topic.name_topic }}</h1>
                            <v-row v-for="(indicate,index2) in topic.indicates" :key="indicate.id_indicate">
                                <v-col cols="12">
                                    <v-card class="pa-2">
                                        <p>
                                            {{ index1+1 }}.{{ index2+1 }} {{ indicate.name_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม {{ indicate.point_indicate*4 }} รายละเอียด : {{ indicate.detail_indicate }}
                                        </p>
                                        <p class="mt-2" v-if="indicate.detail_eva">คำอธิบายเพิ่มเติม : {{ indicate.detail_eva || '-' }}</p>
                                        <v-btn v-if="indicate.file_eva" size="small" @click="viweFile(indicate.file_eva)" color="blue">ดูไฟล์</v-btn>
                                        <v-select label="ใส่คะแนนประเมิน 1-4" class="mt-2" :items="[1,2,3,4]" v-model="indicate.score" ></v-select>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-card class="mt-2 pa-2">
                        <label for="">ข้อเสนอแนะ</label>
                        <v-textarea v-model="detail_commit" rows="2" label="(ถ้ามี)"></v-textarea>
                    </v-card>
                    <div class="mt-4 text-center">
                        <v-btn color="blue" type="submit">บันทึกคะแนน</v-btn><br><br>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_commit === 'y'" type="success">คุณกรอกแบบประเมินแล้ว</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {commit} from '../API/api'

const user = ref({})
const topics = ref([])
const id_eva = useRoute().params.id_eva
const detail_commit = ref('')
const token = process.client ? localStorage.getItem('token') : null

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'__blank')
}

const fetchUser = async () =>{
    try{
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User',err)
    }
}

const fetchTopic = async () =>{
    try{
        const res = await axios.get(`${commit}/save_score/indicate/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET Indi9cate',err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})


const saveScore = async () =>{
    const formData = new FormData()
    const allScore = topics.value.flatMap(topic =>
        topic.indicates.map((i:any) =>{
            return{
                id_topic:topic.id_topic,
                id_indicate:i.id_indicate,
                score:i.score
            }
        })
    )
    if(allScore.some((s) => !s.score)){
        alert('กรุณากรอกคะแนนให้ครบ')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    formData.append('detail_commit',detail_commit.value)
    try{
        await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        await Promise.all([fetchTopic(),fetchUser()])
        navigateTo('/Committee/Show_eva')
    }catch(err){
        console.error('Error POST Score',err)
    }
}
</script>

<style scoped>

</style>