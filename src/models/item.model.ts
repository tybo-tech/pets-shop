import { COMPANY, ITEM_TYPES } from "src/shared/constants"

export interface Item {
  Id?: string;
  IdUi?: string;
  Selected?: boolean;
  ItemId: string;
  RelatedId: string;
  RelatedParentId: string;
  Name: string;
  CompanyId?: string;
  ParentId?: string;
  ItemType?: string;
  Description?: string;
  DescriptionJson?: OperatingHoursModel[];
  OrderingNo?: number;
  Price?: number;
  LimitValue: number;
  OffLimitPrice: number;
  ItemStatus?: string;
  ItemCode?: string;
  ImageUrl?: string;
  ItemPin?: string;
  ItemCategory: string;
  ItemSubCategory?: string;
  Latitude?: number;
  Longitude?: number;
  AddressLine?: string;
  LocationType?: string;
  LocationNumber?: string;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  StatusId?: number;
  Children?: Item[];
  SelectedItemId?: string;
  ShowMore?: boolean;
}

export const item: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: '',
  ParentId: '',
  ItemType: '',
  CompanyId: '',
  Description: '',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: '',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: '',
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}


export const ITEM_ABOUT_US: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: ITEM_TYPES.ABOUT.Name,
  ParentId: '',
  ItemType: ITEM_TYPES.ABOUT.Name,
  CompanyId: COMPANY,
  Description: '',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.SETTINGS.Name,
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}

export const ITEM_NAVBARTHEME: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: ITEM_TYPES.NAV_BARTHEME.Name,
  ParentId: '',
  ItemType: ITEM_TYPES.NAV_BARTHEME.Name,
  CompanyId: COMPANY,
  Description: 'light-nav',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.SETTINGS.Name,
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}

export const ITEM_TITLE: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: ITEM_TYPES.TITLE.Name,
  ParentId: '',
  ItemType: ITEM_TYPES.TITLE.Name,
  CompanyId: COMPANY,
  Description: '',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.SETTINGS.Name,
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}



export const ITEM_PAYFAST: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: '',
  ParentId: '',
  ItemType: ITEM_TYPES.PAYFAST.Name,
  CompanyId: COMPANY,
  Description: '',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.SETTINGS.Name,
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}



export const ITEM_CUSTOMER_ADRESS: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: '',
  ParentId: '',
  ItemType: ITEM_TYPES.CUSTOMER_ADRESS.Name,
  CompanyId: COMPANY,
  Description: '',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.PROFILES.Name,
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}



export const OPARATING_HOURS: OperatingHoursModel[] = [
  { Day: 'Monday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Tuesday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Wednesday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Thursday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Friday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Saturday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Sunday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Public holiday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
]


export const ITEM_COLLECTIONS: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: ITEM_TYPES.ORDER_COLLECTIONS.Name,
  ParentId: '',
  ItemType: ITEM_TYPES.ORDER_COLLECTIONS.Name,
  CompanyId: COMPANY,
  Description: JSON.stringify(OPARATING_HOURS),
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.SETTINGS.Name,
  ItemSubCategory: '',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}


export const ITEM_DELIVERY: Item = {
  ItemId: '',
  RelatedId: '',
  RelatedParentId: '',
  Name: ITEM_TYPES.ORDER_DELIVERY.Name,
  ParentId: '',
  ItemType: ITEM_TYPES.ORDER_DELIVERY.Name,
  CompanyId: COMPANY,
  Description: '',
  OrderingNo: 1,
  Price: 0,
  LimitValue: 0,
  OffLimitPrice: 0,
  ItemStatus: 'Active',
  ItemCode: '',
  ImageUrl: '',
  ItemPin: '',
  ItemCategory: ITEM_TYPES.SETTINGS.Name,
  ItemSubCategory: 'Fixed',
  CreateUserId: '',
  ModifyUserId: '',
  StatusId: 1
}
export interface OperatingHoursModel {
  Day: string;
  Open: string
  OpenTime: string
  CloseTime: string
}