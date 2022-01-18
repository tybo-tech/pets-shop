import { User } from '.';
import { Company } from './company.model';
import { Orderproduct } from './order.product.model';
import { Promotion } from './promotion.model';


export interface Order {
  Id?: number;
  OrdersId: string;
  OrderNo: string;
  CompanyId: string;
  CustomerId: string;
  AddressId: string;
  Notes: string;
  OrderType: string;
  Total: number;
  Shipping?: string;
  ShippingPrice?: number;
  Paid: number;
  Due: number;
  InvoiceDate: Date;
  DueDate: string;
  EstimatedDeliveryDate?: string;
  OrderSource?: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  Status: string;
  StatusId: number;
  Orderproducts?: Orderproduct[];
  Customer?: User;
  Company?: Company;
  GoBackToCreateOrder?: boolean;
  Discount?: Promotion;
  DistanceTotal?: number;
  GrandTotal?: number;
  DeliveryRate?: string;
  
  Latitude?: number;
  Longitude?: number;
  AddressLine?: string;
  LocationName?: string;
  LocationNumber?: string;
  CartItems?: number;
  VatAmount?: number;
  CustomerName?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  CustomerDp?: string;
  Password?: string;
  SaveMyDetails?: boolean;
}