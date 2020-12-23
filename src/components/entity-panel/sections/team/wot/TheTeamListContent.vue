<template>
  <span>
    <span class="custom-team-title-container">
      <span class="ml-2 caption" v-text="$t(selectedTeam.name)" />
    </span>
    <v-divider class="mx-2" />
    <v-list dense>
      <v-list-item-group>
        <team-list-item
          v-for="entity in sortedEntities"
          :key="entity.id"
          :active="entity.id === selectedEntityId"
          :entity="entity"
          :game="game"
          @click="entityOnClickHandler"
        />
      </v-list-item-group>
    </v-list>
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Team, Game } from '@/store/types'
import TeamListItem from '../TeamListItem.vue'
import { Prop } from 'vue-property-decorator'
import { GameEntity } from '@/types/games'
import { Tank } from '@/types/games/wot'

@Component({
  name: 'TheTeamListContent',
  components: {
    TeamListItem
  }
})
export default class TheTeamListContent extends Vue {
  @Prop() selectedTeam!: Team | undefined
  @Prop() game!: Game

  selectedEntityId = ''

  get sortedEntities () {
    return this.selectedTeam?.entities.sort((entityA: GameEntity, entityB: GameEntity) => entityA.type < entityB.type ? -1 : 1) || []
  }

  entityOnClickHandler (entity: Tank) {
    this.selectedEntityId = this.selectedEntityId === entity.id ? '' : entity.id
  }
}
</script>
<style lang="scss" scoped>
.custom-team-title-container {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.custom-text-field-wows .v-text-field__details {
  display: none;
}
</style>
