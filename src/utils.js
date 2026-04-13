import ClockOutlineIcon from 'vue-material-design-icons/ClockOutline.vue'
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant.vue'
import HomeGroupIcon from 'vue-material-design-icons/HomeGroup.vue'
import AccountGroupIcon from 'vue-material-design-icons/AccountGroup.vue'
import AccountGroupOutlineIcon from 'vue-material-design-icons/AccountGroupOutline.vue'
import TextIcon from 'vue-material-design-icons/Text.vue'
import PaletteIcon from 'vue-material-design-icons/Palette.vue'
import PaletteSwatchIcon from 'vue-material-design-icons/PaletteSwatch.vue'
import PaletteSwatchOutlineIcon from 'vue-material-design-icons/PaletteSwatchOutline.vue'
import TextLongIcon from 'vue-material-design-icons/TextLong.vue'
import CalendarMonthIcon from 'vue-material-design-icons/CalendarMonth.vue'
import FormatListBulletedTypeIcon from 'vue-material-design-icons/FormatListBulletedType.vue'

export function Timer(callback, mydelay) {
	let timerId
	let start
	let remaining = mydelay

	this.pause = function() {
		window.clearTimeout(timerId)
		remaining -= new Date() - start
	}

	this.resume = function() {
		start = new Date()
		window.clearTimeout(timerId)
		timerId = window.setTimeout(callback, remaining)
	}

	this.resume()
}

let mytimer = 0

export function delay(callback, ms) {
	return function() {
		const context = this
		const args = arguments
		clearTimeout(mytimer)
		mytimer = setTimeout(function() {
			callback.apply(context, args)
		}, ms || 0)
	}
}

export const fields = {
	name: {
		icon: TextIcon,
		label: t('integration_visavid', 'Simple text'),
		type: 'text',
		placeholder: t('integration_visavid', 'text placeholder'),
		default: 'optional default value',
	},
	comment: {
		icon: TextLongIcon,
		label: t('integration_visavid', 'Text area'),
		type: 'textarea',
		placeholder: t('integration_visavid', 'long text\nplaceholder\n...'),
		default: 'optional\ndefault\nvalue',
	},
	date: {
		icon: CalendarMonthIcon,
		label: t('integration_visavid', 'Date'),
		type: 'ncDate',
		default: new Date('2022-12-29'),
	},
	datetime: {
		icon: ClockOutlineIcon,
		label: t('integration_visavid', 'Datetime'),
		type: 'ncDatetime',
		default: new Date('2022-12-29 01:02:03'),
	},
	color: {
		icon: PaletteIcon,
		label: t('integration_visavid', 'Color'),
		type: 'ncColor',
		default: '#6ea68f',
	},
	share: {
		icon: ShareVariantIcon,
		label: t('integration_visavid', 'Switch'),
		type: 'ncSwitch',
		default: true,
		// enabledIcon: TextIcon,
		// disabledIcon: TextLongIcon,
	},
	share1: {
		icon: ShareVariantIcon,
		label: t('integration_visavid', 'Switch with a very very very very very very very very long label'),
		type: 'ncSwitch',
		default: true,
		// enabledIcon: TextIcon,
		// disabledIcon: TextLongIcon,
	},
	share2: {
		label: t('integration_visavid', 'Switch without icon'),
		type: 'ncSwitch',
		default: false,
		// enabledIcon: TextIcon,
		// disabledIcon: TextLongIcon,
	},
	check: {
		icon: ShareVariantIcon,
		label: t('integration_visavid', 'Checkbox'),
		type: 'ncCheckbox',
		default: true,
		// enabledIcon: TextIcon,
		// disabledIcon: TextLongIcon,
	},
	check1: {
		icon: ShareVariantIcon,
		label: t('integration_visavid', 'Checkbox with a very very very very very very very very long label'),
		type: 'ncCheckbox',
		default: true,
		// enabledIcon: TextIcon,
		// disabledIcon: TextLongIcon,
	},
	check2: {
		label: t('integration_visavid', 'Checkbox without icon'),
		type: 'ncCheckbox',
		default: false,
		// enabledIcon: TextIcon,
		// disabledIcon: TextLongIcon,
	},
	type: {
		icon: FormatListBulletedTypeIcon,
		label: t('integration_visavid', 'Multi select'),
		type: 'select',
		placeholder: t('integration_visavid', 'Select a value'),
		options: {
			one: { id: 'one', label: 'First multiselect value', icon: AccountGroupIcon },
			two: { id: 'two', label: 'Second multiselect value', icon: AccountGroupOutlineIcon },
			three: { id: 'three', label: 'Third multiselect long long long long long long value', icon: HomeGroupIcon },
			four: { id: 'four', label: 'Fourth multiselect value without icon' },
		},
		default: { id: 'one', label: 'First multiselect value', icon: AccountGroupIcon },
	},
	style: {
		icon: PaletteSwatchIcon,
		label: t('integration_visavid', 'Custom radio selector'),
		type: 'customRadioSet',
		options: {
			one: { label: 'First radio value', icon: PaletteSwatchIcon },
			two: { label: 'Second radio value', icon: PaletteSwatchOutlineIcon },
			three: { label: 'Third radio value with  long long long long long long long long long text', icon: PaletteIcon },
			four: { label: 'Fourth radio value without icon' },
		},
		default: 'two',
	},
	permissions: {
		icon: PaletteSwatchIcon,
		label: t('integration_visavid', 'Classic Radio selector'),
		type: 'ncRadioSet',
		options: {
			one: { label: 'First radio value', icon: PaletteSwatchIcon },
			two: { label: 'Second radio value', icon: PaletteSwatchOutlineIcon },
			three: { label: 'Third radio value with long long long long long long long text', icon: PaletteIcon },
			four: { label: 'Fourth radio value without icon' },
		},
		default: 'three',
	},
	acls: {
		icon: PaletteSwatchIcon,
		label: t('integration_visavid', 'Classic multi checkbox selector'),
		type: 'ncCheckboxSet',
		options: {
			one: { label: 'First radio value', icon: PaletteSwatchIcon },
			two: { label: 'Second radio value', icon: PaletteSwatchOutlineIcon },
			three: { label: 'Third radio value with long long long long long long long text', icon: PaletteIcon },
			four: { label: 'Fourth radio value without icon' },
		},
		default: ['one', 'three'],
	},
}
