import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioChange } from '@angular/material/radio';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendDataSource } from 'src/app/services/backed-datasource';
import { PaginatedBackendService } from 'src/app/services/paginated-backend.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

export interface Role {
  val: string;
  name: string;
}

@Component({
  selector: 'ff-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit, OnInit {
  users: UserModel[] = [];
  roleList: Role[] = [
    { val: 'ROLE_ADMIN', name: 'Admin'},
    { val: 'ROLE_USER', name: 'User' },
    { val: 'ROLE_PEASANT', name: 'Peasant', }
  ];
  totalPages = 0;
  currentPage = 0;
  totalEntries = 0;

  userSub: Subscription = new Subscription();

  user!: UserModel;
  dataSource!: BackendDataSource;
  displayedColumns = ['id', 'name', 'email', 'role', 'active', 'favoriteFoods'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // MatPaginator 
  @ViewChild(MatSort) sort!: MatSort; // MatSort
  @ViewChild('input') input!: ElementRef; //MatInput

  constructor(private userService: UserService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router, private backendService: PaginatedBackendService, private route: ActivatedRoute) { 
    this.userSub = this.userService.getPaginated(1, 1).subscribe(data => this.totalEntries = data.totalItems);
    
  }

  ngOnInit(): void {
    this.dataSource = new BackendDataSource(this.backendService);
    this.dataSource.loadUsers('', 'asc', 0, 3);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0;
            this.loadUserssPage();
        })
    )
    .subscribe();

    // server-side sort
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadUserssPage())
        )
        .subscribe();
  }

  loadUserssPage() {
    console.log(':::: LOAD USERS PAGE ', this.input.nativeElement.value, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize)

    this.dataSource.loadUsers(
      this.input.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
  } 
  
  editUser(user: UserModel, id: number) {
    // const index = this.users.indexOf(user);
    // this.users.find()
    console.log('<><> CHANGED USER??? >>> ', user)
    this.userService.updateUser(id, user).subscribe((result: UserModel) => {
      console.log(result);
      this.openSnackBar('User Updated', 'Admins FTW 🤘')
    })
  }

  onRoleChange(selected: MatRadioChange, user: UserModel) {
 
    user.role = selected.value;
    // const index = this.users.indexOf(user);

    console.log('<><> CHANGED USER??? >>> ', user)
    this.userService.updateUser(user.id, user).subscribe((result: UserModel) => {
      console.log(result);
      this.openSnackBar('User Updated', 'Admins FTW 🤘')
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
