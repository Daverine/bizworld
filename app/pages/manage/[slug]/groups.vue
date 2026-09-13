<script lang="ts" setup>
import type { Maybe } from "@regle/core";
import { required } from "@regle/rules";
import { utils } from "#imports";

definePageMeta({ name: "manage-biz-item-groups", layout: "common", auth: { only: "user" } });
const route = useRoute();
const { data: bizData } = await useFetch("/api/business/query", {
  key: `biz-${route.params.slug}`,
  query: { slug: route.params.slug },
});

const placeholder = reactive<{
  group: {
    id?: string;
    name?: string;
    description?: string;
    icon?: File | string;
    parent_id?: string;
  };
  state?: string;
  modifyGroup?: boolean;
}>({
  group: {},
});

const validation = {
  group: useRegle(
    computed(() => placeholder.group),
    {
      name: {
        required: withMessage(required, "Group name is required."),
        unique: withMessage(
          (value: Maybe<string>) =>
            !bizData.value?.local_groups
              ?.filter((g) => (placeholder.modifyGroup ? g.id !== placeholder.group.id : true))
              .some((group) => group.name === value),
          "Group name already exits.",
        ),
      },
    },
  ),
};

function configGroup({ settings }: Dialoger) {
  let caller = settings.caller;

  if (caller && caller.dataset.groupId !== undefined) {
    placeholder.modifyGroup = true;
    placeholder.group = structuredClone(
      bizData.value?.local_groups?.find((group) => group.id === caller.dataset.groupId) || {},
    );
  } else {
    placeholder.modifyGroup = false;
    placeholder.group = {};
  }

  placeholder.state = "";
  validation.group.r$.$reset();
}

async function processGroup({ settings }: Dialoger) {
  await validation.group.r$.$validate();
  if (validation.group.r$.$invalid) return;

  settings.dismissible = false;
  placeholder.state = "loading";

  const api = placeholder.modifyGroup
    ? "/api/business/categories/modify"
    : "/api/business/categories/create";

  $fetch(api, {
    method: placeholder.modifyGroup ? "patch" : "post",
    query: {
      slug: route.params.slug,
    },
    body: placeholder.group,
  })
    .then((updatedBizData) => {
      useNuxtData(`biz-${route.params.slug}`).data.value = updatedBizData;
      placeholder.state = "done";
    })
    .catch((error) => {
      placeholder.state = "error";
      console.error("An error occured. Action failed.", error);
    })
    .finally(() => (settings.dismissible = true));
}

function deleteGroup(groudId: string) {
  $fetch("/api/business/categories/delete", {
    method: "delete",
    query: {
      business_slug: route.params.slug,
      group_id: groudId,
    },
  })
    .then((updatedBizData) => {
      useNuxtData(`biz-${route.params.slug}`).data.value = updatedBizData;
    })
    .catch((error) => {
      console.error("An error occured. Action failed.", error);
    });
}

