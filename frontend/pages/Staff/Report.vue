<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-center text-h5 font-weight-bold">รายงานผล</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border font-weight-bold">ลำดับ</th>
                                    <th class="text-center border font-weight-bold">รายการ</th>
                                    <th class="text-center border font-weight-bold">รายละเอียด</th>
                                </tr>    
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">1</td>
                                    <td class="text-center border">ผู้รับการประเมินทั้งหมด</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" size="small"><nuxt-link to="/Staff/reEva" color="">รายละเอียด</nuxt-link></v-btn>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center border">2</td>
                                    <td class="text-center border">กรรมการประเมินทั้งหมด</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" size="small"><nuxt-link to="/Staff/reCommit" color="">รายละเอียด</nuxt-link></v-btn>
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
import { createNativeLocaleFormatter } from 'vuetify/lib/components/VCalendar/util/timestamp.mjs'
const token = process.client ? localStorage.getItem('token') : null

const result = ref([]) 


// onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>