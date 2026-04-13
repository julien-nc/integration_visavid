<template>
	<NcContent app-name="integration_visavid">
		<VisavidNavigation
			:rooms="rooms"
			:selected-room-id="selectedRoomId"
			:is-configured="state.is_configured"
			@create-room-clicked="onCreateRoomClick"
			@room-clicked="onRoomClicked"
			@delete-room="onRoomDeleted"
			@deleting-room="onDeletingRoom" />
		<NcAppContent
			:list-max-width="50"
			:list-min-width="20"
			:list-size="20"
			:show-details="false"
			@update:showDetails="a = 2">
			<!--template slot="list">
			</template-->
			<RoomDetails v-if="selectedRoom"
				:room="selectedRoom" />
			<NcEmptyContent v-else-if="!state.is_configured">
				<template #icon>
					<CogIcon />
				</template>
				{{ t('integration_visavid', 'Application is not configured') }}
				<a v-if="currentUser.isAdmin"
					:href="configureUrl">
					<NcButton
						class="configureButton">
						<template #icon>
							<CogIcon />
						</template>
						{{ t('integration_visavid', 'Configure Visavid integration') }}
					</NcButton>
				</a>
				<p v-else>
					{{ t('integration_visavid', 'Ask your administrator to configure this integration') }}
				</p>
			</NcEmptyContent>
			<NcEmptyContent v-else-if="roomCount === 0">
				<template #icon>
					<VisavidIcon />
				</template>
				<span class="emptyContentWrapper">
					<span>
						{{ t('integration_visavid', 'You haven\'t created any rooms yet') }}
					</span>
					<Button
						class="createButton"
						@click="onCreateRoomClick">
						<template #icon>
							<PlusIcon />
						</template>
						{{ t('integration_visavid', 'Create a room') }}
					</Button>
				</span>
			</NcEmptyContent>
			<NcEmptyContent v-else>
				<template #icon>
					<VisavidIcon />
				</template>
				{{ t('integration_visavid', 'No selected room') }}
			</NcEmptyContent>
		</NcAppContent>
		<NcModal v-if="creationModalOpen"
			size="normal"
			@close="closeCreationModal">
			<CreationForm
				@ok-clicked="onCreationValidate"
				@cancel-clicked="closeCreationModal" />
		</NcModal>
	</NcContent>
</template>

<script>
import CogIcon from 'vue-material-design-icons/Cog.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'

import NcButton from '@nextcloud/vue/components/NcButton'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcContent from '@nextcloud/vue/components/NcContent'
import NcModal from '@nextcloud/vue/components/NcModal'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'

import { generateUrl } from '@nextcloud/router'
import { loadState } from '@nextcloud/initial-state'
import { getCurrentUser } from '@nextcloud/auth'

import VisavidNavigation from './components/VisavidNavigation.vue'
import CreationForm from './components/CreationForm.vue'
import RoomDetails from './components/RoomDetails.vue'
import VisavidIcon from './components/VisavidIcon.vue'

export default {
	name: 'App',

	components: {
		VisavidIcon,
		CreationForm,
		RoomDetails,
		VisavidNavigation,
		CogIcon,
		PlusIcon,
		NcAppContent,
		NcContent,
		NcModal,
		NcEmptyContent,
		NcButton,
	},

	props: {
	},

	data() {
		return {
			creationModalOpen: false,
			rooms: {},
			selectedRoomId: 0,
			state: loadState('integration_visavid', 'page-state'),
			currentUser: getCurrentUser(),
			configureUrl: generateUrl('/settings/admin/connected-accounts'),
		}
	},

	computed: {
		selectedRoom() {
			return this.rooms[this.selectedRoomId]
		},
		roomCount() {
			return Object.keys(this.rooms).length
		},
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onCreateRoomClick() {
			this.creationModalOpen = true
		},
		closeCreationModal() {
			this.creationModalOpen = false
		},
		onCreationValidate(room) {
			console.debug('CREATE', room)
			this.creationModalOpen = false
			const nbRooms = Object.values(this.rooms).length
			room.id = nbRooms + 1
			this.rooms[room.id] = room
			console.debug(this.rooms)
			this.selectedRoomId = room.id
		},
		onRoomClicked(roomId) {
			console.debug('select room', roomId)
			this.selectedRoomId = roomId
		},
		onRoomDeleted(roomId) {
			console.debug('DELETE room', roomId)
			this.$delete(this.rooms, roomId)
		},
		onDeletingRoom(roomId) {
			if (roomId === this.selectedRoomId) {
				this.selectedRoomId = 0
			}
		},
	},
}
</script>

<style scoped lang="scss">
::v-deep #content-vue {
	padding-top: 0 !important;
}
// TODO in global css loaded by main
body {
	min-height: 100%;
	height: auto;
}

.emptyContentWrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.createButton,
.configureButton {
	margin-top: 12px;
}
</style>