const categories = ref<string[]>([]);
</script>
<template>
  <main class="auto-contain max-w-180">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 self-pointer-none mb-4 min-h-23 [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 bg-surface pin-top-blend m-0 flex items-end justify-between gap-3 transition-[font-size] duration-200"
      >
        Item groups
        <button class="open-modal compact button" data-target="setup-group-modal">
          Add a group
        </button>
      </div>
    </header>
    <section>
      <p>
        Organize your products and services into logical categories of your own for easier
        management. We call category here group to diffrentiate it from global categories provided
        by Bizworld. Customers can browse your offerings by group, making it easier for them to find
        what they need on your page.
      </p>
      <div v-if="bizData?.local_groups?.length" class="categories-grid">
        <table class="simple selectable table">
          <thead>
            <tr>
              <th><input type="checkbox" class="form-item" /></th>
              <th>Name</th>
              <th>Description</th>
              <th>Parent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="group in bizData.local_groups"
              :key="group.id"
              @click="
                utils.safeClick($event, () =>
                  categories.includes(group.id)
                    ? categories.splice(categories.indexOf(group.id), 1)
                    : categories.push(group.id),
                )
              "
              :class="{ active: categories.includes(group.id) }"
            >
              <td>
                <input type="checkbox" v-model="categories" :value="group.id" class="form-item" />
              </td>
              <td>{{ group.name }}</td>
              <td>{{ group.description || "—" }}</td>
              <td>
                {{
                  group.parent_id
                    ? bizData.local_groups.find((g) => g.id === group.parent_id)?.name
                    : "—"
                }}
              </td>
              <td class="actions">
                <LimbDropdown class="circular compact transparent button">
                  <Icon name="material-symbols:more-vert" />
                </LimbDropdown>
                <div class="drop menu">
                  <button
                    class="open-modal item"
                    data-target="setup-group-modal"
                    :data-group-id="group.id"
                  >
                    <Icon name="material-symbols:edit-square-outline-rounded" class="lead" />
                    Edit
                  </button>
                  <button class="item" @click="deleteGroup(group.id)">
                    <Icon name="material-symbols:delete-outline-rounded" class="lead" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="my-auto flex flex-col items-center gap-4 p-8">
        <Icon name="material-symbols:package-outline-rounded" class="text-6xl opacity-65" />
        <div class="text-center">
          <div class="font-bold">You don't have any groups yet</div>
          <p class="opacity-65">Add your first group to get started.</p>
        </div>
        <button class="open-modal button" data-target="setup-group-modal">Add a group</button>
      </div>
    </section>
  </main>
  <LimbModal id="setup-group-modal" v-slot="{ control }" :options="{ controller: configGroup }">
    <div class="dialog">
      <header class="flex gap-3 px-6 py-4">
        <div class="truncate font-bold">
          {{ placeholder.modifyGroup ? "Modify a group" : "Add a group" }}
        </div>
        <button
          type="button"
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </header>
      <div class="px-6 py-4">
        <div v-if="placeholder.state === 'loading'" class="flex flex-col items-center gap-4 p-8">
          <div class="m3-progress indeterminate" />
          <div class="text-center">
            <div class="font-bold">Saving changes...</div>
            <p class="opacity-65">Please wait while we save your changes.</p>
          </div>
        </div>
        <div v-else-if="placeholder.state === 'done'" class="flex flex-col items-center gap-4 p-8">
          <Icon
            name="material-symbols:check-circle-outline-rounded"
            class="text-success text-6xl"
          />
          <div class="text-center">
            <div class="font-bold">Changes saved</div>
            <p class="opacity-65">Your changes have been saved successfully.</p>
          </div>
        </div>
        <div v-else-if="placeholder.state === 'error'" class="flex flex-col items-center gap-4 p-8">
          <Icon name="material-symbols:error-outline-rounded" class="text-error text-6xl" />
          <div class="text-center">
            <div class="font-bold">Error saving changes</div>
            <p class="opacity-65">There was an error saving your changes. Please try again.</p>
          </div>
          <div class="flex w-full max-w-3xs gap-4">
            <button type="button" class="button flat exit-modal flex-1">Close</button>
            <button
              type="submit"
              @click.prevent="processGroup(control)"
              class="button primary flex-1"
            >
              Try again
            </button>
          </div>
        </div>
        <form v-else @submit.prevent="processGroup(control)">
          <div class="field">
            <label for="group-name">Group name</label>
            <input
              v-model="placeholder.group.name"
              id="group-name"
              type="text"
              class="form-item"
              :class="{ error: validation.group.r$.name.$error }"
              placeholder="Enter a group name"
            />
            <div
              class="text-error text-sm"
              v-for="error of validation.group.r$.name.$errors"
              :key="error"
            >
              <Icon name="material-symbols:error-rounded" />
              {{ error }}
            </div>
          </div>
          <div class="field">
            <label for="group-description">Group description (Optional)</label>
            <p class="text-sm opacity-65">
              You can optionally enter a description for this group below. 👇
            </p>
            <textarea
              v-model="placeholder.group.description"
              id="group-description"
              placeholder="Brief description..."
              class="form-item"
              rows="3"
            ></textarea>
          </div>
          <div class="field">
            <label>Group image (Optional)</label>
            <label class="button design-takeover">
              <Icon name="material-symbols:add-a-photo-outline-rounded" /> Add photo
              <input type="file" accept="image/*" />
            </label>
          </div>
          <div class="field">
            <label for="parent_group">Parent group (optional)</label>
            <p class="text-sm opacity-65">
              Make this group a subordinate of another group by selecting a parent group below.
            </p>
            <LimbDropdown
              v-model="placeholder.group.parent_id"
              id="parent_group"
              type="select"
              class="form-item"
            />
            <div class="drop menu">
              <div class="item" data-value>None</div>
              <div
                v-for="item in bizData?.local_groups?.filter((g) => g.id !== placeholder.group.id)"
                :key="item.id"
                :data-value="item.id"
                class="item"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" class="button exit-modal">Cancel</button>
            <button type="submit" class="primary button">
              {{ placeholder.modifyGroup ? "Modify group" : "Add group" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </LimbModal>
</template>
