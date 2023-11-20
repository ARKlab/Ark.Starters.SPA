//** State *****************************************/
export const stringInitial: string = "initial";
export const stringLoading: string = "loading";
export const stringLoaded: string = "loaded";
export const stringError: string = "error";

export const State_Initial = { tag: stringInitial } as const;
export const State_Loading = { tag: stringLoading } as const;
export const State_Loaded = { tag: stringLoaded } as const;
export const State_Error = { tag: stringError } as const;

//** Variables **************************************/
export const MobileWitdh: number  = 1000;
export const searchTextQueryParam: string = 'searchText'
export const supplierIdSearchQueryParam: string = 'supplier'
export const categoryIdSearchQueryParam: string = 'categoryId'
export const brandIdSearchParam: string = 'brandId'
export const Enum_CompanyVerified: string = 'Verified'

export const AddressDefaultCountryCode: string = 'IT'

export const DefaultCurrency = "EUR";




