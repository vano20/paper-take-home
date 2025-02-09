import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../service/user.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TableModule } from '../../../../shared/components/table/table.module';
import { Router } from '@angular/router';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'setSearchTerm']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, TableModule],
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    mockUserService.filteredUsers$ = of([
      {
        id: 1, name: 'John Doe', email: 'john@example.com', website: 'https://example.com', phone: '123-456-7890', address: {
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'Anytown',
          zipcode: '12345',
          geo: {
            lat: '40.7128',
            lng: '-74.0060'
          }
        },
        company: {
          name: 'ACME Corp',
          catchPhrase: 'The best company',
          bs: 'High level approach on the web'
        }
      },
    ]);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user list', () => {
    const userRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(userRows.length).toBe(1);
  });

  it('should call setSearchTerm when search input changes', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Jane';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(mockUserService.setSearchTerm).toHaveBeenCalledWith('Jane');
  });

  it('should call navigate when a row button detail is clicked', fakeAsync(() => {
    const mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');

    fixture.detectChanges();

    const userRowButton = fixture.debugElement.query(By.css('tbody tr button'));
    expect(userRowButton).not.toBeNull();

    userRowButton.nativeElement.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith([1], { relativeTo: jasmine.anything() });
  }));
});