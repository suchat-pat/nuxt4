<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
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
                                        <v-textarea v-model="indicate.detail_eva" rows="2" label="คำอธิบายเพิ่มเติม(ถ้ามี)"></v-textarea>
                                        <v-file-input @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" label="ไฟล์" accept="image/*,.pdf"></v-file-input>
                                        <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนนประเมิน 1-4" :items="[1,2,3,4]" v-model="indicate.score" ></v-select>
                                        <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" type="number" v-model="indicate.score" ></v-text-field>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                        <v-btn color="blue" type="submit">บันทึกคะแนน</v-btn><br><br>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 2 || user.status_eva === 3" type="success">คุณกรอกแบบประเมินแล้ว</v-alert>
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
const token = process.client ? localStorage.getItem('token') : null

const fetchUser = async () =>{
    try{
        const res = await axios.get(`${eva}/staff/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User',err)
    }
}

const fetchTopic = async () =>{
    try{
        const res = await axios.get(`${eva}/staff/indicate`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET Indi9cate',err)
    }
}

onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

const fileMap = ref<Record<string,string>>({})
const onFileChange = (event:Event,id_topic:number,id_indicate:number) =>{
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if(!file)return
    fileMap.value[`${id_topic}-${id_indicate}`] = file
}

const saveScore = async () =>{
    const formData = new FormData()
    const allScore = topics.value.flatMap(topic =>
        topic.indicates.map((i:any) =>{
            const key = `${topic.id_topic}-${i.id_indicate}`
            const file = fileMap.value[key]
            if(file) formData.append(`file_${key}`,file)
            return{
                id_topic:topic.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
                detail_eva:i.detail_eva,
                file_key:file ? `file_${key}` : null
            }
        })
    )
    if(allScore.some((s) => !s.score)){
        alert('กรุณากรอกคะแนนให้ครบ')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    try{
        await axios.post(`${eva}/staff/save`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        await Promise.all([fetchTopic(),fetchUser()])
    }catch(err){
        console.error('Error POST Score',err)
    }
}
</script>

<style scoped>

</style>