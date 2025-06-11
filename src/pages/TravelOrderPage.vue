<template>
  <q-page padding>
    <q-toolbar class="bg-grey text-white shadow-2 rounded-borders q-mb-md">
      <q-icon name="card_travel" size="md" />
      <q-toolbar-title>
        {{ editMode ? (travelOrder.id === null ? 'Novo Pedido de Viagem' : 'Editar Pedido de Viagem') : 'Detalhes do Pedido de Viagem' }}
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
            <div class="col-12 col-md-6 order_number text-center" v-if="route.name === 'order-detail'">
              Cód. Pedido: <br>
              <p><strong>{{ travelOrder.order_id }}</strong></p>
            </div>
            <div class="col-12 col-md-6 status text-center" v-if="route.name === 'order-detail'">
              <div class="q-mt-md">
                  <q-fab
                    :readonly="!editMode"
                    :label="travelOrder.status"
                    vertical-actions-align="left"
                    :color="getStatusColor(travelOrder.status)"
                    icon="keyboard_arrow_down"
                    direction="down"
                    padding="xs"
                    square
                    dense
                  >
                    <q-fab-action :color="getStatusColor('solicitado')" @click="updateOrderStatus(travelOrder.id, 'solicitado')" label="Solicitado" />
                    <q-fab-action :color="getStatusColor('aprovado')" @click="updateOrderStatus(travelOrder.id, 'aprovado')" label="Aprovado" />
                    <q-fab-action :color="getStatusColor('cancelado')" @click="updateOrderStatus(travelOrder.id, 'cancelado')" label="Cancelado" />
                  </q-fab>
                </div>
              </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="travelOrder.customer_name"
                label="Nome do Cliente *"
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
                v-model="travelOrder.start_date"
                label="Data da Viagem *"
                :rules="[val => !!val || 'Campo obrigatório']"
                :readonly="!editMode"
              >
                <template v-slot:append v-if="editMode">
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="travelOrder.start_date" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="travelOrder.end_date"
                label="Data do Retorno *"
                :rules="[
                  val => !!val || 'Campo obrigatório',
                  val => validateEndDate(val) || 'Data de retorno não pode ser anterior à data de viagem'
                ]"
                :readonly="!editMode"
              >
                <template v-slot:append v-if="editMode">
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="travelOrder.end_date" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

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
import { useRoute, useRouter } from 'vue-router';
import { useTravelOrdersStore } from 'stores/travel-orders';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Instancia o store Pinia
const travelOrdersStore = useTravelOrdersStore();

export default defineComponent({
  name: 'TravelOrderPage',

  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();

    const travelOrder = ref({
      id: null,
      order_id: null,
      customer_name: '',
      destination: '',
      start_date: '',
      end_date: '',
      status: 'recebido',
      transportation: '',
      estimatedCost: 0,
      notes: ''
    });

    const travelOrderOriginal = ref(null);

    const editMode = ref(false);
    const loading = ref(true);
    const saving = ref(false);

    function getStatusColor(status) {
      switch (status) {
        case 'solicitado':
          return 'blue-grey';
        case 'aprovado':
          return 'green';
        case 'cancelado':
          return 'red';
        default:
          return 'grey';
      }
    }

    // Função para atualizar o status via API
    function updateOrderStatus(orderId, newStatus) {
      if(newStatus === travelOrder.value.status) {
        return;        
      }
      travelOrdersStore.updateOrderStatus(orderId, newStatus);
    }

    const validateEndDate = (val) => {
      if (!travelOrder.value.start_date) {
        return true;
      }
      
      const startDate = new Date(travelOrder.value.start_date);
      const endDate = new Date(val);

      return endDate >= startDate;
    };

    const fetchTravelOrder = async (orderId) => {
      loading.value = true;
      try {
        const response = await api.get(`/travel/order/${orderId}`);
        travelOrder.value = response.data;
        travelOrderOriginal.value = { ...response.data };
      } catch (error) {
        console.error('Erro ao carregar pedido de viagem:', error);
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'Erro ao carregar os detalhes do pedido.'
        });
        travelOrder.value.id = null;
      } finally {
        loading.value = false;
      }
    };

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const cancelEdit = () => {
      // Ajuste para resetar corretamente o travelOrder para um novo pedido
      if (!travelOrderOriginal.value || travelOrderOriginal.value.id === null) { 
        travelOrder.value = {
          id: null,
          order_id: null,
          customer_name: '',
          destination: '',
          start_date: '',
          end_date: '',
          status: 'solicitado',
          transportation: '',
          estimatedCost: 0,
          notes: ''
        };
        editMode.value = false;
        loading.value = false;
        $q.notify({
          color: 'info',
          textColor: 'white',
          icon: 'info',
          message: 'Criação de novo pedido cancelada.'
        });
      } else {
        editMode.value = false;
        travelOrder.value = { ...travelOrderOriginal.value };
        $q.notify({
          color: 'info',
          textColor: 'white',
          icon: 'info',
          message: 'Edição cancelada.'
        });
      }
    };

    const saveOrder = async () => {
      saving.value = true;
      try {
        let response;
        if (travelOrder.value.id) {
          response = await api.post(`/travel/orders`, travelOrder.value);
        } else {
          response = await api.post('/travel/orders', travelOrder.value);
          travelOrder.value.id = response.data.id;
          travelOrder.value.order_id = response.data.order_id;
        }
  
        $q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Pedido de viagem salvo com sucesso!'
        });
  
        editMode.value = false;
        travelOrderOriginal.value = { ...travelOrder.value };
        router.push({ name: 'order-detail', params: { id: travelOrder.value.id } });

      } catch (error) {
        console.error('Erro ao salvar pedido de viagem:', error);
        let msg = error?.response?.data?.message;
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'Erro ao salvar o pedido de viagem.' + (msg ? ': ' + msg : '')
        });
      } finally {
        saving.value = false;
      }
    };

    onMounted(async () => {
      const orderId = route.params.id;
      const routeName = route.name;

      if (!orderId || routeName === 'order-new') {
        editMode.value = true;
        loading.value = false;
        travelOrder.value = {
          id: null,
          order_id: null,
          customer_name: '',
          destination: '',
          start_date: '',
          end_date: '',
          status: 'solicitado',
          transportation: '',
          estimatedCost: 0,
          notes: ''
        };
        travelOrderOriginal.value = { ...travelOrder.value };
        $q.notify({
          color: 'info',
          textColor: 'white',
          icon: 'info',
          message: 'Criando um novo pedido de viagem.'
        });
      } else {
        await fetchTravelOrder(orderId);
        if (!travelOrder.value.id) {
            editMode.value = true;
            // Se o pedido não foi encontrado, initialize travelOrderOriginal para o estado de "novo"
            travelOrderOriginal.value = { 
                id: null, order_id: null, customer_name: '', destination: '',
                start_date: '', end_date: '', status: 'solicitado'
            };
            $q.notify({
              color: 'warning',
              textColor: 'white',
              icon: 'warning',
              message: 'Pedido não encontrado. Iniciando um novo pedido.'
            });
        } else {
            editMode.value = false;
        }
      }
    });

    return {
      travelOrder,
      editMode,
      loading,
      saving,
      route,
      toggleEditMode,
      cancelEdit,
      saveOrder,
      validateEndDate,
      getStatusColor,
      updateOrderStatus
    };
  }
});
</script>

<style lang="scss" scoped>
.order_number p {
  font-size: 24px;
  margin-top: 5px;
  margin-bottom: 0;
}
.status {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>