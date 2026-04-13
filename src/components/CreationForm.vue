<template>
	<div class="creationForm">
		<h2>
			{{ t('integration_visavid', 'Create a room') }}
		</h2>
		<div class="fields">
			<div v-for="(field, fieldId) in fields"
				:key="fieldId"
				class="field">
				<div v-if="!['ncSwitch', 'ncCheckbox'].includes(field.type)"
					class="fieldLabelWithIcon">
					<component :is="field.icon"
						v-if="field.icon"
						:size="20" />
					<label
						:for="'room-' + fieldId">
						{{ field.label }}
					</label>
				</div>
				<span v-else class="fieldLabelWithIcon" />
				<input v-if="field.type === 'text'"
					:id="'room-' + fieldId"
					v-model="newRoom[fieldId]"
					type="text"
					:placeholder="field.placeholder">
				<span v-else-if="field.type === 'textarea'"
					class="textarea-wrapper">
					<textarea
						:id="'room-' + fieldId"
						v-model="newRoom[fieldId]"
						:placeholder="field.placeholder" />
				</span>
				<NcDateTimePicker v-else-if="field.type === 'ncDate'"
					:id="'room-' + fieldId"
					v-model="newRoom[fieldId]"
					type="date"
					:placeholder="field.placeholder"
					:clearable="true"
					:confirm="false" />
				<NcDateTimePicker v-else-if="field.type === 'ncDatetime'"
					:id="'room-' + fieldId"
					v-model="newRoom[fieldId]"
					type="datetime"
					:placeholder="field.placeholder"
					:minute-step="1"
					:clearable="true"
					:confirm="true" />
				<div v-else-if="field.type === 'ncColor'">
					<NcColorPicker
						:value="newRoom[fieldId]"
						@input="updateColor($event, fieldId)">
						<Button
							v-tooltip.top="{ content: t('integration_visavid', 'Choose color') }"
							:style="{ backgroundColor: newRoom[fieldId] }" />
					</NcColorPicker>
				</div>
				<NcSelect v-else-if="field.type === 'select'"
					:model-value="newRoom[fieldId]"
					:options="Object.values(field.options)"
					label="label"
					:placeholder="field.placeholder"
					@update:model-value="setSelectValue(fieldId, $event)"
					@search-change="query = $event">
					<template #option="{option}">
						<component :is="option.icon"
							v-if="option.icon"
							class="option-icon"
							:size="20" />
						<Highlight :text="option.label" :search="query" class="option-title multiselect-option-title" />
					</template>
					<template #singleLabel="{option}">
						<component :is="option.icon"
							v-if="option.icon"
							class="multiselect-label-icon"
							:size="20" />
						<span class="option-title">
							{{ option.label }}
						</span>
					</template>
				</NcSelect>
				<RadioElementSet v-else-if="field.type === 'customRadioSet'"
					:name="fieldId + '_radio'"
					:options="field.options"
					:value="newRoom[fieldId]"
					@update:value="newRoom[fieldId] = $event">
					<template #icon="{option}">
						<component :is="option.icon"
							v-if="option.icon" />
					</template>
					<template #label="{option}">
						{{ option.label }}
					</template>
				</RadioElementSet>
				<div v-else-if="field.type === 'ncRadioSet'">
					<NcCheckboxRadioSwitch v-for="(option, id) in field.options"
						:key="id"
						v-model="newRoom[fieldId]"
						:value="id"
						:name="fieldId + '_radio'"
						type="radio"
						class="ncradio">
						<component :is="option.icon"
							v-if="option.icon"
							class="option-icon"
							:size="20" />
						<span class="option-title">
							{{ option.label }}
						</span>
					</NcCheckboxRadioSwitch>
				</div>
				<div v-else-if="field.type === 'ncCheckboxSet'">
					<NcCheckboxRadioSwitch v-for="(option, id) in field.options"
						:key="id"
						v-model="newRoom[fieldId]"
						:value="id"
						:name="fieldId + '_checkbox'"
						class="ncradio">
						<component :is="option.icon"
							v-if="option.icon"
							class="option-icon"
							:size="20" />
						<span class="option-title">
							{{ option.label }}
						</span>
					</NcCheckboxRadioSwitch>
				</div>
				<div v-else-if="field.type === 'ncSwitch'">
					<NcCheckboxRadioSwitch
						v-model="newRoom[fieldId]"
						type="switch"
						class="ncradio">
						<component :is="field.icon"
							v-if="field.icon"
							class="option-icon"
							:size="20" />
						{{ field.label }}
					</NcCheckboxRadioSwitch>
				</div>
				<div v-else-if="field.type === 'ncCheckbox'">
					<NcCheckboxRadioSwitch
						v-model="newRoom[fieldId]"
						class="ncradio">
						<component :is="field.icon"
							v-if="field.icon"
							class="option-icon"
							:size="20" />
						{{ field.label }}
					</NcCheckboxRadioSwitch>
				</div>
			</div>
		</div>
		<div class="footer">
			<NcButton @click="$emit('cancel-clicked')">
				<template #icon>
					<UndoIcon />
				</template>
				{{ t('integration_visavid', 'Cancel') }}
			</NcButton>
			<NcButton variant="primary" @click="onOkClick">
				<template #icon>
					<CheckIcon />
				</template>
				{{ t('integration_visavid', 'Create') }}
			</NcButton>
		</div>
	</div>
