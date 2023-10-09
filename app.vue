<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema'
import { NConfigProvider, darkTheme, NNotificationProvider, NDialogProvider } from 'naive-ui'
import { AppSetup } from './utils/app'
import { ITheme } from './utils/theme'
import { themeOverrides } from './utils/naive-theme-override'
import Notification from '~/components/Notification.vue'

AppSetup()
const theme = useState<ITheme>('theme.current')
const locale = useState<string>('locale.setting')
const notification = ref<InstanceType<typeof Notification> | null>(null)
const app = useAppConfig() as AppConfigInput
const route = useRoute()

useHead({
  titleTemplate: 'Paytg %s',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Paytg',
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>

<template>
  <Html :class="`${theme === 'dark' ? 'dark' : ''}`" :lang="locale">
    <NConfigProvider :theme="theme === 'dark' ? darkTheme : null" :theme-overrides="themeOverrides">
      <NNotificationProvider>
        <NDialogProvider>
          <Body
            class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 overscroll-y-none"
          >
            <NuxtLayout>
              <NuxtLoadingIndicator :height="5" :duration="3000" :throttle="400" />
              <NuxtPage />
              <Notification ref="notification" />
            </NuxtLayout>
          </Body>
        </NDialogProvider>
      </NNotificationProvider>
    </NConfigProvider>
  </Html>
</template>
