import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from 'src/models/item.model';
import { COMPANY, ITEM_TYPES } from 'src/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ItemService {



  private ItemListBehaviorSubject: BehaviorSubject<Item[]>;
  public ItemListObservable: Observable<Item[]>;

  private ItemBehaviorSubject: BehaviorSubject<Item>;
  public ItemObservable: Observable<Item>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.ItemListBehaviorSubject = new BehaviorSubject<Item[]>([]);
    this.ItemBehaviorSubject = new BehaviorSubject<Item>(null);
    this.ItemListObservable = this.ItemListBehaviorSubject.asObservable();
    this.ItemObservable = this.ItemBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentItemValue(): Item {
    return this.ItemBehaviorSubject.value;
  }
  public get currentItemListValue(): Item[] {
    return this.ItemListBehaviorSubject.value;
  }



  add(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/add-item.php`, Item);
  }
  addRange(items: Item[]) {
    return this.http.post<Item>(`${this.url}/api/item/add-item-range.php`, items);
  }
  getItems(companyId: string, itemCategory: string, showChildren = false) {
    return this.http.get<Item[]>(`${this.url}/api/item/get-items.php?CompanyId=${companyId}&ItemCategory=${itemCategory}&ShowChildren=${showChildren}`)
  }

  getItem(ItemId: string) {
    return this.http.get<Item>(`${this.url}/api/item/get-by-id.php?ItemId=${ItemId}`);
  }

  getItemsBySubjectID(subjectId: string, gradeId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}/api/Item/get-Items.php?SubjectId=${subjectId}&GradeId=${gradeId}`)
  }
  update(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/update-item.php`, Item);
  }
  delete(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/delete.php`, Item);
  }

  loadItems(companyId: string, itemCategory: string, showChildren = false) {
    return this.http.get<Item[]>(
      `${this.url}/api/item/get-items.php?CompanyId=${companyId}&ItemCategory=${itemCategory}&ShowChildren=${showChildren}`)
      .subscribe(data => {
        this.ItemListBehaviorSubject.next(data || []);
      })
  }
  getNavTheme() {
    const data = this.currentItemListValue;
    if (data && data.length) {
      const navBarTheme = data.find(x => x.ItemType === ITEM_TYPES.NAV_BARTHEME.Name);
      if (navBarTheme)
        return navBarTheme.Description;
    }
    return null;
  }

  getWebsiteLogo() {
    const data = this.currentItemListValue;
    if (data && data.length) {
      const logoItem = data.find(x => x.ItemType === ITEM_TYPES.LOGO.Name);
      if (logoItem)
        return logoItem.ImageUrl;
    }
    return null;
  }

  initItem(catergory: string, type: string, name = ''): Item {
    return {
      ItemId: '',
      RelatedId: '',
      RelatedParentId: '',
      Name: name,
      ParentId: '',
      ItemType: type,
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
      ItemCategory: catergory,
      ItemSubCategory: '',
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    }

  }
}
