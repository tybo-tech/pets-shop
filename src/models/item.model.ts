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