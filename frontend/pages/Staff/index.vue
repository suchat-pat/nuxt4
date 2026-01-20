<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">Dashboard - Staff</h1>
                    </v-sheet>
                    <v-card-text>
                       <v-row>
                        <v-col cols="12" md="4" v-for="b in box" :key="b">
                            <v-card elevation="5" class="pa-4">
                                <div class="font-weight-bold">{{ b.label }}</div>
                                <div class="text-h3 font-weight-bold">{{ b.value }}</div>
                            </v-card>
                        </v-col>
                       </v-row>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../API/api'
import { createNativeLocaleFormatter } from 'vuetify/lib/components/VCalendar/util/timestamp.mjs'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 

const box = ref([])


const fetch = async () => {
    try{
        const res = await axios.get(`${api}/dash/staff`,{headers: {Authorization: `Bearer ${token}`}})
        box.value = res.data.box
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
</style>