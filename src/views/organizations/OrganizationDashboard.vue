<!-- views/OrganizationDashboardPage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-4 md:py-8 px-3 md:px-4">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-10 h-10 md:w-12 md:h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="!organization || !isOwner" class="text-center py-20">
      <div class="glass-strong rounded-2xl md:rounded-3xl p-8 md:p-12 max-w-md mx-auto">
        <Shield class="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-2">Нет доступа</h2>
        <p class="text-sm md:text-base text-gray-500 mb-4">
          Вы не владелец этой организации
        </p>
        <BaseButton @click="goBack" size="md">Назад</BaseButton>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <!-- Хедер -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp"
      >
        <div>
          <button
            @click="goBack"
            class="flex items-center gap-1.5 md:gap-2 text-gray-500 hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft class="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span class="text-xs md:text-sm">К организации</span>
          </button>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
            Управление: {{ organization.name }}
          </h1>
        </div>
        <BaseButton
          @click="deleteOrganization"
          variant="outlined"
          class="text-rose-500 border-rose-200 hover:bg-rose-50 text-xs md:text-sm w-full sm:w-auto"
        >
          <Trash class="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
          Удалить
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Левая колонка -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <!-- Основная информация -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Основная информация
            </h2>

            <div class="space-y-3 md:space-y-4">
              <div>
                <label class="text-xs md:text-sm font-medium text-gray-600 mb-1 block"
                  >Название</label
                >
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>

              <div>
                <label class="text-xs md:text-sm font-medium text-gray-600 mb-1 block"
                  >Описание</label
                >
                <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-gray-200 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                ></textarea>
              </div>

              <BaseButton
                @click="saveChanges"
                size="md"
                class="w-full sm:w-auto"
                :loading="saving"
              >
                <Save class="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Сохранить
              </BaseButton>
            </div>
          </div>

          <!-- Логотип -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Логотип</h2>
            <div class="flex items-center gap-4">
              <img
                v-if="organization.logo"
                :src="organization.logo"
                class="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover border-2 border-white shadow"
                alt="logo"
              />
              <div
                v-else
                class="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gray-100 flex items-center justify-center"
              >
                <Building2 class="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
              </div>
              <BaseButton
                @click="uploadLogo"
                size="sm"
                variant="outlined"
                class="text-xs md:text-sm"
              >
                <Upload class="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                Загрузить
              </BaseButton>
            </div>
          </div>

          <!-- Курсы -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4"
            >
              <h2 class="text-lg md:text-xl font-bold text-gray-800">
                Курсы ({{ organization.courses?.length || 0 }})
              </h2>
              <router-link
                :to="{ name: 'create-course', query: { orgId: organization.id } }"
                class="btn-primary px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-white text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2 w-full sm:w-auto justify-center"
              >
                <Plus class="h-3.5 w-3.5 md:h-4 md:w-4" />
                Создать курс
              </router-link>
            </div>

            <div v-if="!organization.courses?.length" class="text-center py-6 md:py-8">
              <BookOpen
                class="h-10 w-10 md:h-12 md:w-12 text-gray-300 mx-auto mb-2 md:mb-3"
              />
              <p class="text-sm md:text-base text-gray-500">Пока нет курсов</p>
            </div>

            <div v-else class="space-y-2 md:space-y-3">
              <div
                v-for="course in organization.courses"
                :key="course.id"
                class="flex items-center justify-between p-3 md:p-4 bg-white/40 rounded-lg md:rounded-xl"
              >
                <div class="min-w-0">
                  <h3 class="font-medium text-gray-800 text-sm md:text-base truncate">
                    {{ course.title }}
                  </h3>
                  <p class="text-xs md:text-sm text-gray-500">
                    {{ course.lessons?.length || 0 }} уроков
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="editCourse(course.id)"
                    class="p-1.5 md:p-2 rounded-lg hover:bg-white/60 transition-colors"
                  >
                    <Edit class="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400" />
                  </button>
                  <button
                    @click="deleteCourse(course.id)"
                    class="p-1.5 md:p-2 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash class="h-3.5 w-3.5 md:h-4 md:w-4 text-rose-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка -->
        <div class="space-y-4 md:space-y-6">
          <!-- Участники -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg md:text-xl font-bold text-gray-800">Участники</h2>
              <span class="text-xs md:text-sm text-gray-500">{{
                organization.organizationMembers?.length || 0
              }}</span>
            </div>

            <div
              v-if="!organization.organizationMembers?.length"
              class="text-center py-4"
            >
              <Users class="h-8 w-8 md:h-10 md:w-10 text-gray-300 mx-auto mb-2" />
              <p class="text-xs md:text-sm text-gray-500">Нет участников</p>
            </div>

            <div v-else class="space-y-1.5 md:space-y-2 max-h-80 overflow-y-auto">
              <div
                v-for="member in organization.organizationMembers"
                :key="member.userId"
                class="flex items-center justify-between p-2 md:p-2.5 bg-white/40 rounded-lg md:rounded-xl"
              >
                <div class="flex items-center gap-2 md:gap-3 min-w-0">
                  <img
                    :src="member.user.avatarUrl || '/placeholder-avatar.png'"
                    class="h-8 w-8 rounded-full object-cover"
                    :alt="member.user.login"
                  />
                  <span class="text-sm font-medium text-gray-800 truncate">{{
                    member.user.login
                  }}</span>
                  <Crown
                    v-if="member.userId === organization.userId"
                    class="h-3 w-3 text-amber-500 shrink-0"
                  />
                </div>
                <button
                  v-if="member.userId !== organization.userId"
                  @click="removeMember(member.userId)"
                  class="p-1 rounded hover:bg-rose-50 transition-colors shrink-0"
                >
                  <X class="h-3.5 w-3.5 text-rose-400" />
                </button>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200/40">
              <BaseButton
                @click="inviteModal = true"
                variant="outlined"
                size="sm"
                class="w-full text-xs md:text-sm"
              >
                <UserPlus class="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Пригласить участника
              </BaseButton>
            </div>
          </div>

          <!-- Код приглашения -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-3">
              Код приглашения
            </h2>
            <div class="flex items-center gap-2">
              <code
                class="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono break-all"
                >{{ organization.inviteCode }}</code
              >
              <button
                @click="copyInviteCode"
                class="p-2 rounded-lg hover:bg-primary/10 transition-colors shrink-0"
              >
                <Copy class="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <InviteMemberModal
      v-model="inviteModal"
      :organization-id="orgId"
      @invited="handleInvited"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import InviteMemberModal from "@/components/modals/InviteMemberModal.vue";
