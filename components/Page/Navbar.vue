<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema'
import { useOrder } from '~/stores/order'

export interface IMenuItem {
  type: 'link' | 'button'
  text: string
  href?: any
  route?: any
  badge?: boolean
}

const orderStore = useOrder()
const app = useAppConfig() as AppConfigInput

const newOrders = computed(() => orderStore.orders.filter((order) => order.status === 'NEW'))
const menus = computed((): IMenuItem[] => [
  { type: 'link', text: 'Заказы', route: { name: 'orders' }, badge: newOrders.value.length > 0 },
  { type: 'link', text: 'Товары', route: { name: 'products' } },
  { type: 'link', text: 'Категории', route: { name: 'categories' } },
  { type: 'link', text: 'Топпинги', route: { name: 'toppings' } },
  { type: 'link', text: 'История заказов', route: { name: 'history' } },
  { type: 'link', text: 'Посетители', route: { name: 'users' } },
])
</script>

<template>
  <BuilderNavbar>
    <template #menu>
      <div class="relative hidden lg:flex items-center ml-auto">
        <nav
          class="text-sm leading-6 font-semibold text-gray-600 dark:text-gray-300"
          role="navigation"
        >
          <ul class="flex items-center space-x-8">
            <li v-for="(item, i) in menus" :key="i">
              <Anchor
                v-if="item.type === 'link'"
                :to="item.route ? item.route : undefined"
                :href="item.href ? item.href : undefined"
                class="hover:no-underline hover:text-slate-900 hover:dark:text-white capitalize"
              >
                {{ item.text }}
              </Anchor>
              <Button
                v-else-if="item.type === 'button'"
                :text="item.text"
                size="xs"
                class="font-extrabold capitalize"
                :to="item.route ? item.route : undefined"
                :href="item.href ? item.href : undefined"
              />
              <div v-if="item.badge" class="inline-block w-1 h-1 bg-red ml-2 mb-2"></div>
            </li>
          </ul>
        </nav>
        <div class="flex space-x-4 border-l ml-6 pl-6 border-gray-900/10 dark:border-gray-50/[0.2]">
          <!-- <LanguageSwitcher /> -->
          <ThemeSwitcher />
        </div>
      </div>
    </template>
    <template #options="{ toggleOptions }">
      <ActionSheet @on-close="toggleOptions(false)">
        <ActionSheetBody>
          <ActionSheetHeader text="Menu" />
          <nav class="leading-6 font-semibold text-gray-600 dark:text-gray-300">
            <ul class="flex flex-col">
              <li
                v-for="(item, i) in menus"
                :key="i"
                class="flex w-full"
                :class="{
                  'pb-2 mb-2 border-b border-gray-900/10 dark:border-gray-50/[0.2]':
                    item.type === 'link',
                }"
              >
                <Anchor
                  v-if="item.type === 'link'"
                  :to="item.route ? item.route : undefined"
                  :href="item.href ? item.href : undefined"
                  class="flex-1 hover:no-underline capitalize"
                >
                  {{ item.text }}
                </Anchor>
                <Button
                  v-else-if="item.type === 'button'"
                  :text="item.text"
                  size="xs"
                  class="flex-1 font-extrabold capitalize"
                  :to="item.route ? item.route : undefined"
                  :href="item.href ? item.href : undefined"
                />
              </li>
            </ul>
          </nav>
          <div class="mt-6 text-sm font-bold capitalize">изменить тему</div>
          <div class="mt-2">
            <ThemeSwitcher type="select-box" />
          </div>
        </ActionSheetBody>
        <Button text="Close" type="secondary" @click.prevent="toggleOptions(false)" />
      </ActionSheet>
    </template>
  </BuilderNavbar>
</template>
