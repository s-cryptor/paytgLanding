<script lang="ts" setup>
import { NAlert, NTimeline, NTimelineItem, NGradientText, NList, NListItem } from 'naive-ui'
// meta
definePageMeta({
  layout: 'page',
})
</script>

<template>
  <PageWrapper class="flex-1 flex">
    <PageBody class="flex-1 flex flex-col">
      <PageSection class="flex-1 flex items-center relative">
        <div class="background-overlay">
          <div
            class="absolute top-0 left-0 transform translate-x-64 translate-y-4 h-14 w-14 rounded-full bg-gray-900 dark:bg-white"
          ></div>
          <div
            class="absolute hidden md:block top-0 left-0 transform translate-x-18 translate-y-20 h-28 w-28 rounded-full bg-blue-600 linear-wipe"
          ></div>
          <div
            class="absolute hidden md:block bottom-0 right-0 transform -translate-x-4 -translate-y-20 h-16 w-16 rounded bg-purple-600 linear-wipe"
          ></div>
          <div class="absolute bottom-0 right-0 triangle-shape"></div>
        </div>
        <div class="flex-1 md:w-1/2 flex flex-col z-10">
          <h1 class="text-center md:text-left mt-4">
            <span
              style="
                --content: 'paytg';
                --start-color: #007cf0;
                --end-color: #00dfd8;
                --animation-name: anim-fg-1;
              "
              class="animated-text-bg drop-shadow-xl text-5xl xl:text-8xl 2xl:text-9xl block font-black uppercase"
            >
              <span class="animated-text-fg">paytg</span>
            </span>
          </h1>
          <div class="text-5xl">БЫСТРАЯ ОПЛАТА В ТЕЛЕГРАМЕ</div>
          <div class="text-5xl">ДЛЯ ВАШЕГО БИЗНЕСА</div>
          <div class="flex space-x-4 ml-4 mt-10 justify-center md:justify-start">
            <Button size="lg" text="Подключить" class="font-extrabold" to="/" />
          </div>
        </div>
        <div class="flex justify-center">
          <img src="~/assets/images/preview.png" alt="" width="350" />
        </div>
      </PageSection>

      <PageSection class="mt-20 flex-1 flex items-center">
        <div class="flex-1 flex">
          <NAlert type="info" title="Paytg" class="w-full">
            <div id="how-it-works" class="text-base w-2/3">
              Это удобный телеграм-бот, с помощью которого ваши гости могут сделать заказ
              самостоятельно, без участия персонала. Он открывается по QR-коду, расположенному за
              столиком, и работает как касса самообслуживания.
            </div>
          </NAlert>
        </div>
      </PageSection>

      <PageSection class="mt-20 flex-1 flex flex-col items-center w-1/2 mx-auto">
        <h1 class="text-3xl font-bold">Как это работает?</h1>
        <NTimeline vertical size="large" class="mt-5">
          <NTimelineItem
            type="success"
            title="Гость сканирует QR-код и попадает в телеграм-бота"
            content="А при следующем визите бот уже будет у гостя в телеграме"
          />
          <NTimelineItem
            type="success"
            title="Гость выбирает понравившиеся позиции и оплачивает заказ"
            content="Меню представленно в привычном виде с описанием и возможностью кастомизировать каждую позицию, выбрав необходимый объем и добавки"
          />
          <NTimelineItem
            type="success"
            title="Заказ попадает на кухню"
            content="Как только заказ начнут готовить, гость получается уведомление"
          />
          <NTimelineItem
            id="why-paytg"
            type="success"
            title="Гость получает увдомление о готовности"
            content="Гость может сам забрать заказ, либо получить его за свой столик"
          />
        </NTimeline>
      </PageSection>

      <PageSection class="mt-20 flex-1 flex flex-col items-center w-1/2 mx-auto">
        <h1 class="text-3xl font-bold">
          Почему
          <NGradientText class="font-bold" type="info">Paytg</NGradientText>
          и в чем выгода?
        </h1>
        <div class="flex-1 flex flex-col mt-5 text-base gap-4">
          <div class="flex-1 flex items-center">
            <IconIc:baseline-telegram width="64" height="64" class="flex-shrink-0 mr-3" />
            <span>
              Не нужно разрабатывать приложение для вашего бизнеса, а гостям не нужно скачивать
              очередное приложение, ведь телеграм есть у каждого и стал самым популярным приложением
              в РФ
            </span>
          </div>
          <div class="flex-1 flex items-center">
            <IconFa6Solid:money-bill-trend-up width="64" height="64" class="flex-shrink-0 mr-3" />
            <span>
              Внедрение приложения в ресторанный бизнес в среднем увеличивает доход на 25%
            </span>
          </div>
          <div class="flex-1 flex items-center">
            <IconMaterialSymbols:mail width="64" height="64" class="flex-shrink-0 mr-3" />
            <span>Возможность делать рассылку о новых позициях или акциях</span>
          </div>
          <div class="flex-1 flex items-center">
            <IconMdi:food width="64" height="64" class="flex-shrink-0 mr-3" />
            <span>
              Гости видят аппетитные фото ваших блюд, могут не торопясь изучить меню и прочитать
              описание
            </span>
          </div>
          <div class="flex-1 flex items-center">
            <IconIon:time width="64" height="64" class="flex-shrink-0 mr-3" />
            <span>Экономия времени персонала</span>
          </div>
          <div class="flex-1 flex items-center">
            <IconIconParkSolid:good-two width="64" height="64" class="flex-shrink-0 mr-3" />
            <span>Уменьшение очередей и ошибок в заказах</span>
          </div>
        </div>
      </PageSection>

      <PageSection class="mt-20 flex-1 flex items-center"></PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style lang="scss">
@import '../assets/sass/variables';

@keyframes anim-fg-1 {
  0%,
  16.667%,
  100% {
    opacity: 1;
  }

  33.333%,
  83.333% {
    opacity: 0;
  }
}

@keyframes anim-fg-2 {
  0%,
  16.667%,
  66.667%,
  100% {
    opacity: 0;
  }

  33.333%,
  50% {
    opacity: 1;
  }
}

@keyframes anim-fg-3 {
  0%,
  50%,
  100% {
    opacity: 0;
  }

  66.667%,
  83.333% {
    opacity: 1;
  }
}

.animated-text-bg {
  position: relative;
  display: block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  content: var(--content);
  display: block;
  width: 100%;
  color: theme('colors.slate.800');
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  padding-left: $padding;
  padding-right: $padding;
  &:before {
    content: var(--content);
    position: absolute;
    display: block;
    width: 100%;
    color: theme('colors.slate.800');
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    padding-left: $padding;
    padding-right: $padding;
  }
}
.animated-text-fg {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: $padding;
  padding-right: $padding;
  background-image: linear-gradient(90deg, var(--start-color), var(--end-color));
  position: relative;
  opacity: 0;
  z-index: 1;
  animation: var(--animation-name) 8s infinite;
}

html.dark {
  .animated-text-bg {
    color: theme('colors.gray.100');
    &:before {
      color: theme('colors.gray.100');
    }
  }
}

html,
body {
  scroll-behavior: smooth;
}

.triangle-shape {
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 40px solid theme('colors.green.600');
  transform: translate(-15rem, 0rem) rotate(45deg);
}

.n-timeline .n-timeline-item .n-timeline-item-content .n-timeline-item-content__title {
  font-weight: bold;
  font-size: 20px;
}

.n-timeline .n-timeline-item .n-timeline-item-content .n-timeline-item-content__content {
  font-size: 16px;
}
</style>