import {
  ArrowLeft,
  Building2,
  Users,
  BookOpen,
  Crown,
  Copy,
  Save,
  Upload,
  Plus,
  Edit,
  Trash,
  X,
  UserPlus,
  Shield,
} from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import BaseButton from "@/components/ui/AppButton.vue";
import { useOrganizationStore } from "@/stores/organization";

const route = useRoute();
const router = useRouter();
const orgStore = useOrganizationStore();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(true);
const saving = ref(false);
const inviteModal = ref(false);

const organization = computed(() => orgStore.currentOrg!);
const orgId = computed(() => Number(route.params.id));

const editForm = ref({
  name: "",
  description: "",
});

onMounted(async () => {
  const org = await orgStore.getOrgById(orgId.value);
  orgStore.setCurrentOrg(org);
  if (org) {
    editForm.value.name = org.name;
    editForm.value.description = org.description || "";
  }
  loading.value = false;
});

const isOwner = computed(() => organization.value?.userId === authStore.currentUser?.id);

const goBack = () => router.push({ name: "single-org", params: { id: orgId.value } });

const saveChanges = async () => {
  saving.value = true;
  try {
    await orgStore.updateOrg(orgId.value, editForm.value);
    toast.success("Изменения сохранены");
  } catch (err) {
    toast.error("Не удалось сохранить изменения");
  } finally {
    saving.value = false;
  }
};

const uploadLogo = () => {};

const editCourse = (courseId: number) =>
  router.push({ name: "edit-course", params: { id: courseId } });

const deleteCourse = async (courseId: number) => {
  if (confirm("Удалить курс?")) {
    try {
      // await coursesStore.deleteCourse(courseId)
      toast.success("Курс удален");
    } catch (err) {
      toast.error("Не удалось удалить курс");
    }
  }
};

const removeMember = async (userId: number) => {
  if (confirm("Удалить участника?")) {
    try {
      await orgStore.removeMember(orgId.value, userId);
      toast.success("Участник удален");
    } catch (err) {
      toast.error("Не удалось удалить участника");
    }
  }
};

const deleteOrganization = async () => {
  if (confirm("Вы уверены? Это действие необратимо!")) {
    try {
      // await orgStore.deleteOrg(orgId.value)
      toast.success("Организация удалена");
      router.push({ name: "organizations" });
    } catch (err) {
      toast.error("Не удалось удалить организацию");
    }
  }
};

const copyInviteCode = () => {
  navigator.clipboard.writeText(organization.value?.inviteCode || "");
  toast.success("Код скопирован");
};

const handleInvited = () => {
  orgStore.getOrgById(orgId.value).then((org) => orgStore.setCurrentOrg(org));
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out both;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
