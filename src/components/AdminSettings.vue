<template>
	<div id="visavid_prefs" class="section">
		<h2>
			<VisavidIcon :size="20" />
			{{ t('integration_visavid', 'Visavid integration') }}
		</h2>
		<div class="fields">
			<div class="field">
				<ServerIcon :size="20" />
				<label for="base-url">
					{{ t('integration_visavid', 'Base API URL') }}
				</label>
				<input id="base-url"
					v-model="state.base_url"
					type="text"
					:placeholder="t('integration_visavid', 'https://...')"
					@input="onInput">
			</div>
			<div class="field">
				<LockIcon :size="20" />
				<label for="api-key">
					{{ t('integration_visavid', 'API key') }}
				</label>
				<input id="api-key"
					v-model="state.api_key"
					type="password"
					:readonly="readonly"
					:placeholder="t('integration_visavid', '...')"
					@input="onInput"
					@focus="readonly = false">
			</div>
		</div>
	</div>
</template>

<script>
import ServerIcon from 'vue-material-design-icons/Server.vue'
import LockIcon from 'vue-material-design-icons/Lock.vue'

import VisavidIcon from './VisavidIcon.vue'

import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { delay } from '../utils.js'
import { showSuccess, showError } from '@nextcloud/dialogs'

export default {
	name: 'AdminSettings',

	components: {
		ServerIcon,
		LockIcon,
		VisavidIcon,
	},

	props: [],

	data() {
		return {
			state: loadState('integration_visavid', 'admin-config'),
			// to prevent some browsers to fill fields with remembered passwords
			readonly: true,
		}
	},

	watch: {
	},

	mounted() {
	},

	methods: {
		onInput() {
			const that = this
			delay(() => {
				that.saveOptions()
			}, 2000)()
		},
		saveOptions() {
			const req = {
				values: {
					api_key: this.state.api_key,
					base_url: this.state.base_url,
				},
			}
			const url = generateUrl('/apps/integration_visavid/admin-config')
			axios.put(url, req).then((response) => {
				showSuccess(t('integration_visavid', 'Visavid admin options saved'))
			}).catch((error) => {
				showError(
					t('integration_visavid', 'Failed to save Visavid admin options')
						+ ': ' + (error.response?.request?.responseText ?? ''),
				)
				console.debug(error)
			}).then(() => {
			})
		},
	},
}
</script>

<style scoped lang="scss">
#visavid_prefs {
	h2 {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 8px;
	}
	.fields {
		display: flex;
		flex-direction: column;
		.field {
			display: flex;
			align-items: center;
			margin: 5px 0 5px 0;
			> * {
				margin: 0 5px 0 5px;
			}
			label {
				width: 150px;
			}
			input {
				width: 200px;
			}
		}
	}
}
</style>
