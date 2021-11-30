export interface Shipping {
  ShippingId: string;
  CompanyId: string;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  Selected?: boolean;
}


export const systemShippings: Shipping[] = [
  {
    ShippingId: '',
    CompanyId: '',
    Name: 'Self Collect',
    Description: '',
    Price: 0,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1

  },
  {
    ShippingId: 'courier',
    CompanyId: '',
    Name: 'Delivery',
    Description: '',
    Price: 100,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1
  }
]