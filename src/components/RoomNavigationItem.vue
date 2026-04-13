<template>
	<NcAppNavigationItem v-show="!deleting"
		:name="room.name"
		:class="{ selectedRoom: selected }"
		:force-menu="false"
		@click="onRoomClick">
		<template #icon>
			<ForumIcon v-if="selected"
				:size="20" />
			<ForumOutlineIcon v-else
				:size="20" />
		</template>
		<template #actions>
			<NcActionButton
				:close-after-click="true"
				@click="onFavoriteClick">
				<template #icon>
					<StarIcon :size="20" />
				</template>
				{{ t('integration_visavid', 'Add to favorites') }}
			</NcActionButton>
			<NcActionButton
				:close-after-click="true"
				@click="onDeleteClick">
				<template #icon>
					<DeleteIcon :size="20" />
				</template>
				{{ t('integration_visavid', 'Delete') }}
			</NcActionButton>
		</template>
	</NcAppNavigationItem>
</template>

<script>
import StarIcon from 'vue-material-design-icons/Star.vue'
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import ForumIcon from 'vue-material-design-icons/Forum.vue'
import ForumOutlineIcon from 'vue-material-design-icons/ForumOutline.vue'

import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'

import { showUndo } from '@nextcloud/dialogs'

import { Timer } from '../utils.js'

export default {
	name: 'RoomNavigationItem',
	components: {
		NcAppNavigationItem,
		NcActionButton,
		ForumIcon,
		ForumOutlineIcon,
		DeleteIcon,
		StarIcon,
	},
	props: {
		room: {
			type: Object,
			required: true,
		},
		selected: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			deleting: false,
			deletionTimer: null,
		}
	},
	computed: {
	},
	beforeMount() {
	},
	methods: {
		onRoomClick(e) {
			this.$emit('room-clicked', this.room.id)
		},
		onDeleteClick() {
			this.deleting = true
			this.deletionTimer = new Timer(() => {
				this.$emit('delete-room', this.room.id)
			}, 10000)
			showUndo(t('integration_visavid', 'Room deleted'), this.cancelDeletion, { timeout: 10000 })
			this.$emit('deleting-room', this.room.id)
		},
		cancelDeletion() {
			this.deleting = false
			this.deletionTimer.pause()
			delete this.deletionTimer
		},
		onFavoriteClick() {
			console.debug('on fav click')
		},
	},
}
</script>

<style scoped lang="scss">
// nothing
</style>
