import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioChange } from '@angular/material/radio';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendDataSource } from 'src/app/services/backed-datasource';
import { PaginatedBackendService } from 'src/app/services/paginated-backend.service';
import { tap } from 'rxjs/operators';

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

  paginatedObject = {};
  totalPages = 0;
  currentPage = 0;
  totalEntries = 0;


  userSub: Subscription = new Subscription();


  user!: UserModel;
  dataSource!: BackendDataSource;
  displayedColumns = ['id', 'name', 'email', 'role', 'active', 'favoriteFoods'];


  @ViewChild(MatPaginator) paginator!: MatPaginator; // MatPaginator 
  @ViewChild(MatSort) sort!: MatSort; // MatSort

  
  constructor(private userService: UserService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router, private backendService: PaginatedBackendService, private route: ActivatedRoute) { 
    this.userSub = this.userService.getPaginated(1, 1).subscribe(data => this.totalEntries = data.totalItems);
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get("pageNumber"))
    let pageNumber = this.route.snapshot.paramMap.get("pageNumber")
    
    if (pageNumber) {
      this.currentPage = Number(this.route.snapshot.paramMap.get("pageNumber"));
    }
    this.dataSource = new BackendDataSource(this.backendService);
    console.log(this.user)
    this.dataSource.loadUsers('', 'asc', 0, 3);

  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadUserssPage())
        )
        .subscribe();



        
  }

  loadUserssPage() {
    console.log(':::: LOAD USERS PAGE ', this.paginator.pageIndex, this.paginator.pageSize)
    this.dataSource.loadUsers(
        '',
        'asc',
        this.paginator.pageIndex,
        this.paginator.pageSize);
  } 
  

  // applyFilter(filterValue: NgForm) {
  //   console.log(filterValue)
   
  //   if (filterValue) {
  //     let str: string = filterValue.value.searchFilter
  //     str.trim() // Remove whitespace
  //     this.dataSource.filter = str;
  //   } 
  // }

  // resetForm(filterValue: NgForm) {
  //   let str = filterValue.value.searchFilter = '';
  //   this.dataSource.filter = str;
  //   let node = document.getElementById('searchFilter')
  //   if (node) {
  //     node.setAttribute('value', ''); // HOW TO RESET FORM !!!
  //   }
  
  // }

  // getNextFifty(size: number) {
  //   console.log(size);

  //   this.currentPage++;
  //   if (this.currentPage <= this.totalPages) {
  //     this.userSub = this.userService.getPaginated(size, this.currentPage).subscribe(data => {
  //       this.users = data.foodFriends;
  //       this.dataSource = new MatTableDataSource(this.users);
  //       this.dataSource.data = this.users;
  //       this.totalPages = data.totalPages;
  //       this.currentPage = data.currentPage;
  //       this.ngAfterViewInit();
  //     })
  //   } else {
  //     this.openSnackBar('No more entries, bro', 'MEOW')
  //   }
  // }

  resetEntries(size: number) {
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate(['admin-dashboard'])
    })
    // this.currentPage = 0;
    // if (this.currentPage <= this.totalPages) {
    //   this.userSub = this.userService.getPaginated(size, 0).subscribe(data => {
    //     this.users = data.foodFriends;
    //     this.dataSource = new MatTableDataSource(this.users);
    //     this.dataSource.data = this.users;
    //     this.totalPages = data.totalPages;
    //     this.currentPage = data.currentPage;
    //     this.ngAfterViewInit();
    //   })
    // }
  }

  editUser(user: UserModel, id: number) {
    const index = this.users.indexOf(user);
    // this.users.find()
    console.log('<><> CHANGED USER??? >>> ', this.users[index])
    this.userService.updateUser(id, this.users[index]).subscribe((result: UserModel) => {
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

  // get activityFormArray() {
  //   return this.updateUserForm.controls.activity as FormArray;
  // }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
