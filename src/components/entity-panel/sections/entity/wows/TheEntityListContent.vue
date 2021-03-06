<template>
  <div class="custom-the-entity-list-content">
    <v-divider class="px-2"></v-divider>
    <entity-search v-model="search" :game="game" placeholder="entity.textField.placeholder" />
    <v-item-group
      :value="selectedDefaultEntityId"
      class="custom-default-entities-container mb-2"
    >
      <v-item
        v-for="defaultEntity in getDefaultEntities"
        :key="defaultEntity.id"
      >
        <entity-card
          :active="Number(defaultEntity.id) === selectedDefaultEntityId"
          :entity="defaultEntity"
          :noOfEntitiesOnCanvas="getNumberOfEntitiesOnCanvas(defaultEntity)"
          @click="defaultEntityChipGroupOnChangeHandler"
        />
      </v-item>
    </v-item-group>
    <v-lazy
      v-if="entitySearch.length > 0"
      max-height="200"
    >
      <v-item-group
        :value="selectedEntityId"
        class="custom-entities-container"
      >
        <v-item
          v-for="entity in entitySearch"
          :key="entity.id"
        >
          <entity-card
            :active="Number(entity.id) === selectedEntityId"
            :entity="entity"
            :noOfEntitiesOnCanvas="getNumberOfEntitiesOnCanvas(entity)"
            @click="entityChipGroupOnChangeHandler"
          />
         </v-item>
      </v-item-group>
    </v-lazy>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, Entity, Game } from '@/store/types'
import { AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { Ship, EntitiesDataApi } from '@/types/games/wows'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/tool'
import EntityCard from '../EntityCard.vue'
import { GameApiRoutes } from '@/games/utils'
import { Prop, Watch } from 'vue-property-decorator'
import EntitySearch from '../EntitySearch.vue'
import { CanvasElement, CanvasElementType } from '@/types/canvas'
import { SocketCanvasGetters } from '@/store/modules/socket/canvas'

const AppRoom = namespace(Namespaces.APP_ROOM)
const AppTools = namespace(Namespaces.APP_TOOLS)
const SocketCanvas = namespace(Namespaces.SOCKET_CANVAS)

@Component({
  name: 'TheEntityListContent',
  components: {
    EntityCard,
    EntitySearch
  }
})
export default class TheEntityListContent extends Vue {
  @Prop() game!: Game
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[];
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool | undefined
  @SocketCanvas.Getter(SocketCanvasGetters.CANVAS_ELEMENTS) canvasElements!: CanvasElement[]

  @Watch('enabledTool')
  onPropertyChangeHandler () {
    if (this.enabledTool?.name !== 'entity') {
      this.selectedDefaultEntityId = -1
      this.selectedEntityId = -1
    }
  }

  search = ''
  selectedDefaultEntityId = -1
  selectedEntityId = -1

  get entities (): Entity[] {
    const apiData: Api | undefined = this.api.find((api: Api) => api.name === GameApiRoutes[Game.WOWS].entities)
    if (apiData?.data) {
      const entities = (apiData.data as EntitiesDataApi).entities as Ship[]
      return entities.filter((ship: Ship) => !ship.default).map((ship: Ship): Ship => ({
        id: ship.id,
        apiId: ship.apiId,
        name: ship.name,
        title: ship.title,
        game: Game.WOWS,
        image: ship.image,
        tier: ship.tier,
        type: ship.type,
        default: ship.default,
        data: ship.data,
        canvasImage: ship.canvasImage,
        color: ship.color
      }))
    }
    return []
  }

  get entitySearch (): Entity[] {
    if (!this.search || this.search?.length < 3) {
      return []
    } else {
      return this.entities.filter((entity: Entity) => entity.name.toLowerCase().includes(this.search.toLowerCase())).sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    }
  }

  get getDefaultEntities (): Entity[] {
    const apiData: Api | undefined = this.api.find((api: Api) => api.name === GameApiRoutes[Game.WOWS].entities)
    if (apiData?.data) {
      const entities = (apiData.data as EntitiesDataApi).entities as Ship[]
      return entities.filter((ship: Ship) => ship.default).map((ship: Ship): Ship => ({
        id: ship.id,
        apiId: ship.apiId,
        name: ship.name,
        title: ship.title,
        game: Game.WOWS,
        tier: ship.tier,
        type: ship.type,
        default: ship.default,
        data: ship.data,
        image: ship.image,
        canvasImage: ship.canvasImage,
        color: ship.color
      }))
    }
    return []
  }

  get entitiesOnCanvas () {
    return this.canvasElements.filter((canvasElement: CanvasElement) => canvasElement.type === CanvasElementType.ENTITY && canvasElement.isVisible)
  }

  getNumberOfEntitiesOnCanvas (entity: Ship) {
    return this.entitiesOnCanvas.filter((canvasElement: CanvasElement) => canvasElement.data.id === entity.id).length
  }

  defaultEntityChipGroupOnChangeHandler (entity: Ship) {
    if (this.selectedEntityId !== -1) {
      this.selectedEntityId = -1
    }
    this.selectedDefaultEntityId = this.selectedDefaultEntityId === Number(entity.id) ? -1 : Number(entity.id)
  }

  entityChipGroupOnChangeHandler (entity: Ship) {
    if (this.selectedDefaultEntityId !== -1) {
      this.selectedDefaultEntityId = -1
    }
    this.selectedEntityId = this.selectedEntityId === Number(entity.id) ? -1 : Number(entity.id)
  }
}
</script>
<style lang="scss" scoped>
.custom-the-entity-list-content {
  min-height: 120px;
}
</style>
<style lang="scss">
.custom-entities-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .v-slide-group__wrapper .v-slide-group__content {
    overflow: auto;
    max-height: 200px;
    justify-content: space-around;
    @include custom-scroll-bar;
  }
}

.custom-default-entities-container {
  display: flex;
  justify-content: space-around;
}

.custom-wows-entity-ship-search .v-text-field__details {
  display: none;
}
</style>
