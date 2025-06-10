<template>
    <q-page padding>
      <q-toolbar class="bg-primary text-white shadow-2 rounded-borders q-mb-md">
        <q-icon name="card_travel" size="md" />
        <q-toolbar-title>
          {{ editMode ? 'Editar Pedido de Viagem' : 'Detalhes do Pedido de Viagem' }}
        </q-toolbar-title>
        <q-space />
        <q-btn v-if="!editMode && !loading" flat round icon="edit" @click="toggleEditMode" label="Editar" />
        <q-btn v-if="editMode" flat round icon="cancel" @click="cancelEdit" label="Cancelar" class="q-mr-sm" />
        <q-btn v-if="editMode" flat round icon="save" @click="saveOrder" label="Salvar" :loading="saving" />
      </q-toolbar>
  
      <q-card v-if="loading">
        <q-card-section class="flex flex-center">
          <q-spinner
            color="primary"
            size="3em"
          />
          <div class="q-ml-md">Carregando detalhes do pedido...</div>
        </q-card-section>
      </q-card>
  
      <q-card v-else>
        <q-card-section>
          <q-form @submit="saveOrder" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="travelOrder.purpose"
                  label="Propósito da Viagem *"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  :readonly="!editMode"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="travelOrder.destination"
                  label="Destino *"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  :readonly="!editMode"
                />
              </div>
            </div>
  
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="travelOrder.startDate"
                  label="Data de Início *"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  :readonly="!editMode"
                >
                  <template v-slot:append v-if="editMode">
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="travelOrder.startDate" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="travelOrder.endDate"
                  label="Data de Término *"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  :readonly="!editMode"
                >
                  <template v-slot:append v-if="editMode">
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="travelOrder.endDate" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
  
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  filled
                  v-model="travelOrder.transportation"
                  :options="transportationOptions"
                  label="Transporte *"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  :readonly="!editMode"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="travelOrder.estimatedCost"
                  label="Custo Estimado"
                  type="number"
                  prefix="R$"
                  :readonly="!editMode"
                />
              </div>
            </div>
  
            <q-input
              filled
              v-model="travelOrder.notes"
              label="Observações"
              type="textarea"
              rows="3"
              :readonly="!editMode"
            />
  
            <div class="q-mt-md text-right" v-if="editMode">
              <q-btn label="Cancelar" color="negative" flat @click="cancelEdit" class="q-mr-sm" />
              <q-btn label="Salvar" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';
  
  export default defineComponent({
    name: 'TravelOrderPage',
  
    setup() {
      const $q = useQuasar();
  
      const travelOrder = ref({
        id: null,
        purpose: '',
        destination: '',
        startDate: '',
        endDate: '',
        transportation: '',
        estimatedCost: 0,
        notes: ''
      });
  
      const travelOrderOriginal = ref(null);
  
      const editMode = ref(false);
      const loading = ref(true);
      const saving = ref(false);
  
      const transportationOptions = [
        'Avião', 'Carro', 'Ônibus', 'Trem', 'Outro'
      ];
  
      const fetchTravelOrder = async (orderId) => {
        loading.value = true;
        await api.get(`/travel/order/${orderId}`).then(response => {
          travelOrder.value = response.data;
          travelOrderOriginal.value = { ...response.data };
        });
    
        travelOrder.value = { ...travelOrder };
        travelOrderOriginal.value = { ...travelOrderOriginal };
        loading.value = false;
      };
  
      const toggleEditMode = () => {
        editMode.value = !editMode.value;
      };
  
      const cancelEdit = () => {
        editMode.value = false;
        travelOrder.value = { ...travelOrderOriginal.value };
        $q.notify({
          color: 'info',
          textColor: 'white',
          icon: 'info',
          message: 'Edição cancelada.'
        });
      };
  
      const saveOrder = async () => {
        saving.value = true;
        await api.put(`/travel-orders/${travelOrder.value.id}`, travelOrder.value);
  
        $q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Pedido de viagem salvo com sucesso!'
        });
  
        editMode.value = false;
        travelOrderOriginal.value = { ...travelOrder.value };
        saving.value = false;
      };
  
      onMounted(() => {
        const orderId = this.$route.params.id;
        fetchTravelOrder(orderId);
      });
  
      return {
        travelOrder,
        editMode,
        loading,
        saving,
        transportationOptions,
        toggleEditMode,
        cancelEdit,
        saveOrder,
      };
    }
  });
  </script>
  
  <style lang="scss" scoped>
  
  </style>