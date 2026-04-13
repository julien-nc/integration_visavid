<template>
	<div class="roomDetails">
		<h2>
			<ForumOutlineIcon :size="20" />
			{{ room.name }}
		</h2>
		<div class="links">
			<div class="link">
				<LinkVariantIcon :size="20" />
				<label>
					{{ t('integration_visavid', 'Public room link') }}
				</label>
				<div class="linkInputWrapper">
					<input type="text" :readonly="true" :value="publicLink">
					<a :href="publicLink" @click.prevent.stop="copyLink(false)">
						<NcButton v-tooltip.bottom="{ content: t('integration_visavid', 'Copy to clipboard') }">
							<template #icon>
								<ClipboardCheckOutlineIcon v-if="publicLinkCopied"
									class="copiedIcon"
									:size="20" />
								<ClipboardArrowLeftOutlineIcon v-else
									:size="20" />
							</template>
						</NcButton>
					</a>
				</div>
			</div>
			<div class="link">
				<ShieldLinkVariantIcon :size="20" />
				<label>
					{{ t('integration_visavid', 'Admin room link') }}
				</label>
				<div class="linkInputWrapper">
					<input type="text" :readonly="true" :value="adminLink">
					<a :href="adminLink" @click.prevent.stop="copyLink(true)">
						<NcButton v-tooltip.bottom="{ content: t('integration_visavid', 'Copy to clipboard') }">
							<template #icon>
								<ClipboardCheckOutlineIcon v-if="adminLinkCopied"
									class="copiedIcon"
									:size="20" />
								<ClipboardArrowLeftOutlineIcon v-else
									:size="20" />
							</template>
						</NcButton>
					</a>
				</div>
			</div>
		</div>
		<div class="fields">
			<div v-for="(field, fieldId) in fields"
				:key="fieldId"
				class="field">
				<component :is="field.icon"
					v-if="field.icon"
					:size="20" />
				<span v-else class="emptyIcon" />
				<label class="fieldLabel">
					{{ field.label }}
				</label>
				<label v-if="['ncCheckbox'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue multiple">
					<component :is="field.enabledIcon"
						v-if="room[fieldId] && field.enabledIcon"
						:size="20" />
					<component :is="field.disabledIcon"
						v-else-if="!room[fieldId] && field.disabledIcon"
						:size="20" />
					<CheckboxMarkedIcon v-else-if="room[fieldId]" :size="20" />
					<CheckboxBlankOutlineIcon v-else-if="!room[fieldId]" :size="20" />
					{{ room[fieldId] ? t('integration_visavid', 'Enabled') : t('integration_visavid', 'Disabled') }}
				</label>
				<label v-if="['ncSwitch'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue multiple">
					<component :is="field.enabledIcon"
						v-if="room[fieldId] && field.enabledIcon"
						:size="20" />
					<component :is="field.disabledIcon"
						v-else-if="!room[fieldId] && field.disabledIcon"
						:size="20" />
					<ToggleSwitchIcon v-else-if="room[fieldId]" :size="20" />
					<ToggleSwitchOffOutlineIcon v-else-if="!room[fieldId]" :size="20" />
					{{ room[fieldId] ? t('integration_visavid', 'Enabled') : t('integration_visavid', 'Disabled') }}
				</label>
				<label v-if="['text'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue">
					{{ room[fieldId] }}
				</label>
				<label v-else-if="['ncDate'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue">
					{{ getFormattedDate(room[fieldId]) }}
				</label>
				<label v-else-if="['ncDatetime'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue">
					{{ getFormattedDatetime(room[fieldId]) }}
				</label>
				<label v-else-if="['ncColor'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue">
					<div class="colorDot" :style="{ 'background-color': room[fieldId] }" />
				</label>
				<textarea v-if="['textarea'].includes(field.type)"
					:id="'room-' + fieldId + '-value'"
					class="fieldValue"
					:value="room[fieldId]"
					:readonly="true" />
				<label v-else-if="['select', 'customRadioSet', 'ncRadioSet'].includes(field.type)"
					:for="'room-' + fieldId + '-value'"
					class="fieldValue multiple">
					<component :is="field.options[room[fieldId]].icon"
						v-if="field.options[room[fieldId]].icon"
						:size="20" />
					{{ field.options[room[fieldId]].label }}
				</label>
				<label v-else-if="['ncCheckboxSet'].includes(field.type)"
					:for="'room-' + fieldId + '-value'"
					class="fieldValue multipleVertical">
					<div v-for="optionId in room[fieldId]"
						:key="optionId"
						class="oneValue">
						<component :is="field.options[optionId].icon"
							v-if="field.options[optionId].icon"
							:size="20" />
						{{ field.options[optionId].label }}
					</div>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
