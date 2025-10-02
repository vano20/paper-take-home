import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TableModule } from '../../../../shared/components/table/table.module';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { error, filteredUser, loading } from '../../../../state/user/user.selectors';
import { loadUsers, setFilter } from '../../../../state/user/user.actions';

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    website: 'example.com',
    url: 'https://example.com',
    phone: '123-456-7890',
    address: {
      street: '123 Main St',
      suite: 'Apt 1',
      city: 'Anytown',
      zipcode: '12345',
      geo: {
        lat: '40.7128',
        lng: '-74.0060',
      },
    },
    company: {
      name: 'ACME Corp',
      catchPhrase: 'The best company',
      bs: 'High level approach on the web',
    },
    posts: []
  },
];

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockStore: MockStore;
  let mockRouter: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, TableModule, StoreModule.forRoot({})],
      declarations: [UserListComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockRouter = TestBed.inject(Router);

    mockStore.overrideSelector(filteredUser, mockUsers);
    mockStore.overrideSelector(loading, false);
    mockStore.overrideSelector(error, null);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user list', () => {
    const userRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(userRows.length).toBe(1);
  });

  it('should dispatch setUserFilter when search input changes', () => {
    spyOn(mockStore, 'dispatch');

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Jane';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(setFilter({ filter: 'Jane' }));
  });

  it('should dispatch loadUsers on init', () => {
    spyOn(mockStore, 'dispatch');

    component.ngOnInit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(loadUsers({ metas: { page: 1, perPage: 10 } }));
  })

  it('should navigate when a row button detail is clicked', fakeAsync(() => {
    spyOn(mockRouter, 'navigate');

    fixture.detectChanges();

    const userRowButton = fixture.debugElement.query(By.css('tbody tr button'));
    expect(userRowButton).not.toBeNull();

    userRowButton.nativeElement.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith([1], { relativeTo: jasmine.anything() });
  }));
});