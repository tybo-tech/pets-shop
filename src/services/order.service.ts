import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Order } from 'src/models/order.model';
import { ADD_ORDER_URL, DELIVERY_RATES, DELIVERY_TYPES, GET_ORDERS_BY_USER_ID_URL, GET_ORDERS_URL, GET_ORDER_URL, PRINT_URL, UPDATE_ORDER_URL } from 'src/shared/constants';
import { Item } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';


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
  calculateTotalOverdue(order: Order) {
    if (!order)
      return 0;
    order.Total = 0;
    order.Orderproducts.forEach(line => {
      order.Total += (Number(line.UnitPrice) * Number(line.Quantity));
    });

  }



  deliveryMethodChanged(order: Order, orderDelivery: Item) {
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
      this.updateOrderState(order);
    }

    if (order.Shipping === DELIVERY_TYPES.COLLECTION.Name) {
      order.ShippingPrice = 0;
      this.updateOrderState(order);
    }
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
}
