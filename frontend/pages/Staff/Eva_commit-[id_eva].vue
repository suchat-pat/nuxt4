<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">เพิ่มกรรมการ</h1>
                        <p class="font-weight-bold text-center">ผู้ถูกประเมิน : {{ header.first_name }} {{ header.last_name }}</p>
                        <p class="font-weight-bold text-center">รอบการประเมิน : รอบการประเมินที่ {{ header.round_sys }} ปี {{ header.year_sys }}</p>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <template v-for="(c,index) in List" :key="index">
                                    <v-col cols="12" md="6">
                                        <v-select v-model="c.id_member" :label="`กรรมการคนที่ ${index+1}`" :items="MEMBER(index).map(m => ({ title: `${m.fullname_commit}`,value:m.id_member }))" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="c.role" :label="`ตำแหน่งกรรมการที่ ${index+1}`" :items="ROLE(index)" />
                                    </v-col>
                                </template>
                                <v-btn block color="#7d0c14" type="submit">บันทึก</v-btn>
                            </v-row>
                        </v-form>

                        <br>
                        <br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">กรรมการ</th>
                                    <th class="text-center border">ตำแหน่ง</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :key="items.id_commit">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ nameOf(items.id_member) }}</td>
                                    <td class="text-center border">{{ items.role }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="error" size="small" @click="del(items.id_eva)">ลบ</v-btn>
                                    </td>
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

const people = ref([]) 
const header = ref([]) 
const role = ['ประธาน','กรรมการ','เลขา']
const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
])

const namemap = computed( () => Object.fromEntries(people.value.map(p => [p.id_member,p.fullname_commit])) )
const nameOf = (id:number) => namemap.value[id]

const fetch = async () => {
    try{
        const h = await axios.get(`${staff}/commit/header/${id_eva}`,{headers: {Authorization : `Bearer ${token}`}})
        header.value = h.data[0]
        const res = await axios.get(`${staff}/commit/${id_eva}`,{headers: {Authorization: `Bearer ${token}`}})
        people.value = res.data.before
        const useData = res.data.after
        if(useData.length === 0){
            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
            ]
        }else{
            List.value = useData.data.map(c => ({
                id_commit:c.id_member,id_member:c.id_member,role:c.role
            }))
            while(List.value.length < 3){
                List.value.push({id_commit:null,id_member:'',role:''})
            }
        }
    }catch(err){
        console.error('Error Fetching',err)
    }
}

const MEMBER = (idx:number) => {
    const picked = List.value.map( (c,i) => (i !== idx ? c.id_member : null) )
    return people.value.filter((r) => !picked.includes(r.id_member))
}

const ROLE = (idx:number) => {
    const picked = List.value.map( (c,i) => (i !== idx ? c.role : null) )
    return role.filter( (r) => !picked.includes(r) )
}

const saveMember = async () =>{
    try{
        await axios.post(`${staff}/commit/${id_eva}`,{headers: {Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error!!',err)
    }
}

const del = async (id_commit:number) => {
    try{
        if(!confirm('ต้องการลบใชรหรือไม่')) return
        await axios.delete(`${staff}/commit/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error('Error Delete',err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path:`/Eva_commit-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>