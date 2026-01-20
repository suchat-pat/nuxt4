<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h5 font-weight-bold">ผลการประเมินตนเอง</h1>
                <div class="mt-2">
                    <nuxt-link to="/Evaluatee/Score_member"><v-btn color="blue">ตรวจสอบคะแนนประเมินตนเอง</v-btn></nuxt-link>&nbsp;&nbsp;&nbsp;&nbsp;
                    <nuxt-link to="/Evaluatee/Score_commit"><v-btn color="blue">ตรวจสอบคะแนนประเมินกรรมการ</v-btn></nuxt-link>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>