<template>
	<AppNavigationItem v-show="!deleting"
		:title="room.name"
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
			<ActionButton
				:close-after-click="true"
				@click="onFavoriteClick">
				<template #icon>
					<StarIcon :size="20" />
				</template>
				{{ t('integration_visavid', 'Add to favorites') }}
			</ActionButton>
			<ActionButton
				:close-after-click="true"
				@click="onDeleteClick">
				<template #icon>
					<DeleteIcon :size="20" />
				</template>
				{{ t('integration_visavid', 'Delete') }}
			</ActionButton>
		</template>
	</AppNavigationItem>
</template>

<script>
import StarIcon from 'vue-material-design-icons/Star'
import DeleteIcon from 'vue-material-design-icons/Delete'
import ForumIcon from 'vue-material-design-icons/Forum'
import ForumOutlineIcon from 'vue-material-design-icons/ForumOutline'
import ClickOutside from 'vue-click-outside'

import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import { showUndo } from '@nextcloud/dialogs'

import { Timer } from '../utils'

export default {
	name: 'RoomNavigationItem',
	components: {
		AppNavigationItem,
		ActionButton,
		ForumIcon,
		ForumOutlineIcon,
		DeleteIcon,
		StarIcon,
	},
	directives: {
		ClickOutside,
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