</template>

<script>
import PaletteIcon from 'vue-material-design-icons/Palette.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import UndoIcon from 'vue-material-design-icons/Undo.vue'

import NcButton from '@nextcloud/vue/components/NcButton'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import NcColorPicker from '@nextcloud/vue/components/NcColorPicker'
import NcDateTimePicker from '@nextcloud/vue/components/NcDateTimePicker'
import NcHighlight from '@nextcloud/vue/components/NcHighlight'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'

import { showError } from '@nextcloud/dialogs'

import { fields } from '../utils.js'
import RadioElementSet from './RadioElementSet.vue'

export default {
	name: 'CreationForm',

	components: {
		RadioElementSet,
		CheckIcon,
		UndoIcon,
		PaletteIcon,
		NcButton,
		NcSelect,
		NcDateTimePicker,
		NcColorPicker,
		NcHighlight,
		NcCheckboxRadioSwitch,
	},

	props: {
	},

	data() {
		return {
			// newRoom: { style: fields.style.default, permissions: fields.permissions.default },
			newRoom: {},
			fields,
			query: '',
		}
	},

	computed: {
	},

	watch: {
	},

	beforeMount() {
		const roomWithDefaults = {}
		Object.keys(fields).forEach((fieldId) => {
			roomWithDefaults[fieldId] = fields[fieldId].default
		})
		this.newRoom = {
			...roomWithDefaults,
		}
	},

	mounted() {
	},

	methods: {
		onOkClick() {
			let isFormValid = true
			Object.keys(this.fields).forEach((fieldId) => {
				const field = this.fields[fieldId]
				const fieldValue = this.newRoom[fieldId]
				// a field with false as value is accepted
				if (!fieldValue && fieldValue !== false) {
					showError(t('integration_visavid', 'Field "{name}" is missing', { name: field.label }))
					isFormValid = false
				}
			})
			if (isFormValid) {
				this.$emit('ok-clicked', {
					...this.newRoom,
					type: this.newRoom.type.id,
				})
			}
		},
		setSelectValue(fieldId, newValue) {
			// this fixes the issue when selecting the currently select option
			if (newValue !== null) {
				this.newRoom[fieldId] = newValue
			}
		},
		updateColor(color, fieldId) {
			this.newRoom[fieldId] = color
		},
	},
}
</script>

<style scoped lang="scss">
.creationForm {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 12px;

	.fields {
		display: flex;
		flex-direction: column;
		.field {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			margin: 5px 0 5px 0;
			padding: 8px;
			border-radius: var(--border-radius-large);
			&:hover {
				background-color: var(--color-background-hover);
			}
			> * {
				margin: 4px;
				&:last-child {
					width: 250px;
				}
			}
			.fieldLabelWithIcon {
				display: flex;
				width: 250px;
				label {
					width: 150px;
				}
				> * {
					margin: 0 8px 0 8px;
				}
			}
			.option-icon {
				margin-left: 4px;
				margin-right: 8px;
			}
			.multiselect-label-icon {
				margin-right: 12px;
			}
			.option-title {
				// nothing
			}
			.multiselect-option-title {
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.textarea-wrapper {
				textarea {
					height: 65px;
					width: 250px;
					max-width: 250px;
				}
			}
			// this fixes the multiline radio label
			::v-deep .ncradio > label {
				height: unset !important;
				min-height: 44px;
				> * {
					margin-top: 8px;
					margin-bottom: 8px;
				}
			}
		}
	}

	.footer {
		display: flex;
		align-items: center;
		margin-top: 12px;
		> * {
			margin: 0 10px 0 10px;
		}
	}
}
</style>
