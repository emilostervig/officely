export const initialFilter = {
	// type filter
	// chosenType: 'all',
	chosenTypeText: 'Alle typer',
	chosenType: {
		id: 0,
		name: "Alle typer"
	},

	// capacity filter
	capacity: 1,

	// Cowork filter
	coworkChecked: false,

	// Price slider
	priceChanged: false,

	// Orderby
	orderbyKey: 'price_asc',
	orderbyTitle: 'Pris lav til høj',

	// Period
	selectedPeriod: {
		period: false,
		startDate: false,
		endDate: false
	},

	// Industries
	selectedIndustry: [],

	// Locations
	selectedLocations: [],

	// Facilities filter
	chosenFacilities: [],
	chosenFacilitiesText: 'Vælg faciliteter',
	chosenFacilitiesDefaultText: 'Vælg faciliteter',



};





export default initialFilter;