import ShieldLinkVariantIcon from 'vue-material-design-icons/ShieldLinkVariant.vue'
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant.vue'
import ClipboardArrowLeftOutlineIcon from 'vue-material-design-icons/ClipboardArrowLeftOutline.vue'
import ClipboardCheckOutlineIcon from 'vue-material-design-icons/ClipboardCheckOutline.vue'
import ToggleSwitchIcon from 'vue-material-design-icons/ToggleSwitch.vue'
import ToggleSwitchOffOutlineIcon from 'vue-material-design-icons/ToggleSwitchOffOutline.vue'
import CheckboxMarkedIcon from 'vue-material-design-icons/CheckboxMarked.vue'
import CheckboxBlankOutlineIcon from 'vue-material-design-icons/CheckboxBlankOutline.vue'
import ForumOutlineIcon from 'vue-material-design-icons/ForumOutline.vue'

import NcButton from '@nextcloud/vue/components/NcButton'

import moment from '@nextcloud/moment'
import { fields, Timer } from '../utils.js'
import { showSuccess, showError } from '@nextcloud/dialogs'

export default {
	name: 'RoomDetails',

	components: {
		LinkVariantIcon,
		ShieldLinkVariantIcon,
		ClipboardArrowLeftOutlineIcon,
		ClipboardCheckOutlineIcon,
		ToggleSwitchIcon,
		ToggleSwitchOffOutlineIcon,
		CheckboxBlankOutlineIcon,
		CheckboxMarkedIcon,
		ForumOutlineIcon,
		NcButton,
	},

	props: {
		room: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			fields,
			adminLinkCopied: false,
			publicLinkCopied: false,
		}
	},

	computed: {
		publicLink() {
			return 'https://public/' + this.room.name + '/PUBLIC_TOKEN'
		},
		adminLink() {
			return 'https://admin/' + this.room.name + '/ADMIN_TOKEN'
		},
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		async copyLink(admin = false) {
			const link = admin
				? this.adminLink
				: this.publicLink
			try {
				await navigator.clipboard.writeText(link)
				if (admin) {
					this.adminLinkCopied = true
					showSuccess(t('integration_visavid', 'Admin link copied!'))
				} else {
					this.publicLinkCopied = true
					showSuccess(t('integration_visavid', 'Public link copied!'))
				}
				// eslint-disable-next-line
				new Timer(() => {
					if (admin) {
						this.adminLinkCopied = false
					} else {
						this.publicLinkCopied = false
					}
				}, 5000)
			} catch (error) {
				console.error(error)
				showError(t('integration_visavid', 'Link could not be copied to clipboard'))
			}
		},
		getFormattedDate(date) {
			return moment(date).format('LL')
		},
		getFormattedDatetime(date) {
			return moment(date).format('LLL')
		},
	},
}
</script>

<style scoped lang="scss">
.roomDetails {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	h2 {
		margin: 12px 0 32px 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.fields {
		display: flex;
		flex-direction: column;
		.field {
			display: flex;
			align-items: center;
			margin: 8px 0;
			padding: 8px;
			border-radius: var(--border-radius);
			&:hover {
				background-color: var(--color-background-hover);
			}
			> * {
				margin: 0 8px 0 8px;
			}
			.emptyIcon {
				width: 20px;
			}
			.fieldLabel {
				width: 250px;
			}
			.fieldValue {
				&.multiple {
					display: flex;
					> * {
						margin-right: 8px;
					}
				}
				&.multipleVertical {
					display: flex;
					flex-direction: column;
					.oneValue {
						display: flex;
						> * {
							margin-right: 8px;
						}
					}
				}
			}
			textarea.fieldValue {
				width: 300px;
				height: 65px;
				resize: none;
			}
			.colorDot {
				width: 24px;
				height: 24px;
				border-radius: 50%;
			}
		}
	}
	.links {
		display: flex;
		flex-direction: column;
		.link {
			display: flex;
			align-items: center;
			margin: 6px 0 6px 0;
			> * {
				margin: 0 8px 0 8px;
			}
			label {
				width: 250px;
			}
			.linkInputWrapper {
				display: flex;
				width: 300px;
				input {
					flex-grow: 1;
				}
			}
			.copiedIcon {
				color: var(--color-success);
			}
		}
	}
}
</style>
