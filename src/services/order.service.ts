import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Order } from 'src/models/order.model';
import { ADD_ORDER_URL, COMPANY, DELIVERY_RATES, DELIVERY_TYPES, GET_ORDERS_BY_USER_ID_URL, GET_ORDERS_URL, GET_ORDER_URL, ORDER_TYPE_SALES, PRINT_URL, UPDATE_ORDER_URL, VAT_RATES } from 'src/shared/constants';
import { Item } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';
import { Product } from 'src/models/product.model';
import { Orderproduct } from 'src/models/order.product.model';
import { User } from 'src/models';


@Injectable({
  providedIn: 'root'
})
export class OrderService {



  private OrderListBehaviorSubject: BehaviorSubject<Order[]>;
  public OrderListObservable: Observable<Order[]>;

  private OrderBehaviorSubject: BehaviorSubject<Order>;
  public OrderObservable: Observable<Order>;
  url: string;
  invoiceUrl = 'docs/48f1/invoice.php';

  constructor(
    private http: HttpClient
  ) {
    this.OrderListBehaviorSubject = new BehaviorSubject<Order[]>(JSON.parse(localStorage.getItem('OrdersList')) || []);
    this.OrderBehaviorSubject = new BehaviorSubject<Order>(JSON.parse(localStorage.getItem('currentOrder')));
    this.OrderListObservable = this.OrderListBehaviorSubject.asObservable();
    this.OrderObservable = this.OrderBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentOrderValue(): Order {
    return this.OrderBehaviorSubject.value;
  }

  updateOrderListState(grades: Order[]) {
    this.OrderListBehaviorSubject.next(grades);
    localStorage.setItem('OrdersList', JSON.stringify(grades));
  }
  updateOrderState(order: Order) {
    this.OrderBehaviorSubject.next(order);
    localStorage.setItem('currentOrder', JSON.stringify(order));
  }

  getOrders(companyId: string) {
    this.http.get<Order[]>(`${this.url}/${GET_ORDERS_URL}?CompanyId=${companyId}`).subscribe(data => {
      this.updateOrderListState(data || []);
    });
  }
  getOrdersSync(companyId: string) {
    return this.http.get<Order[]>(`${this.url}/${GET_ORDERS_URL}?CompanyId=${companyId}`)
  }
  getOrdersByUserIdSync(userId: string) {
    return this.http.get<Order[]>(`${this.url}/${GET_ORDERS_BY_USER_ID_URL}?UserId=${userId}`)
  }
  create(order: Order) {
    return this.http.post<Order>(`${this.url}/${ADD_ORDER_URL}`, order);
  }
  update(order: Order) {
    return this.http.post<Order>(`${this.url}/${UPDATE_ORDER_URL}`, order);
  }
  print(order: Order) {
    return this.http.post<Order>(`${this.url}/${PRINT_URL}`, order);
  }

  getOrder(OrderId: string) {
    this.http.get<Order>(`${this.url}/${GET_ORDER_URL}?OrderId=${OrderId}`).subscribe(data => {
      if (data) {
        this.updateOrderState(data);
      }
    });
  }
  getOrderSync(OrderId: string) {
    return this.http.get<Order>(`${this.url}/${GET_ORDER_URL}?OrderId=${OrderId}`);
  }

  register(model: Order) {
    return this.http.post<Order>(`${this.url}/api/account/register.php`, model).pipe(map(Order => {
      if (Order) {
        return Order;
      }
    }));
  }

  getInvoiceURL(orderId: string) {
    return `${this.url}/api/${this.invoiceUrl}?guid=${orderId}`;
  }

  getCartCount(): number {
    if (this.currentOrderValue && this.currentOrderValue.Orderproducts && this.currentOrderValue.Orderproducts, length)
      return this.currentOrderValue.Orderproducts.length;
    return 0;
  }
  calculateTotalOverdue(order: Order): Order {
    if (!order)
      return;

    order.Total = 0;
    order.VatAmount = 0;
    order.CartItems = 0;
    order.Paid = order.Paid || 0
    order.ShippingPrice = order.ShippingPrice || 0;
    order.Orderproducts.forEach(line => {
      line.SubTotal = line.Quantity * Number(line.UnitPrice);
      order.Total += (Number(line.UnitPrice) * Number(line.Quantity));
      order.CartItems += Number(line.Quantity);
      if (order.Company && order.Company.IsVATCharged === 'Yes' && line.ProductVAT === VAT_RATES.STANDARD.Name) {
        order.VatAmount += Number(line.SubTotal) * (Number(order.Company.VATPercentage) / 100.0);
      }
    });

    order.GrandTotal = Number(order.VatAmount) + Number(order.Total) + Number(order.ShippingPrice);
    order.Due = Number(order.GrandTotal) - Number(order.Paid);
    return order;
  }



  deliveryMethodChanged(order: Order, orderDelivery: Item): Order {
    if (order.Shipping === DELIVERY_TYPES.DELIVERY.Name && orderDelivery) {
      if (orderDelivery.ItemSubCategory === DELIVERY_RATES.RATE_PER_KM.Name) {
        const toLocation: LocationModel = {
          lat: order.Latitude,
          lng: order.Longitude,
          addressLine: ``,
          url: ``
        }
        const distance = this.calucalateDistance(toLocation, orderDelivery);
        if (!isNaN(distance)) {
          order.ShippingPrice = distance * Number(orderDelivery.Price);
          order.DistanceTotal = distance;
        }

      }

      if (orderDelivery.ItemSubCategory === DELIVERY_RATES.FLAT.Name) {
        order.ShippingPrice = orderDelivery.Price;

      }
      order.DeliveryRate = orderDelivery.ItemSubCategory;
      order = this.calculateTotalOverdue(order);
      this.updateOrderState(order);
    }

    if (order.Shipping === DELIVERY_TYPES.COLLECTION.Name) {
      order.ShippingPrice = 0;
      order = this.calculateTotalOverdue(order);
      this.updateOrderState(order);
    }
    return order;
  }

  calucalateDistance(toLocation: LocationModel, orderDelivery: Item) {
    // From Company to any location
    const cord1: LocationModel = {
      lat: orderDelivery.Latitude,
      lng: orderDelivery.Longitude,
      addressLine: ``,
      url: ``
    }

    const distance = this.calcCrow(cord1, toLocation);

    return Math.ceil(distance);
  }

  calcCrow(coords1: LocationModel, coords2: LocationModel) {
    // var R = 6.371; // km
    var R = 6371000;
    var dLat = this.toRad(coords2.lat - coords1.lat);
    var dLon = this.toRad(coords2.lng - coords1.lng);
    var lat1 = this.toRad(coords1.lat);
    var lat2 = this.toRad(coords2.lat);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d / 1000;
  }


  toRad(Value) {
    return Value * Math.PI / 180;
  }


  addToCart(product: Product, order: Order): Order {
    if (!order)
      order = this.initOrder();

    if (!order.Orderproducts)
      order.Orderproducts = [];


    if (product && product.ProductId) {
      product.SelectedQuantiy = product.SelectedQuantiy;
      const orderproduct = this.mapOrderproduct(product);
      order.Orderproducts.push(orderproduct);
      if (product.Company) {
        order.Company = product.Company;
      }
      order.CompanyId = product.CompanyId;
      this.calculateTotalOverdue(order);
    }
    return order;
  }


  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: product.CompanyId,
      ProductName: product.Name,
      TotalStock: product.TotalStock,
      ProductType: 'Product',
      Colour: product.SelectedCoulor || '',
      Size: product.SelectedSize || '',
      Quantity: product.SelectedQuantiy || 1,
      SubTotal: product.SelectedQuantiy * Number(product.RegularPrice),
      UnitPrice: product.SalePrice || product.RegularPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      CreateUserId: '',
      ModifyUserId: '',
      ProductVAT: product.ProductVAT || 'NA',
      StatusId: 1
    };
  }


  initOrder(updateState = false): Order {
    const order: Order =
    {
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: COMPANY,
      CustomerId: '',
      AddressId: '',
      Notes: '',
      Shipping: '',
      OrderType: ORDER_TYPE_SALES,
      Total: 0,
      Paid: 0,
      Due: 0,
      InvoiceDate: new Date(),
      DueDate: '',
      CreateUserId: 'shop',
      ModifyUserId: 'shop',
      Status: 'Not paid',
      StatusId: 1,
      Orderproducts: [],
      CartItems: 0,
      GrandTotal: 0
    }

    if (updateState)
      this.updateOrderState(order);

    return order;
  }


  deleteFromCart(orderproduct: Orderproduct, order: Order, index: number) {
    order.Orderproducts.splice(index, 1);
    if (order.Orderproducts.length === 0) {
      order = null;
    }
    this.calculateTotalOverdue(order);
  }
  addCustomerToOrder(item: User) {
    const order = this.currentOrderValue;
    if (!order)
      return;

    order.Customer = item;
    order.CustomerId = item.UserId;
    order.CustomerName = item.Name;
    order.CustomerEmail = item.Email;
    order.CustomerPhone = item.PhoneNumber;
    order.CustomerDp = item.Dp;
    this.updateOrderState(order);
  }
}
